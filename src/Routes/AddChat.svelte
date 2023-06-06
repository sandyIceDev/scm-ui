<script>
    let newChatName;
</script>
<svelte:head>
    <link href="/css/main.css" rel="stylesheet" type="text/css" />
</svelte:head>
<div>
    <input bind:this={newChatName} />
    <button >search</button>
    <h1>{newChatName}</h1>
</div>