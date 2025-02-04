<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; // 페이지 이동에 필요한 import 추가
	import '$styles/community.css';
	import { getBoardPosts } from '$lib/utils/api';

	interface Post {
		id: number;
		parent_id: number | null;
		title: string;
		content: string;
		author: string;
		board_name: string;
		category_name?: string;
		comment_count: number;
		created_at: string;
	}

	let boardName = '';
	let posts: Post[] = [];
	let isLoading = true;
	let error: string | null = null;

	$: boardId = $page.params.slug;

	onMount(async () => {
		try {
			const boardData = await getBoardPosts(boardId);
			posts = boardData;
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

	function formatDate(dateString: string): string {
		const normalizedDateString = dateString.replace(' +0900 KST', '+09:00');
		const createDate = new Date(normalizedDateString).toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hourCycle: 'h24',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		return createDate;
	}

	// 글쓰기 버튼 클릭 시 호출되는 함수
	function handleWriteClick() {
		goto(`/community/${boardId}/write`); // 현재 게시판의 글쓰기 페이지로 이동
	}
</script>

<svelte:head>
	<title>{boardName || '게시판'} - Deverse</title>
</svelte:head>

<div class="board-container">
	<h1>{boardName || '게시판'}</h1>

	<!-- 글쓰기 버튼 -->
	<div class="actions">
		<button class="write-button" on:click={handleWriteClick}>글쓰기</button>
	</div>

	{#if isLoading}
		<p>게시글을 불러오는 중...</p>
	{:else if error}
		<p class="error">오류 발생: {error}</p>
	{:else}
		<table class="post-table">
			<thead>
				<tr>
					<th>제목</th>
					<th>작성자</th>
					<th>작성일</th>
					<th>댓글</th>
				</tr>
			</thead>
			<tbody>
				{#each posts as post (post.id)}
					<tr class="post-item">
						<td class="post-title">{post.title}</td>
						<td>{post.author}</td>
						<td>{formatDate(post.created_at)}</td>
						<td>{post.comment_count || 0}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.actions {
		margin-bottom: 1rem;
		display: flex;
		justify-content: flex-end;
	}

	.write-button {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.write-button:hover {
		background-color: #0056b3;
	}
</style>
