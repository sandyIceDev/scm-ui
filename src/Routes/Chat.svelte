<script>
    import IconButton, { Icon } from "@smui/icon-button";
	import Message from "./Message.svelte";
    import { chatId } from "../store/peer";
	import { onDestroy, onMount } from "svelte";
	import { chatType, chats } from "../store/chat";
	import { user } from "../store/user";
	import Fab from "@smui/fab";

    let chat;
    let peer;
    let inbox;
    let messages = [];
    let unsubchatId = chatId.subscribe(chid=>{
        inbox = '';
        if(chid && $chats){
            chat = $chats.find(x=>x.chatId === chid);
            if(chat){
                if(chat.chatType === chatType.private){
                    peer = chat.peers.find(x=>x.username !== $user.username);
                }
                if(chat.chatType === chatType.me)
                {
                    peer = {
                        name:"saved message"
                    }
                }
            }
        }
    });

    onDestroy(()=>{
        unsubchatId();
    });
    function handleSend(){
        messages.push({
            content:inbox,
            time:new Date().getTime(),
            me:true,
            seen:false,
            mid:messages.length
        });
    }

</script>
<svelte:head>
    <link href="/css/message.css" rel="stylesheet" type="text/css" />
</svelte:head>
<section class="main">
    {#if chat !== undefined}
    <nav class="app-bar">
        <div>
            <h1>{peer.name}</h1>
        </div>
        <div>
            <IconButton class="material-icons">
                more_vert
            </IconButton>
        </div> 
    </nav>
    <div class="app-content">
        {#each messages as m,i}
        <Message {...m}/>
        {/each}
    </div>
    <div class="app-inbar" contenteditable="true" bind:innerText={inbox} >
    </div>
    <Fab class="send-btn" mini on:click={handleSend}>
        <Icon class="material-icons">
            send
        </Icon>
    </Fab>    
    {:else}
        <div class="welcom">
            <h1>welcom to scm</h1>
        </div>
    {/if}
</section>
