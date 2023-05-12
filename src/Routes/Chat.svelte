<script>
    import IconButton from "@smui/icon-button";
	import Message from "./Message.svelte";
</script>
<svelte:head>
    <link href="/css/message.css" rel="stylesheet" type="text/css" />
</svelte:head>
<section class="main">
    <nav class="app-bar">
        <div>
            <h1>contact name</h1>
        </div>
        <div>
            <IconButton class="material-icons">
                more_vert
            </IconButton>
        </div> 
    </nav>
    <div class="app-content">
        <Message content="test" time={new Date().getTime()} me={true} seen={false} mid={12}/>
        <Message content="test" time={new Date().getTime()} me={true} seen={true} mid={13}/>
    </div>
</section>
