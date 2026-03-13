<script>
	let { label = '' } = $props();
</script>

<li class="flex items-start gap-3">
	<div class="mt-1 shrink-0">
		<svg
			class="h-5 w-5 text-blue-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="red"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
		>
	</div>
	<p class="font-medium">{label}</p>
</li>
