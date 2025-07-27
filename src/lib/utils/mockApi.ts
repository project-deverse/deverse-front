import sampleData from '$lib/sampleData.json';
import type { BlogPost, BlogPostSummary, NewsItem, Board, BoardPost, WikiPage } from '$lib/types';

const dataStore: typeof sampleData = JSON.parse(JSON.stringify(sampleData));

function generateId(list: { id: string | number }[]): string {
	const max = list.reduce((acc, cur) => Math.max(acc, Number(cur.id)), 0);
	return String(max + 1);
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
	return dataStore.blogPosts;
}

export async function fetchBlogPost(id: string): Promise<BlogPost | null> {
	return dataStore.blogPosts.find((p) => p.id === id) || null;
}

export async function createBlogPost(postData: {
	title: string;
	content: string;
	thumbnail: File | null;
}): Promise<BlogPost> {
	const newPost: BlogPost = {
		id: generateId(dataStore.blogPosts),
		title: postData.title,
		content: postData.content,
		thumbnail: null,
		authorId: 'test-author',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	dataStore.blogPosts.push(newPost);
	return newPost;
}

export async function updateBlogPost(
	id: string,
	postData: Partial<BlogPost>
): Promise<BlogPost | null> {
	const post = dataStore.blogPosts.find((p) => p.id === id);
	if (!post) return null;
	Object.assign(post, postData, { updatedAt: new Date().toISOString() });
	return post;
}

export async function fetchRecentPosts(limit = 5): Promise<BlogPostSummary[]> {
	return dataStore.blogPosts.slice(0, limit).map((p) => ({
		id: p.id,
		title: p.title,
		excerpt: p.content.substring(0, 100) + '...',
		thumbnail: p.thumbnail,
		authorId: p.authorId,
		createdAt: p.createdAt
	}));
}

export async function fetchRecentNews(limit = 5): Promise<NewsItem[]> {
	return dataStore.recentNews.slice(0, limit);
}

export async function getCurrentUser(
	id: string
): Promise<{ id: string; name: string; email: string; role: 'author' | 'user' } | null> {
	return dataStore.users.find((u) => u.id === id) || null;
}

export async function getBoards(): Promise<Board[]> {
	return dataStore.boards;
}

export async function getBoardPosts(boardId: string): Promise<BoardPost[]> {
	return dataStore.boardPosts.filter((p) => String(p.board_id) === boardId);
}

export async function createPost(boardId: number, title: string, content: string): Promise<void> {
	const board = dataStore.boards.find((b) => b.id === boardId);
	if (!board) return;
	const newPost: BoardPost = {
		id: dataStore.boardPosts.length + 1,
		parent_id: null,
		title,
		content,
		author: 'test-author',
		board_name: board.name,
		comment_count: 0,
		created_at: new Date().toISOString()
	};
	dataStore.boardPosts.push(newPost);
	board.post_count += 1;
}

export async function getWikiPages(): Promise<WikiPage[]> {
	return dataStore.wikiPages;
}

export const api = {
	fetchBlogPosts,
	fetchBlogPost,
	createBlogPost,
	updateBlogPost,
	fetchRecentPosts,
	fetchRecentNews,
	getCurrentUser,
	getBoards,
	getBoardPosts,
	createPost,
	getWikiPages
};
