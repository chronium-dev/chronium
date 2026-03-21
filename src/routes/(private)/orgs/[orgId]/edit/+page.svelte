<script lang="ts">
	import CompanyForm from '$lib/components/forms/CompanyForm.svelte';

  let { data } = $props();
</script>

<h1>Edit Company</h1>
<CompanyForm data={data.form} mode="edit" />