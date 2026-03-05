<script lang="ts">
	import { goto } from '$app/navigation';
	import { getUser } from '$lib/api/auth.remote';
	import { authClient } from '$lib/auth-client';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import ThemeDropdownMainMenu from '$lib/components/ThemeDropdownMainMenu.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import AboutIcon from './icons/AboutIcon.svelte';
	import HomeIcon from './icons/HomeIcon.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';
	import PricingIcon from './icons/PricingIcon.svelte';
	import TemplateIcon from './icons/TemplateIcon.svelte';
	import LogoIcon from './LogoIcon.svelte';
	import LogoName from './LogoNameText.svelte';
	import { Button } from './ui/button';

// 1. Get the reactive session
	const session = authClient.useSession();

	const navigateTo = (path: string) => {
		goto(path);
	};

	const items = [
		{ label: 'Home', path: '/', icon: HomeIcon, requiresAuth: false },
		{ label: 'Template', path: '/template', icon: TemplateIcon, requiresAuth: true },
		{ label: 'Pricing', path: '/pricing', icon: PricingIcon, requiresAuth: false },
		{ label: 'About', path: '/about', icon: AboutIcon, requiresAuth: false },
		{ label: 'Account', path: '/account', icon: UserIcon, requiresAuth: true }
	] as const;

	// 2. Use a derived rune to filter the items based on session status
	// $session.data will be null if not authenticated
	const visibleItems = $derived(
		items.filter((item) => !item.requiresAuth || (item.requiresAuth && $session.data))
	);
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

		<!-- Right Side Controls -->
		<div class="flex items-center gap-2">
			<!-- Theme Dropdown -->
			<ThemeDropdownMainMenu />

			<!-- Mobile Menu Sheet -->
			<Sheet.Root>
				<Sheet.Trigger>
					<Button type="button" variant="ghost" aria-label="Toggle theme">
						<span class="absolute transition-all duration-300">
							<MenuIcon class="h-4 w-4" />
						</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left">
					<ul class="mt-12 space-y-2">
						{#each visibleItems as item}
							<li class="">
								<button
									onclick={() => navigateTo(item.path)}
									class="flex w-full items-center gap-5 px-4 py-3 text-left text-lg transition hover:bg-muted"
								>
									<item.icon class="h-5 w-5 text-muted-foreground" />
									{item.label}
								</button>
							</li>
						{/each}
					</ul>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>
