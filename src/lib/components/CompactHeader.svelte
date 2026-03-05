<script lang="ts">
	const {
		title,
		align = 'left',
		class: className = '',
		children
	} = $props<{
		title: string;
		align?: 'left' | 'center';
		class?: string;
		children?: () => any;
	}>();
</script>

<header
	class={`border-b px-4 py-3 ${className}`}
>
	<div
		class={`flex gap-3 ${
			align === 'center'
				? 'flex-col items-center text-center'
				: 'items-center justify-between'
		}`}
	>
		<h1 class="text-base font-medium text-foreground">
			{title}
		</h1>

		{#if children && align === 'left'}
			<div class="flex items-center gap-2">
				{@render children()}
			</div>
		{/if}

		{#if children && align === 'center'}
			<div class="flex items-center gap-2">
				{@render children()}
			</div>
		{/if}
	</div>
</header>
