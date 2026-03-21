<script lang="ts">
	import CompanyForm from '$lib/components/forms/CompanyForm.svelte';

	let { data } = $props();
</script>

<div class="rounded-lg bg-background p-8 shadow-lg">
	<div class="mb-8 text-center">
		<!-- <div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div> -->
		<h2 class="text-2xl font-bold">Setup Your Company</h2>
	</div>
	<CompanyForm data={data.form} mode="create" />
</div>
