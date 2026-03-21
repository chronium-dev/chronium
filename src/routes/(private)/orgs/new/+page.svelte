<script lang="ts">
	import CompanyForm from '$lib/components/forms/CompanyForm.svelte';

	let { data } = $props();
</script>

<div class="space-y-(--space-page) rounded-lg bg-background p-8 shadow-lg">
	<div class="mb-8 text-center">
		<!-- <div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div> -->
		<h2 class="font-brand text-2xl">Setup Your Company</h2>
	</div>
	<div class="space-y-4 rounded-lg border border-border bg-card p-6 text-card-foreground">
		<CompanyForm data={data.form} mode="create" />
	</div>
</div>
