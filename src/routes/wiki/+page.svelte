<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/stores/auth';
    import { api } from '$lib/utils/api';
  
    interface WikiPage {
      id: string;
      title: string;
      content: string;
      lastUpdated: string;
    }
  
    let pages: WikiPage[] = [];
  
    onMount(async () => {
      try {
        pages = await api.getWikiPages();
      } catch (error) {
        console.error('Failed to fetch wiki pages:', error);
      }
    });
  </script>
  
  <svelte:head>
    <title>Wiki - Deverse</title>
  </svelte:head>
  
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Wiki</h1>
  
    {#if $auth.isAuthenticated}
      <a href="/wiki/new" class="inline-block mb-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Create New Wiki Page
      </a>
    {/if}
  
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each pages as page}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-2">
            <a href={`/wiki/${page.id}`} class="text-blue-600 hover:underline">{page.title}</a>
          </h2>
          <p class="text-gray-600 mb-4">{page.content.substring(0, 100)}...</p>
          <div class="text-sm text-gray-500">
            Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      {/each}
    </div>
  </div>