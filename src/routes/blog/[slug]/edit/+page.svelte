<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createBlogPost, updateBlogPost, fetchBlogPost } from '$lib/utils/api';
import CartaEditor from '$lib/components/CartaEditor.svelte';

	let title = '';
	let content = '';
	let thumbnail: File | null = null;
	let isNewPost = true;

	onMount(async () => {
		const slug = $page.params.slug;
		if (slug !== 'new') {
			isNewPost = false;
			const post = await fetchBlogPost(slug);
			if (post) {
				title = post.title;
				content = post.content;
			}
		}
	});
	function handleThumbnailChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			thumbnail = target.files[0];
		}
	}

	async function handleSubmit() {
		try {
			const postData = { title, content, thumbnail };
			let result;
			if (isNewPost) {
				result = await createBlogPost(postData);
			} else {
				result = await updateBlogPost($page.params.slug, postData);
			}
			if (result) {
				goto(`/blog/${result.id}`);
			} else {
				console.error('Failed to get blog post result');
			}
		} catch (error) {
			console.error('Failed to save blog post:', error);
		}
	}
</script>

<svelte:head>
	<title>{isNewPost ? 'Create' : 'Edit'} Blog Post - Deverse</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">{isNewPost ? 'Create' : 'Edit'} Blog Post</h1>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
			<input
				type="text"
				id="title"
				bind:value={title}
				required
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
			/>
		</div>

		<div>
			<label for="thumbnail" class="block text-sm font-medium text-gray-700">Thumbnail</label>
			<input
				type="file"
				id="thumbnail"
				accept="image/*"
				on:change={handleThumbnailChange}
				class="mt-1 block w-full"
			/>
		</div>

                <div>
                        <CartaEditor bind:value={content} />
                </div>

		<button
			type="submit"
			class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary-dark"
		>
			{isNewPost ? 'Create' : 'Update'} Post
		</button>
	</form>
</div>
