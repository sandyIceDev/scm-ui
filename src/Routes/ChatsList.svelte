<script>
    import IconButton, { Icon } from "@smui/icon-button";
    import Fab from "@smui/fab";
    import { chats } from "../store/chat";
    import CircularProgress from '@smui/circular-progress';
	import { createEventDispatcher, onMount } from "svelte";
	import { toast } from "@zerodevx/svelte-toast";
	import ChatItem from "./ChatItem.svelte";
	import { user } from "../store/user";
	import Chat from "./Chat.svelte";
    let currentTab = "chats";
    let contentInput = '';
    export let connection_state;
    function setTab(tabName){
        currentTab = tabName;
    }
    function doSearch(){
        console.log(chats.getChats());
    }
    function handleChatRequest(){
        chats.request(contentInput).then(res=>{
            toast.push(res,{theme:{
            '--toastBackground': '#4bb543',
            '--toastColor': 'black',
            }});
        currentTab = "chats";
      }).catch(e=>{
        toast.push(e.message,{theme:{
          '--toastBackground': '#ff1010',
          '--toastColor': 'white',
        }});
      });
    }
    onMount(()=>{
        chats.refresh();
    });
    
</script>
<svelte:head>
    <link href="/css/chats.css" rel="stylesheet" type="text/css" />
</svelte:head>
<section class="side">
    <nav class="app-bar">
        <div>
            <IconButton class="material-icons">
                menu
            </IconButton>
        </div>
        <h1>
            {#if connection_state}
                {#if connection_state === "connected"}
                    scm
                {:else if connection_state === "disconnected"}
                disconnected
                {:else if connection_state === "pending"}
                <div style="display: flex; justify-content: space-between;">
                    connecting <CircularProgress style="height: 15px; width: 15px;" indeterminate />
                </div>
                {/if}
            {:else}
                connection state
            {/if}
        </h1>
        <div>
            {#if currentTab === "chats"}
                <IconButton class="material-icons" on:click={doSearch}> <!--setTab("search")-->
                    search
                </IconButton>
            {:else}
                <IconButton class="material-icons" style="color:red;" on:click={()=>setTab("chats")}>
                    cancel
                </IconButton>
            {/if}
        </div>   
    </nav>
    <div class="app-content">
            {#if currentTab === "chats"}
                <div class="contacts">
                    {#each Object.entries($chats) as [chatId,chat] (chatId)}
                        <ChatItem chatId={chatId} on:selctChat />
                    {/each}
                </div>
            {:else if currentTab === "search"}
            <h1>search</h1>
                <!-- <div class="search-tab">
                        <div class="search-form">
                            <input placeholder="username | chat-id" />
                            <button>search</button>
                        </div>
                        <div class="contacts">
                    
                        </div>
                    </div> -->
            {:else if currentTab === "addChat"}
                <div class="create-chat-tab">
                    <div class="send-request-from">
                        <input bind:value={contentInput} placeholder="username | chat-id" />
                        <button on:click={handleChatRequest}>send request</button>
                    </div>
                </div>
            {/if}
    </div>
    {#if currentTab === "chats"}
        <div class="create-chat-btn">
            <Fab on:click={()=>setTab("addChat")}>
                <Icon class="material-icons">forward_to_inbox</Icon>
            </Fab>
        </div>
    {/if}
</section>