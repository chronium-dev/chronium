<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import InboxIcon from '$lib/components/icons/InboxIcon.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import LogoIcon from '$lib/components/LogoIcon.svelte';
	import LogoName from '$lib/components/LogoName.svelte';
	import MenuSheet from '$lib/components/MenuSheet.svelte';
	import ThemeDropdownMainMenu from '$lib/components/ThemeDropdownMainMenu.svelte';
	import HomeIcon from './icons/HomeIcon.svelte';
	import TemplateIcon from './icons/TemplateIcon.svelte';
	import { Button } from './ui/button';

	const isAuthenticated = page.data.user;
	const basicUser = page.data.user?.context.basic;
	const isBasicUser = basicUser?.isBasicUser;
	const templateHref = isBasicUser
		? `/ws/${basicUser.workspaceId}/template/${basicUser.templateId}`
		: `/templates`;

	const navigateTo = (path: string) => {
		goto(path);
	};

	const isActive = (path: string) =>
		page.url.pathname === path || page.url.pathname.startsWith(path + '/');

	let open = $state(false);
</script>

<header
	class="sticky top-0 z-40 w-full border-b bg-background/95 py-0 backdrop-blur supports-backdrop-filter:bg-background/60"
>
	<div class="flex h-16 items-center justify-between px-4">
		<!-- Logo (Left) -->
		<a href="/" class="flex items-center space-x-2">
			<LogoIcon width={38} height={38} />
			<LogoName height="50" />
		</a>

		<!-- Desktop primary nav -->
		<nav class="hidden items-center gap-8 text-sm md:flex">
			{#if isAuthenticated}
				<a href="/" class="nav-link flex items-center gap-2" class:menu-item-active={isActive('/')}
					><HomeIcon class="h-4 w-4 text-muted-foreground" /><span>Home</span></a
				>
				<a
					href={templateHref}
					class="nav-link flex items-center gap-2"
					class:menu-item-active={isActive(isBasicUser ? '/template' : '/templates')}
				>
					<TemplateIcon class="h-4 w-4 text-muted-foreground" />
					<span>{isBasicUser ? 'Template' : 'Templates'}</span></a
				>
				<a
					href="/inbox"
					class="nav-link flex items-center gap-2"
					class:menu-item-active={isActive('/inbox')}
					><InboxIcon class="h-4 w-4 text-muted-foreground" /><span>Ratings Inbox</span></a
				>
				<!-- <a
					href="/pricing"
					class="nav-link flex items-center gap-2 text-muted-foreground"
					class:menu-item-active={isActive('/pricing')}
					><PricingIcon class="h-4 w-4 text-muted-foreground" />
					<span>Pricing</span>
				</a> -->
			{:else}
				<a href="/" class="nav-link flex items-center gap-2" class:menu-item-active={isActive('/')}
					><span>Home</span></a
				>
				<a
					href="/pricing"
					class="nav-link flex items-center gap-2"
					class:menu-item-active={isActive('/pricing')}><span>Pricing</span></a
				>
				<a
					href="/about"
					class="nav-link flex items-center gap-2"
					class:menu-item-active={isActive('/about')}><span>About</span></a
				>
				<a
					href="/docs"
					class="nav-link flex items-center gap-2"
					class:menu-item-active={isActive('/docs')}><span>Docs</span></a
				>
			{/if}
		</nav>

		<!-- <div class="flex-1"></div> -->

		<!-- Right Side Controls -->
		<div class="flex items-center gap-2">
			<!-- Theme Dropdown -->
			<!-- <ThemeDropdownMainMenu /> -->
			<Button variant="ghost" size="icon" aria-label="Open menu" onclick={() => (open = true)}>
				<MenuIcon class="h-5 w-5" />
			</Button>
		</div>

		<MenuSheet bind:open />
	</div>
</header>
