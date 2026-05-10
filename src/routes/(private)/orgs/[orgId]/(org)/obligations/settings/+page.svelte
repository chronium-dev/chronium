<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';

	import ObligationCategorySection from '$lib/components/obligations/ObligationCategorySection.svelte';
	import type { FormMessage } from '$lib/types/forms';
	import { obligationSettingsFormSchema } from '$lib/validations/obligation-settings';
	import { untrack } from 'svelte';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	// let {
	// 	data
	// }: {
	// 	data: SuperValidated<Infer<typeof obligationSettingsFormSchema>>;
	// } = $props();

	// const form = untrack(() =>
	// 	superForm<Infer<typeof obligationSettingsFormSchema>, FormMessage>(data, {
	// 		validators: zod4Client(obligationSettingsFormSchema),
	// 		validationMethod: 'oninput',
	// 		dataType: 'json'
	// 	})
	// );

	// 1. Destructure 'form' out of data
let { data } = $props();

const form = untrack(() =>
    // 2. Pass data.form, NOT data
    superForm<Infer<typeof obligationSettingsFormSchema>, FormMessage>(data.form, {
        validators: zod4Client(obligationSettingsFormSchema),
        validationMethod: 'oninput',
        dataType: 'json'
    })
);

	const { form: formData, enhance, submitting } = form;

	console.log({ settings: $formData.settings });
	const operational = $derived($formData.settings.filter((s) => s.category === 'operational'));

	// const governance = $derived($formData.settings.filter((s) => s.category === 'governance'));
</script>

<form method="POST" action="?/save" use:enhance class="space-y-8">
	<ObligationCategorySection title="Operational Obligations" settings={operational} />

	<!-- <ObligationCategorySection title="Governance Obligations" settings={governance} /> -->

	<div class="flex justify-end">
		<button
			type="submit"
			disabled={$submitting}
			class="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
		>
			Save obligation settings
		</button>
	</div>
</form>
