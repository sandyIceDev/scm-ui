<script>
    import IconButton, { Icon } from "@smui/icon-button";
	import Message from "./Message.svelte";
    import { peer } from "../store/peer";
	import { onDestroy, onMount } from "svelte";
	import { PvChatStatus, chatType, chats } from "../store/chat";
	import { user } from "../store/user";
	import Fab from "@smui/fab";
    import { toast } from "@zerodevx/svelte-toast";


    let contact;
    let chat;
    let inbox;
    let messages = [];
    let askApproveChat = false;

    function initial(){
        if(chat){
            inbox = '';
            if(chat.chatType === chatType.private){
                contact = chat.peers.find(x=>x.username !== $user.username);
                if(chat.private.status === PvChatStatus.pending && chat.creator !== $user.uuid)
                    askApproveChat = true;
                else
                    askApproveChat = false;
            }
            if(chat.chatType === chatType.me)
            {
                contact = {
                    name:"saved message"
                }
            }
        }
    }
    let unsubpeer;
;
    onMount(()=>{
        unsubpeer = peer.subscribe(x=>{
            chat = x;
            initial();
        });
    });
    onDestroy(()=>{
        unsubpeer();
    })

        
    function handleAnswerRequest(response){
        chats.feedback(response,$peer.chatId).catch(e=>{
            toast.push(e.message,{theme:{
                '--toastBackground': '#ff1010',
                '--toastColor': 'white',
            }});
      });
    }
    function handleSend(){
        peer.sendMessage(inbox).catch(e=>{
            toast.push(e.message,{theme:{
                '--toastBackground': '#ff1010',
                '--toastColor': 'white',
            }});
        });
        // messages = [
        //     ...messages
        //     ,{
        //         content:inbox,
        //         time:new Date().getTime(),
        //         me:true,
        //         seen:false,
        //         mid:messages.length
        //     }
        // ];
        inbox = "";
    }

</script>
<svelte:head>
    <link href="/css/message.css" rel="stylesheet" type="text/css" />
</svelte:head>
<section class="main">
    {#if chat !== null}
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
        {#if askApproveChat}
        <div class="app-approvebar">
            <p style="color:black">
                accept his request?
            </p>
            <Fab mini on:click={()=>{handleAnswerRequest(true)}}>
                <Icon class="material-icons" style="color:aqua">check_circle</Icon>
            </Fab>
            <Fab mini on:click={()=>{handleAnswerRequest(false)}}>
                <Icon class="material-icons" style="color:red;">cancel</Icon>
            </Fab>
        </div>
        {:else}
        <div class="app-inbar" contenteditable="true" bind:innerText={inbox} >
        </div>
        <Fab class="send-btn" mini on:click={handleSend}>
            <Icon class="material-icons">
                send
            </Icon>
        </Fab> 
        {/if}   
    {:else}
        <div class="welcom">
            <h1>welcom to scm</h1>
        </div>
    {/if}
</section>
