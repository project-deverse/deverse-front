<script lang="ts">
	import { goto } from '$app/navigation';
	import { createBlogPost } from '$lib/utils/api';
	import type { BlogPost } from '$lib/types';
import CartaEditor from '$lib/components/CartaEditor.svelte';
import '$styles/editor.css';

	let title = '';
	let content = '';
	let thumbnail: File | null = null;
	let error: string | null = null;

	async function handleSubmit() {
		try {
			const newPost = await createBlogPost({ title, content, thumbnail });
			if (newPost) {
				goto(`/blog/${newPost.id}`);
			} else {
				throw new Error('Failed to create blog post');
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		}
	}

	function handleThumbnailChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			thumbnail = target.files[0];
		}
	}

</script>

<svelte:head>
	<title>Create New Blog Post - Deverse</title>
</svelte:head>

<main class="editor-main">
	<div class="editor-header">
		<h1>Create New Blog Post</h1>
		<button on:click={() => goto('/blog')} class="btn-secondary">Back to Blog</button>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="editor-form">
		<div class="form-group">
			<label for="title">Title</label>
			<input type="text" id="title" bind:value={title} required />
		</div>

		<div class="form-group">
			<label for="thumbnail">Thumbnail</label>
			<input type="file" id="thumbnail" accept="image/*" on:change={handleThumbnailChange} />
		</div>

                <div class="form-group">
                        <label>Content</label>
                        <div class="editor-container">
                                <CartaEditor bind:value={content} />
                        </div>
                </div>

		{#if error}
			<p class="error-message">{error}</p>
		{/if}

		<div class="form-actions">
			<button type="submit" class="btn-primary">Create Post</button>
		</div>
	</form>
</main>
