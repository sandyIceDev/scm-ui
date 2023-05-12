<script>
    //https://www.npmjs.com/package/elliptic
    import { toast } from '@zerodevx/svelte-toast'
    import { user } from "../store/user"; 
    import Button, {Label} from "@smui/button";
    import { onMount,onDestroy } from "svelte";
    let username = "";
    let password = "";
    function handleSubmit() {
        user.login(password,username).then(res=>{
          toast.push("login successfull",{theme:{
            '--toastBackground': '#4bb543',
            '--toastColor': 'black',
          }});
        }).catch(e=>{
          toast.push(e.message,{theme:{
            '--toastBackground': '#ff1010',
            '--toastColor': 'white',
          }});
        });
    }
</script>

<svelte:head>
  <link href="/css/login.css" type="text/css" rel="stylesheet" />
</svelte:head>


  <div class="container">
    <div class="card">
      <div class="card-header">Login</div>
      <div class="card-body">
        <form on:submit|preventDefault={handleSubmit}>
          {#if $user === null}            
          <label for="username">Username:</label>
          <input type="text" id="username" bind:value={username} placeholder="Enter your username">
          {/if}
  
          <label for="password">Password:</label>
          <input type="password" id="password" bind:value={password} placeholder="Enter your password">
  
          <Button type="submit"><Label>Login</Label></Button>
        </form>
      </div>
    </div>
  </div>
  