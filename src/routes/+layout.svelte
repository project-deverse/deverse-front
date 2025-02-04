<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import '../app.css';

  onMount(() => {
    auth.checkAuth();
  });
</script>

<Header />

<main>
  <slot />
</main>

<Footer />
