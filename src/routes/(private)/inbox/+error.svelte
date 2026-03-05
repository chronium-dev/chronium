<script lang="ts">
	import ErrorShell from '$lib/components/ErrorShell.svelte';
</script>

<ErrorShell
	recovery={{
		href: '/inbox',
		label: 'Back to Ratings Inbox'
	}}
>
	<p class="text-slate-500">An error has occurred in the Ratings Inbox...</p>
</ErrorShell>
