<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	let { setting = $bindable() } = $props();
</script>

<Select.Root type="single" bind:value={setting.frequency}>
	<Select.Trigger class="w-full">
		{setting.frequency ?? 'Select frequency'}
	</Select.Trigger>

	<Select.Content>
		<Select.Item value="weekly">Weekly</Select.Item>

		<Select.Item value="monthly">Monthly</Select.Item>

		<Select.Item value="quarterly">Quarterly</Select.Item>

		<Select.Item value="yearly">Yearly</Select.Item>
	</Select.Content>
</Select.Root>
