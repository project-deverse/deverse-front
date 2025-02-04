<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api, type Board } from '$lib/utils/api';
  import '$styles/community.css';

  let boards: Board[] = [];
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      boards = await api.getBoards();
    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = String(e);
      }
    } finally {
      isLoading = false;
    }
  });

  function handleBoardClick(boardId: string) {
    goto(`/community/${boardId}`);
  }
</script>

<svelte:head>
  <title>커뮤니티 - Deverse</title>
</svelte:head>

<div class="community-container">
  <h1>커뮤니티 게시판</h1>

  {#if isLoading}
    <p>게시판 목록을 불러오는 중...</p>
  {:else if error}
    <p class="error">오류 발생: {error}</p>
  {:else}
    <ul class="board-list">
      {#each boards as board (board.id)}
        <button class="board-item" on:click={() => handleBoardClick(String(board.id))} on:keydown={(e) => e.key === 'Enter' && handleBoardClick(String(board.id))}>
          <h2>{board.name}</h2>
          <p>{board.description}</p>
          <span class="post-count">게시글 수: {board.post_count}</span>
        </button>
      {/each}
    </ul>
  {/if}
</div>