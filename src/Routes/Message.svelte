<script>
	import { Icon } from "@smui/button";
    export let mid;
    export let content;
    export let time;
    export let seen = false;
    export let me = false; 
    let messageDirection  = me ? "message-right" : "message-left";
    let formatedTime = new Date(time).toLocaleString("fa-IR",{hour: 'numeric', minute: 'numeric'})
    $: htmlContent = content.replaceAll("\n","</br>");
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
                    {#if seen}
                        <Icon class="material-icons">done_all</Icon>
                    {:else}
                        <Icon class="material-icons">done</Icon>
                    {/if}
                {/if}
            </p>
        </div>
    </div>
</div>