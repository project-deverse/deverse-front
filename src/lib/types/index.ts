export interface User {
	id: string;
	name: string;
	email: string;
	role: 'author' | 'user';
}

export interface BlogPost {
	id: string;
	title: string;
	content: string;
	thumbnail: string | null;
	authorId: string;
	createdAt: string;
	updatedAt: string;
}

export interface BlogPostSummary {
	id: string;
	title: string;
	excerpt: string;
	thumbnail: string | null;
	authorId: string;
	createdAt: string;
}

export interface NewsItem {
	id: string;
	title: string;
	summary: string;
	content: string;
	createdAt: string;
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface Board {
	id: number;
	name: string;
	description: string;
	post_count: number;
	created_at: string;
}

export interface BoardPost {
	id: number;
	parent_id: number | null;
	title: string;
	content: string;
	author: string;
	board_id: number;
	board_name: string;
	category_name?: string;
	comment_count: number;
	created_at: string;
}

export interface WikiPage {
	id: string;
	title: string;
	content: string;
	lastUpdated: string;
}
