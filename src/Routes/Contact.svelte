<script>
	import { createEventDispatcher } from "svelte";
    import {sha256} from "../lib/cr";
    export let uuid;
    export let name;
    export let username;
    export let lastSeen;
    export let profile = undefined;
    

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

    if(profile === undefined){
        let colorPair = generateRandomColorPair(username);
        profile = `https://ui-avatars.com/api/?name=${username}&rounded=true&background=${colorPair.background}&color=${colorPair.foreground}&bold=true`;
    }
    function HandleChat(){
    const dispatch = createEventDispatcher();
        dispatch('ChatContact', {
            uuid
        });	
    }
    $:lastSeenPersian = new Date(lastSeen).toLocaleString("fa-IR");
</script>

<div class="contact" on:mousedown={HandleChat}>
    <img class="avatar" src={profile} alt={name.substring(2).toUpperCase()} />
    <div class="contact-name">
        {name}
    </div>
    <div class="last-seen">
        {lastSeenPersian}
    </div>
</div>