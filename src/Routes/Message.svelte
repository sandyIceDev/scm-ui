<script>
	import { Icon } from "@smui/button";
    export let mid;
    export let content;
    export let time;
    export let seen;
    export let me = false; 
    let messageDirection  = me ? "message-right" : "message-left";
    let formatedTime = new Date(time).toLocaleString("fa-IR",{hour: 'numeric', minute: 'numeric'})
</script>

<div class={messageDirection} data-mid={mid}>
    <div class="message">
        <div class="message-body">
            <p class="content">{content}</p>
        </div>
        <div class="message-footer">
            <p class="time">{formatedTime}</p>
            <p class="seen">
            {#if seen}
                <Icon class="material-icons">done_all</Icon>
            {:else}
                <Icon class="material-icons">done</Icon>
            {/if}
            </p>
        </div>
    </div>
</div>