<script>
    import IconButton from "@smui/icon-button";
	import Contact from "./Contact.svelte";
    let users = [{
        uuid:"3ae78735-cee5-4a41-8d5c-5dfe86beec2b",
        name:"Mahdi",
        username:"Mahdi",
        lastSeen:1683279771696
    },{
        uuid:"3ae78735-cee5-4a41-8d5c-5dfe86beec3b",
        name:"admin",
        profile:"/images/cat.avif",
        username:"Admin",
        lastSeen:1683279771696
    },{
        uuid:"3ae78735-cee5-4a41-8d5c-5dfe86beec4b",
        name:"Asgar",
        username:"Asgar",
        lastSeen:1683279771696
    },{
        uuid:"3ae78735-cee5-4a41-8d5c-5dfe86beec5b",
        name:"Helia",
        username:"Helia",
        lastSeen:1683279771696
    }]
</script>
<svelte:head>
    <link href="/css/contact.css" rel="stylesheet" type="text/css" />
</svelte:head>
<section class="side">
    <nav class="app-bar">
        <div>
            <IconButton class="material-icons">
                menu
            </IconButton>
        </div>
        <h1>
            connection state
        </h1>
        <div>
            <IconButton class="material-icons">
                search
            </IconButton>
        </div>   
    </nav>
    <div class="app-content">
        <div class="contacts">
            {#each users as user (user.uuid)}
                <Contact {...user} on:ChatContact />
            {/each}
        </div>
    </div>
</section>