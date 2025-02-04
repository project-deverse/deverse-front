<script lang="ts">
	import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
	import { fetchRecentPosts, fetchRecentNews } from '$lib/utils/api';
	import type { BlogPostSummary } from '$lib/types';
  import '$styles/home.css';

	let recentPosts: BlogPostSummary[] = [];
	let recentNews: any[] = []; // 뉴스 타입이 정의되어 있지 않아 any를 사용합니다.
	let isLoading = true;
	let error: string | null = null;
  let isAuthenticated = false;
	onMount(async () => {
		try {
			[recentPosts, recentNews] = await Promise.all([fetchRecentPosts(), fetchRecentNews()]);
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		} finally {
			isLoading = false;
		}
    isAuthenticated = auth.get().isAuthenticated;
	});
</script>

<svelte:head>
	<title>Deverse - 개발자를 위한 지식 공유 플랫폼</title>
</svelte:head>

<main class="home-container">
	<h1 class="home-title">Deverse에 오신 것을 환영합니다</h1>

	<div class="home-content">
		<section class="home-section">
			<h2>블로그</h2>
			<div class="home-section-content">
				<p>개발 경험과 지식을 공유하세요. 최신 기술 트렌드와 유용한 팁을 확인하실 수 있습니다.</p>
			</div>
		</section>

		<section class="home-section">
			<h2>커뮤니티</h2>
			<div class="home-section-content">
				<p>다른 개발자들과 소통하고 협력하세요. 질문하고 답변하며 함께 성장할 수 있습니다.</p>
			</div>
		</section>

		<section class="home-section">
			<h2>위키</h2>
			<div class="home-section-content">
				<p>
					개발 관련 지식을 체계적으로 정리하고 공유하세요. 모두가 함께 만들어가는 개발
					백과사전입니다.
				</p>
			</div>
		</section>
	</div>

	<div class="home-cta">
		{#if !isAuthenticated}
			<a href="/login" class="btn">시작하기</a>
		{:else}
			<a href="/blog" class="btn">블로그 둘러보기</a>
		{/if}
	</div>
</main>
