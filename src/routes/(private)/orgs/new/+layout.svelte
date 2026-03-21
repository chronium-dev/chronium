<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen justify-center px-4 py-2 sm:px-6 lg:px-8">
	<div class="w-full max-w-md">
		{@render children()}
	</div>
</div>
