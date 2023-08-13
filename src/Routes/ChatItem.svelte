<script>
	import { createEventDispatcher, onMount } from "svelte";
    import {sha256} from "../lib/cr";
    import { chats,chatType } from "../store/chat";
    import { user } from "../store/user";
	import { Icon } from "@smui/button";


    export let chatId;
    $: chatItem = $chats[chatId];
    let peer = null;
    let name;
    let username;
    export let lastSeen = undefined;
    let profile;

    function getRandomColor(username) {
        const letters = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += sha256(username).charAt(i) ;//letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function getContrastYIQ(hexcolor){
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '000' : 'fff';
    }

    function generateRandomColorPair(username) {
        let backgroundColor = getRandomColor(username);
        let foregroundColor = getContrastYIQ(backgroundColor);
        return {background: backgroundColor, foreground: foregroundColor};
    }

    onMount(()=>{
        if(chatItem.chatType === chatType.private){
            peer = chatItem.peers.find(x=>x.username !== $user.username);
            if(peer === undefined)
                peer = chatItem.peers[0];
            name = peer.name;
            username = peer.username;
            if(profile === undefined){
                let colorPair = generateRandomColorPair(username);
                profile = `https://ui-avatars.com/api/?name=${username}&rounded=true&background=${colorPair.background}&color=${colorPair.foreground}&bold=true`;
            }
        }
        if(chatItem.chatType === chatType.me){
            name = "saved message";
            username = "saved message";
            if(profile === undefined){
                let colorPair = generateRandomColorPair(username);
                profile = `https://ui-avatars.com/api/?name=${username}&rounded=true&background=${colorPair.background}&color=${colorPair.foreground}&bold=true`;
            }
        }
    });
    const dispatch = createEventDispatcher();
    function HandleChat(){
        dispatch('selectChat', {
            chatId
        });	
    }

        
</script>

<div class="contact" on:mousedown={HandleChat}>
    <img class="avatar" src={profile} alt={username} />
    <div class="contact-name">
        {name}
    </div>
    <div class="last-seen">
        {#if lastSeen}
            {new Date(lastSeen).toLocaleString("fa-IR")}
        {/if}
    </div>
</div>