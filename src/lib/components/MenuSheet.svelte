<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import AboutIcon from '$lib/components/icons/AboutIcon.svelte';
	import DocsIcon from '$lib/components/icons/DocsIcon.svelte';
	import HomeIcon from '$lib/components/icons/HomeIcon.svelte';
	import InboxIcon from '$lib/components/icons/InboxIcon.svelte';
	import PricingIcon from '$lib/components/icons/PricingIcon.svelte';
	import SignInIcon from '$lib/components/icons/SignInIcon.svelte';
	import SignOutIcon from '$lib/components/icons/SignOutIcon.svelte';
	import TemplateIcon from '$lib/components/icons/TemplateIcon.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import { Sheet, SheetContent } from '$lib/components/ui/sheet';

	const isAuthenticated = page.data.user;
	const basicUser = page.data.user?.context.basic;
	const isBasicUser = basicUser?.isBasicUser;
	const templateHref = isBasicUser
		? `/ws/${basicUser.workspaceId}/template/${basicUser.templateId}`
		: `/templates`;

	let { open = $bindable() } = $props<{
		open: boolean;
	}>();
	// console.log('open:', open);

	async function handleSignOutClick() {
		open = false;
		await authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					//goto('/');
					// This forces a full browser reload to the home page
					window.location.href = '/';
				}
			}
		});
	}

	async function handleSignInClick() {
		open = false;
		goto('/signin');
	}
</script>

<Sheet bind:open>
	<SheetContent side="right" class="w-[90vw] sm:w-90">
		<nav class="mt-6 space-y-1 text-sm">
			{#if isAuthenticated}
				<a href="/" class="menu-item" onclick={() => (open = false)}>
					<HomeIcon class="h-4 w-4 text-muted-foreground" />
					<span>Home</span>
				</a>
				<a href={templateHref} class="menu-item" onclick={() => (open = false)}>
					<TemplateIcon class="h-4 w-4 text-muted-foreground" />
					<span>{isBasicUser ? 'Template' : 'Templates'}</span>
				</a>
				<a href="/inbox" class="menu-item" onclick={() => (open = false)}>
					<InboxIcon class="h-4 w-4 text-muted-foreground" />
					<span>Ratings Inbox</span>
				</a>
				<hr />

				<a href="/account" class="menu-item" onclick={() => (open = false)}>
					<UserIcon class="h-4 w-4 text-muted-foreground" />
					<span>Account</span>
				</a>
				<a href="/pricing" class="menu-item" onclick={() => (open = false)}>
					<PricingIcon class="h-4 w-4 text-muted-foreground" />
					<span>Pricing</span>
				</a>
				<!-- Future / gated -->
				<!-- <a href="/members" class="menu-item opacity-60">Members</a>
				<a href="/workspaces" class="menu-item opacity-60">Workspaces</a>
				<a href="/campaigns" class="menu-item opacity-60"> Email Campaigns </a> -->

				<hr />

				<a href="/" class="menu-item" onclick={() => (open = false)}>
					<DocsIcon class="h-4 w-4 text-muted-foreground" />
					<span>Documentation</span>
				</a>
				<a
					href="/"
					onclick={(e) => {
						e.preventDefault();
						handleSignOutClick();
					}}
					class="menu-item"
					><SignOutIcon class="h-4 w-4 text-muted-foreground" />
					<span>Sign Out</span></a
				>
			{:else}
				<a href="/" class="menu-item" onclick={() => (open = false)}>
					<HomeIcon class="h-4 w-4 text-muted-foreground" />
					<span>Home</span>
				</a>
				<a href="/about" class="menu-item" onclick={() => (open = false)}>
					<AboutIcon class="h-4 w-4 text-muted-foreground" />
					<span>About</span>
				</a>
				<a href="/pricing" class="menu-item" onclick={() => (open = false)}>
					<PricingIcon class="h-4 w-4 text-muted-foreground" />
					<span>Pricing</span>
				</a>
				<hr />
				<a href="/" class="menu-item" onclick={() => (open = false)}>
					<DocsIcon class="h-4 w-4 text-muted-foreground" />
					<span>Documentation</span>
				</a>

				<hr />

				<a
					href="/"
					onclick={(e) => {
						e.preventDefault();
						handleSignInClick();
					}}
					class="menu-item"
					><SignInIcon class="h-4 w-4 font-medium text-muted-foreground" />
					<span>Sign In / Sign Up</span></a
				>
			{/if}
		</nav>
	</SheetContent>
</Sheet>
