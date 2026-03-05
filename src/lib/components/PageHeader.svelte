<script lang="ts">
	const {
		title,
		description,
		align = 'left',
		sticky = false,
		class: className = '',
		children
	} = $props<{
		title: string;
		description?: string;
		align?: 'left' | 'center';
		sticky?: boolean;
		class?: string;
		children?: () => any;
	}>();
</script>

<header
	class={`mb-0 ${
		sticky
			? 'sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/75'
			: ''
	} ${className}`}
>
	<div class="py-2">
		<div
			class={`flex gap-4 ${
				align === 'center' ? 'flex-col items-center text-center' : 'items-start justify-between'
			}`}
		>
			<div class="min-w-0">
				<h1 class="text-2xl font-semibold tracking-tight text-foreground">
					{title}
				</h1>

				{#if description}
					<p class="mt-1 text-sm text-muted-foreground">
						{description}
					</p>
				{/if}
			</div>

			{#if children && align === 'left'}
				<div class="flex shrink-0 items-center gap-2">
					{@render children()}
				</div>
			{/if}

			{#if children && align === 'center'}
				<div class="mt-2 flex items-center gap-2">
					{@render children()}
				</div>
			{/if}
		</div>
	</div>
</header>
