<script lang="ts">
	const {
		title,
		description,
		align = 'left',
		class: className = '',
		children
	} = $props<{
		title: string;
		description?: string;
		align?: 'left' | 'center';
		class?: string;
		children?: () => any;
	}>();
</script>

<section class={`mb-4 ${className}`}>
	<div
		class={`flex gap-4 ${
			align === 'center'
				? 'flex-col items-center text-center'
				: 'items-center justify-between'
		}`}
	>
		<div>
			<h2 class="text-base font-medium text-foreground">
				{title}
			</h2>

			{#if description}
				<p class="mt-1 text-sm text-muted-foreground">
					{description}
				</p>
			{/if}
		</div>

		{#if children && align === 'left'}
			<div class="flex items-center gap-2">
				{@render children()}
			</div>
		{/if}

		{#if children && align === 'center'}
			<div class="mt-2 flex items-center gap-2">
				{@render children()}
			</div>
		{/if}
	</div>
</section>
