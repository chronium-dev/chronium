<script lang="ts">
	import ObligationSettingCard from '$lib/components/obligations/ObligationSettingCard.svelte';
	import { type ObligationSetting } from '$lib/validations/obligation-settings';

	type Props = {
		title: string;
		settings: ObligationSetting[];
	};

	let { title, settings }: Props = $props();
</script>

<section class="space-y-4">
	<div>
		<h2 class="text-xl font-semibold">{title}</h2>
	</div>

	<div class="space-y-4">
		{#each settings as _, i}
			<ObligationSettingCard setting={settings[i]} />
		{/each}
	</div>
</section>

