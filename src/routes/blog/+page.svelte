<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fetchBlogPosts, getCurrentUser } from '$lib/utils/api';
	import { auth } from '$lib/stores/auth';
	import type { BlogPost, User } from '$lib/types';
	import '$styles/blog.css';

	let posts: BlogPost[] = [];
	let currentUser: User | null = null;
	let isLoading = true;
	let error: string | null = null;
	let viewMode: 'grid' | 'list' = 'grid';

	onMount(async () => {
		try {
			// 테스트를 위해 임시로 author 권한을 가진 사용자로 로그인
			auth.login({
				id: 'test-author',
				name: 'Test Author',
				email: 'test@example.com',
				token: 'test-token',
				role: 'author'
			});

			const [fetchedPosts, user] = await Promise.all([fetchBlogPosts(), getCurrentUser()]);
			posts = fetchedPosts;
			currentUser = user;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		} finally {
			isLoading = false;
		}
	});

	function toggleViewMode() {
		viewMode = viewMode === 'grid' ? 'list' : 'grid';
	}

	function navigateToCreatePost() {
		goto('/blog/new');
	}

	function navigateToPost(postId: string) {
		goto(`/blog/${postId}`);
	}
</script>

<svelte:head>
	<title>Deverse - Blog</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-4xl font-bold">Deverse Blog</h1>
		<div class="flex gap-4">
			<button on:click={toggleViewMode} class="btn">
				Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
			</button>
			{#if currentUser && currentUser.role === 'author'}
				<button on:click={navigateToCreatePost} class="btn"> Create New Post </button>
			{/if}
		</div>
	</div>

	{#if isLoading}
		<p>Loading posts...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if posts.length === 0}
		<p>No posts found.</p>
	{:else}
		<div class={viewMode === 'grid' ? 'blog-post-list-grid' : 'blog-post-list'}>
			{#each posts as post (post.id)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<article class="blog-post-card" on:click={() => navigateToPost(post.id)}>
					<img
						src={post.thumbnail || '/placeholder.jpg'}
						alt={post.title}
						class="blog-post-card-image"
					/>
					<div class="content">
						<h2>{post.title}</h2>
						<p>{post.content.substring(0, 100)}...</p>
						<div class="blog-post-meta">
							<span>By {post.authorId}</span>
							<span>{new Date(post.createdAt).toLocaleDateString()}</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</main>
