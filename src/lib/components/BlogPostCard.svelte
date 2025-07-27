<script lang="ts">
	export let post: {
		id: string;
		title: string;
		content: string;
		thumbnail: string;
		author: string;
		createdAt: string;
	};
	export let viewMode: 'grid' | 'list';
</script>

<a href={`/blog/${post.id}`} class={viewMode === 'grid' ? 'block' : 'flex items-center space-x-4'}>
	<div
		class={viewMode === 'grid'
			? 'bg-white rounded-lg shadow-md overflow-hidden'
			: 'flex bg-white rounded-lg shadow-md overflow-hidden'}
	>
		<img
			src={post.thumbnail}
			alt={post.title}
			class={viewMode === 'grid' ? 'w-full h-48 object-cover' : 'w-48 h-32 object-cover'}
		/>
		<div class={viewMode === 'grid' ? 'p-4' : 'flex-1 p-4'}>
			<h2 class="text-xl font-semibold mb-2">{post.title}</h2>
			<p class="text-sm text-gray-600 mb-2">
				By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
			</p>
			<p class="text-gray-700">{post.content.substring(0, 100)}...</p>
		</div>
	</div>
</a>
