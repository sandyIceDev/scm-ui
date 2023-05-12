<script>
  import Router  from "svelte-spa-router"
  import Login from './Routes/Login.svelte';
  import Home from './Routes/Home.svelte';
	import Register from './Routes/Register.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast'
  const routes = {
    '/':Home,
    '/login':Login,
    '/register':Register,
  }
</script>

<SvelteToast />
<Router {routes}/>