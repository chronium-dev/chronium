<script lang="ts">
	let {
		rating = $bindable<number>(0),
		name = 'starRating',
		disabled = false,
		class: className = ''
	} = $props<{
		rating?: number;
		name?: string;
		disabled?: boolean;
		class?: string;
	}>();

	let hoverRating = $state(0);

	function setRating(value: number) {
		if (disabled) return;
		rating = value;
	}
</script>


<div class={`flex items-center justify-center gap-1 ${className}`}>
	{#each [1, 2, 3, 4, 5] as index}
		<button
			type="button"
			class="cursor-pointer"
			onmouseenter={() => (hoverRating = index)}
			onmouseleave={() => (hoverRating = 0)}
			onclick={() => setRating(index)}
			aria-label={`Rate ${index} stars`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
				viewBox="0 0 24 24"
				fill={index <= (hoverRating || rating) ? '#ffc107' : '#a9a9a9'}
			>
				<path
					d="M12 2l2.36 7.23h7.64l-6.15 4.47 2.36 7.23-6.14-4.47-6.15 4.47 2.36-7.23-6.14-4.47h7.64z"
				/>
			</svg>
		</button>
	{/each}

	<!-- 👇 THIS is the magic for form submission -->
	<input type="hidden" {name} value={rating} />
</div>
