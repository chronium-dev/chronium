<script lang="ts">
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as Select from '$lib/components/ui/select';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import type { ObligationSetting } from '$lib/validations/obligation-settings';

	let { setting = $bindable() }: { setting: ObligationSetting } = $props();

	//
	// Frequency select needs string | undefined for shadcn/bits-ui
	//
	let localFrequency = $state(setting.frequency ?? undefined);

	$effect(() => {
		setting.frequency = localFrequency ?? null;
	});

	//
	// RecurrenceType select needs string | undefined for shadcn/bits-ui
	//
	let localRecurrenceType = $state(setting.recurrenceType ?? undefined);

	$effect(() => {
		setting.recurrenceType = localRecurrenceType ?? null;
	});

	const weekdays = [
		{ value: 0, label: 'Sunday' },
		{ value: 1, label: 'Monday' },
		{ value: 2, label: 'Tuesday' },
		{ value: 3, label: 'Wednesday' },
		{ value: 4, label: 'Thursday' },
		{ value: 5, label: 'Friday' },
		{ value: 6, label: 'Saturday' }
	];

	const months = [
		{ value: 1, label: 'January' },
		{ value: 2, label: 'February' },
		{ value: 3, label: 'March' },
		{ value: 4, label: 'April' },
		{ value: 5, label: 'May' },
		{ value: 6, label: 'June' },
		{ value: 7, label: 'July' },
		{ value: 8, label: 'August' },
		{ value: 9, label: 'September' },
		{ value: 10, label: 'October' },
		{ value: 11, label: 'November' },
		{ value: 12, label: 'December' }
	];

	let localDayOfWeek = $state(setting.dayOfWeek != null ? String(setting.dayOfWeek) : undefined);

	$effect(() => {
		setting.dayOfWeek = localDayOfWeek != null ? Number(localDayOfWeek) : null;
	});

	let localMonthOfYear = $state(
		setting.monthOfYear != null ? String(setting.monthOfYear) : undefined
	);

	$effect(() => {
		setting.monthOfYear = localMonthOfYear != null ? Number(localMonthOfYear) : null;
	});
</script>

<div class="grid gap-6">
	<!-- Frequency -->

	<div class="grid gap-2">
		<Label for={`frequency-${setting.id}`}>Frequency</Label>

		<Select.Root type="single" bind:value={localFrequency}>
			<Select.Trigger id={`frequency-${setting.id}`} class="w-full">
				{setting.frequency ?? 'Select frequency'}
			</Select.Trigger>

			<Select.Content>
				<Select.Item value="weekly">Weekly</Select.Item>

				<Select.Item value="monthly">Monthly</Select.Item>

				<Select.Item value="quarterly">Quarterly</Select.Item>

				<Select.Item value="yearly">Yearly</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	{#if localFrequency}
		<!-- Interval -->

		<div class="grid gap-2">
			<Label for={`interval-${setting.id}`}>Every</Label>

			<Input id={`interval-${setting.id}`} type="number" min="1" bind:value={setting.interval} />

			<p class="text-sm text-muted-foreground">
				{#if localFrequency === 'weekly'}
					weeks
				{:else if localFrequency === 'monthly'}
					months
				{:else if localFrequency === 'quarterly'}
					quarters
				{:else if localFrequency === 'yearly'}
					years
				{/if}
			</p>
		</div>

		<!-- Weekly -->

		{#if localFrequency === 'weekly'}
			<div class="grid gap-2">
				<Label>Day of week</Label>

				<Select.Root type="single" bind:value={localDayOfWeek}>
					<Select.Trigger class="w-full">
						{weekdays.find((d) => d.value === setting.dayOfWeek)?.label ?? 'Select day'}
					</Select.Trigger>

					<Select.Content>
						{#each weekdays as day}
							<Select.Item value={String(day.value)}>
								{day.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}

		<!-- Monthly / Quarterly -->

		{#if localFrequency === 'monthly' || localFrequency === 'quarterly'}
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label>Recurrence type</Label>

					<RadioGroup.Root bind:value={localRecurrenceType} class="grid gap-3">
						<div class="flex items-center gap-2">
							<RadioGroup.Item value="day_of_month" id={`dom-${setting.id}`} />

							<Label for={`dom-${setting.id}`}>Same day each month</Label>
						</div>

						<div class="flex items-center gap-2">
							<RadioGroup.Item value="last_day_of_month" id={`ldom-${setting.id}`} />

							<Label for={`ldom-${setting.id}`}>Last day of month</Label>
						</div>
					</RadioGroup.Root>
				</div>

				{#if setting.recurrenceType === 'day_of_month'}
					<div class="grid gap-2">
						<Label for={`day-of-month-${setting.id}`}>Day of month</Label>

						<Input
							id={`day-of-month-${setting.id}`}
							type="number"
							min="1"
							max="31"
							bind:value={setting.dayOfMonth}
						/>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Yearly -->

		{#if localFrequency === 'yearly'}
			<div class="grid gap-6">
				<div class="grid gap-2">
					<Label>Month</Label>

					<Select.Root type="single" bind:value={localMonthOfYear}>
						<Select.Trigger class="w-full">
							{months.find((m) => m.value === setting.monthOfYear)?.label ?? 'Select month'}
						</Select.Trigger>

						<Select.Content>
							{#each months as month}
								<Select.Item value={String(month.value)}>
									{month.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label>Recurrence type</Label>

						<RadioGroup.Root bind:value={localRecurrenceType} class="grid gap-3">
							<div class="flex items-center gap-2">
								<RadioGroup.Item value="day_of_month" id={`yearly-dom-${setting.id}`} />

								<Label for={`yearly-dom-${setting.id}`}>Same day each year</Label>
							</div>

							<div class="flex items-center gap-2">
								<RadioGroup.Item value="last_day_of_month" id={`yearly-ldom-${setting.id}`} />

								<Label for={`yearly-ldom-${setting.id}`}>Last day of month</Label>
							</div>
						</RadioGroup.Root>
					</div>

					{#if setting.recurrenceType === 'day_of_month'}
						<div class="grid gap-2">
							<Label for={`yearly-day-${setting.id}`}>Day of month</Label>

							<Input
								id={`yearly-day-${setting.id}`}
								type="number"
								min="1"
								max="31"
								bind:value={setting.dayOfMonth}
							/>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Anchor Date -->

		<div class="grid gap-2">
			<Label for={`anchor-${setting.id}`}>Start date</Label>

			<Input id={`anchor-${setting.id}`} type="date" bind:value={setting.anchorDate} />
		</div>
	{/if}
</div>
