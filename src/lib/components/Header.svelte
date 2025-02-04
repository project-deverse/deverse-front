<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let isMenuOpen = false;
	let isMobile = false;

	function logout() {
		auth.logout();
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function checkMobile() {
		isMobile = window.innerWidth <= 768;
		if (!isMobile) {
			isMenuOpen = false;
		}
	}

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});
</script>

<header class="header">
	<div class="header-container">
		<a href="/" class="header-logo">Deverse</a>
		<button class="menu-toggle" on:click={toggleMenu} aria-label="Toggle menu">
			{#if isMenuOpen}
				✕
			{:else}
				☰
			{/if}
		</button>
		<nav class="header-nav" class:open={isMenuOpen || !isMobile}>
			<ul>
				{#each ['Blog', 'Community', 'Wiki', 'News'] as item}
					<li>
						<a class="header-a"
							href={`/${item.toLowerCase()}`}
							class:active={$page.url.pathname.startsWith(`/${item.toLowerCase()}`)}
						>
							{item}
						</a>
					</li>
				{/each}
				{#if $auth.isAuthenticated}
					<li><a href="/" on:click={logout} class="auth-button logout-button">Logout</a></li>
				{:else}
					<li><a href="/login" class="auth-button login-button">Login</a></li>
				{/if}
			</ul>
		</nav>
	</div>
</header>

<style>
	.header {
		background-color: var(--primary-color);
		color: var(--primary-foreground-color);
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.header-logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--primary-foreground-color);
		text-decoration: none;
	}

	.header-nav ul {
		display: flex;
		gap: 1rem;
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.header-nav {
		color: var(--primary-foreground-color);
		text-decoration: none;
		font-weight: 500;
	}

  .header-a {
		color: var(--primary-foreground-color);
		text-decoration: none;
		font-weight: 500;
	}

	.header-nav a:hover {
		opacity: 0.8;
	}

	.header-nav .active {
		font-weight: bold;
		text-decoration: underline;
	}

	.auth-button {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-weight: bold;
		transition: background-color 0.3s ease;
    text-decoration: none;
		font-weight: 500;
	}
  .login-not:not(.color) {
    color: var(--primary-foreground-color);
  }
	.login-button {
		background-color: var(--secondary-color);
		color: rgb(37, 38, 52);
	}

	.login-button:hover {
		background-color: rgba(73, 109, 241, 0.482);
    color: rgb(255, 255, 255);
	}

	.logout-button {
		background-color: var(--warning-color);
		color: var(--warning-foreground-color);
	}

	.logout-button:hover {
		background-color: var(--warning-color-hover);
	}

	.menu-toggle {
		display: none;
	}

	@media (max-width: 768px) {
		.header-container {
			flex-wrap: wrap;
		}

		.menu-toggle {
			display: block;
			background: none;
			border: none;
			color: var(--primary-foreground-color);
			font-size: 1.5rem;
			cursor: pointer;
		}

		.header-nav {
			display: none;
			width: 100%;
		}

		.header-nav.open {
			display: block;
		}

		.header-nav ul {
			flex-direction: column;
			align-items: center;
			padding: 1rem 0;
		}

		.header-nav li {
			margin-bottom: 0.5rem;
		}
	}
</style>
