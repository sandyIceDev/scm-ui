<script>
	import { Icon } from "@smui/button";
    import { messages } from "../store/message";
	import { onMount } from "svelte";
	import { peer } from "../store/peer";
	import { user } from "../store/user";
    export let mid;
    let msg  ={
        content:"loading..."
    };
    let me = false;
    let seen = false;
    let messageDirection;
    let formatedTime;
    onMount(()=>{
        msg =  messages.getMessage(mid);
        peer.decryptMessage(msg);
        let u = user.getUser();
        if(msg.user.username === u.username)
            me = true;
        messageDirection  = me ? "message-right" : "message-left";
        formatedTime = new Date(msg.updatedAt).toLocaleString("fa-IR",{hour: 'numeric', minute: 'numeric'})
    });
    $: htmlContent = msg.content.replaceAll("\n","</br>");

</script>

<div class={messageDirection} data-mid={mid}>
    <div class="message">
        <div class="message-body">
            <p class="content">{@html htmlContent}</p>
        </div>
        <div class="message-footer">
            <p class="time">{formatedTime}</p>
            <p class="seen">
                {#if !me}
                    {#if msg.seen}
                        <Icon class="material-icons">done_all</Icon>
                    {:else}
                        <Icon class="material-icons">done</Icon>
                    {/if}
                {/if}
            </p>
        </div>
    </div>
</div>