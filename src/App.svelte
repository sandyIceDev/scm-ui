<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Router from "svelte-spa-router"
  import Login from './Routes/Login.svelte';
  import Home from './Routes/Home.svelte';

  const routes = {
    '/':Home,
    '/Login':Login,
  }
</script>

<Router {routes}/>