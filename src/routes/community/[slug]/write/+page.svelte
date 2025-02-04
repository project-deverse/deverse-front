<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { createPost } from '$lib/utils/api'; // 글쓰기 API 호출 함수
  
    let title = '';
    let content = '';
    let error: string | null = null;
    let isSubmitting = false;
  
    // 현재 게시판 ID 가져오기
    $: boardId = $page.params.slug;
  
    async function submitPost() {
      if (!title.trim() || !content.trim()) {
        error = '제목과 내용을 모두 입력해주세요.';
        return;
      }
  
      isSubmitting = true;
      error = null;
  
      try {
        // 글 작성 API 호출
        await createPost( parseInt(boardId), title, content );
  
        // 작성 완료 후 게시판 페이지로 이동
        goto(`/community/${boardId}`);
      } catch (e) {
        if (e instanceof Error) {
          error = e.message;
        } else {
          error = '알 수 없는 오류가 발생했습니다.';
        }
      } finally {
        isSubmitting = false;
      }
    }
  </script>
  
  <svelte:head>
    <title>글쓰기 - Deverse</title>
  </svelte:head>
  
  <div class="write-container">
    <h1>글쓰기</h1>
  
    {#if error}
      <p class="error">{error}</p>
    {/if}
  
    <form on:submit|preventDefault={submitPost}>
      <div class="form-group">
        <label for="title">제목</label>
        <input
          id="title"
          type="text"
          bind:value={title}
          required
          placeholder="제목을 입력하세요"
        />
      </div>
      <div class="form-group">
        <label for="content">내용</label>
        <textarea
          id="content"
          bind:value={content}
          required
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>
      <button
        type="submit"
        class="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? '작성 중...' : '등록'}
      </button>
    </form>
  </div>
  
  <style>
    .write-container {
      max-width: 600px;
      margin: 0 auto;
    }
  
    .form-group {
      margin-bottom: 1rem;
    }
  
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
  
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-group textarea {
      height: 200px;
    }
  
    .submit-button {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .submit-button:disabled {
      background-color: #94d3a2;
      cursor: not-allowed;
    }
  
    .submit-button:hover:enabled {
      background-color: #218838;
    }
  
    .error {
      color: red;
      margin-bottom: 1rem;
    }
  </style>
  