<script>
	import { onMount } from "svelte";
    import { user } from "../store/user";
    import { push } from "svelte-spa-router";
	import Chat from "./Chat.svelte";
	import { toast } from "@zerodevx/svelte-toast";
	import ChatsList from "./ChatsList.svelte";
	import { chats } from "../store/chat";
	import { peer } from "../store/peer";
    import updateHandler from "../store/update";

    let websocket = null;
    let connection_state = "pending";
    
    
    function handleConnect(){
        websocket = new WebSocket(`ws://127.0.0.1:5000/api/ws/${$user.uuid}`);
        connection_state = "pending"
        websocket.onopen = (e)=>{
            console.log("connected to server!");
            connection_state = "connected";
        };
        websocket.onmessage = updateHandler;
        websocket.onclose = (e)=>{
            connection_state = "disconnected";
        };
    }
    
    onMount(()=>{
        user.check().then(checkd=>{
            if(checkd === "login")
                push("#/login");
            else if(checkd === "register")
                push("#/register");
            else if(checkd === false){
                user.logout();
                toast.push("some thing went wrong",{theme:{
                    '--toastBackground': '#ff1010',
                    '--toastColor': 'black',
                }});
                push("#/login");
            }
            else{
                handleConnect();
                let intervalId = setInterval(()=>{
                    if(connection_state === "disconnected")
                        handleConnect();
                },5000);
            }
        }).catch(err=>{
            console.log("fail to check router");
        })
    });
    function HandleChat(e){
        let selectedChatId = e.detail.chatId;
        console.log(e.detail);
        peer.setChatId(selectedChatId);
    }
    
</script>

<svelte:head>
    <link href="/css/main.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<div class="container">
    <ChatsList on:selctChat={HandleChat} connection_state={connection_state}/>
    <Chat/>
</div>