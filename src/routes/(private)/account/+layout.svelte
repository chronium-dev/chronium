<script lang="ts">
	let { children } = $props();
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900"
>
	<div class="w-full max-w-md">
		{@render children()}
	</div>
</div>
