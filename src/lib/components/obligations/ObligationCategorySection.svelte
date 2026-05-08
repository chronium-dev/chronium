<script lang="ts">
	import { type ObligationSetting } from '$lib/validations/obligation-settings';
	import ObligationSettingCard from './ObligationSettingCard.svelte';

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
			<ObligationSettingCard bind:setting={settings[i]} />
		{/each}
	</div>
</section>
