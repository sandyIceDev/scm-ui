<script>
	import { onMount } from "svelte";
    import { user } from "../store/user";
    import { push } from "svelte-spa-router";
	import Chat from "./Chat.svelte";
	import Contacts from "./Contacts.svelte";
    
    onMount(()=>{
        user.check().then(checkd=>{
            if(checkd === "login")
                push("#/login");
            else if(checkd === "register")
                push("#/register");
        }).catch(err=>{
            console.log("fail to check router");
        })
    });
    function HandleChat(e){
        let uuid = e.detail.uuid;
        console.log("change route to "+uuid);
    }
</script>

<svelte:head>
    <link href="/css/main.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<div class="container">
    <Contacts on:ChatContact={HandleChat} />
    <Chat />
</div>