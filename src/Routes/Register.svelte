<script>
  import {user} from "../store/user";
  import { toast } from "@zerodevx/svelte-toast";
  import { push } from "svelte-spa-router";  
  import { onMount } from "svelte";
    let name = "";
    let username = "";
    let password = "";
    let email = "";
    let code = "";
    let loading = false;
    let handleRegister = ()=>{
      loading = true;
      user.register(name,username,password,email).then(result=>{
          toast.push(result,{theme:{
            '--toastBackground': '#4bb543',
            '--toastColor': 'black',
          }});
          loading = false;
        }).catch(e=>{
          toast.push(e.message,{theme:{
            '--toastBackground': '#ff1010',
            '--toastColor': 'white',
          }});
          loading = false;
        });
    };
    let handleActivate = ()=>{
      loading = true;
      user.verify(code).then(res=>{
          toast.push("your account activated successfully",{theme:{
            '--toastBackground': '#4bb543',
            '--toastColor': 'black',
          }});
          loading = false;
          push("#/");
        }).catch(e=>{
          toast.push(e.message,{theme:{
            '--toastBackground': '#ff1010',
            '--toastColor': 'white',
          }});
          loading = false;
        });
    };
    let handleResendCode = ()=>{
        user.resendCode().then((res)=>{
          toast.push(res,{theme:{
            '--toastBackground': '#4bb543',
            '--toastColor': 'black',
          }});
        }).catch(e=>{
          toast.push(e.message,{theme:{
            '--toastBackground': '#ff1010',
            '--toastColor': 'white',
          }});
        });
    };
</script>

<svelte:head>
  <link href="/css/register.css" type="text/css" rel="stylesheet" />
</svelte:head>

  {#if $user == null}
  <div class="container">
    <div class="card">
      <div class="card-header">Register</div>
      <div class="card-body">
        <form on:submit|preventDefault={handleRegister}>
            <label for="name">Name:</label>
            <input type="text" id="name" bind:value={name} placeholder="Enter your name">

            <label for="username">Username:</label>
            <input type="text"  id="username" bind:value={username} placeholder="Enter your username">
        
            <label for="email">Email:</label>
            <input type="text"  id="email" bind:value={email} placeholder="Enter your email address">
        
            <label for="password">Password:</label>
            <input type="password"  id="password" bind:value={password} placeholder="Enter your password">
            <button type="submit" disabled={loading}>Register</button>
        </form>
      </div>
    </div>
  </div>
{:else if $user.verify}
  <div>
    <h1> please signout your account first <br/>
      at profile section
    </h1>
  </div>
{:else}
  <div class="container">
    <div class="card">
      <div class="card-header">Verify Your Email Address</div>
      <div class="card-body">
        <form on:submit|preventDefault={handleActivate}>
            <label for="code">Code:</label>
            <input type="text" id="code" bind:value={code} placeholder="Enter your activation code">
          <button type="submit" disabled={loading} style="background-color: chartreuse;">Confirm</button>
        </form>
      </div>
      <button on:click={handleResendCode}>resend code ?</button>
    </div>
  </div>
{/if}
  