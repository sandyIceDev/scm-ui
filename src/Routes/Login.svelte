<script>
    //https://www.npmjs.com/package/elliptic
  
    let email = "";
    let password = "";
    import { aesDecrypt, aesEncrypt, generateEllipticParikey , generateEllipticShareKey} from '../lib/cr'
    import '../assets/css/login.css'
    function handleSubmit() {
      let x= generateEllipticParikey();
      let y= generateEllipticParikey();
      let shared1 = generateEllipticShareKey(x.private,y.public);
      let shared2 = generateEllipticShareKey(y.private,x.public);
      console.log(shared1);
      console.log(shared2 === shared1);
      let e = aesEncrypt(shared1,"this is message");
      console.log(e);
      let d = aesDecrypt(shared2,e);
      console.log(d);
    }
  </script>
  
  <svelte:head>
    <link href="/css/login.css" rel="stylesheet" type="text/css">
  </svelte:head>

  <div class="container">
    <div class="card">
      <div class="card-header">Login</div>
      <div class="card-body">
        <form on:submit|preventDefault={handleSubmit}>
          <label for="email">Email:</label>
          <input type="email" id="email" bind:value={email} placeholder="Enter your email address">
  
          <label for="password">Password:</label>
          <input type="password" id="password" bind:value={password} placeholder="Enter your password">
  
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </div>
  