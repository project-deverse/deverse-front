<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { fetchBlogPost } from '$lib/utils/api';
	import { marked } from 'marked';

	let post: any = null;

	onMount(async () => {
		const slug = $page.params.slug;
		post = await fetchBlogPost(slug);
	});
</script>

<svelte:head>
	{#if post}
		<title>{post.title} - Deverse Blog</title>
	{/if}
</svelte:head>

{#if post}
	<article class="container mx-auto px-4 py-8">
		<h1 class="text-4xl font-bold mb-4">{post.title}</h1>
		<div class="mb-8">
			<img src={post.thumbnail} alt={post.title} class="w-full h-64 object-cover rounded-lg" />
		</div>
		<div class="prose max-w-none mb-8">
			{@html marked(post.content)}
		</div>
		<div class="flex justify-between items-center">
			<p class="text-sm text-gray-600">
				By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
			</p>
			{#if $auth.user && $auth.user.id === post.authorId}
				<a
					href={`/blog/${post.id}/edit`}
					class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary-dark"
				>
					Edit Post
				</a>
			{/if}
		</div>
	</article>
{:else}
	<div class="container mx-auto px-4 py-8">
		<p>Loading...</p>
	</div>
{/if}
