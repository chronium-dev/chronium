<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { theme } from '$lib/stores/theme';
	import { cn } from '$lib/utils';
	import { toProperCase } from '$lib/utils/misc';
	import { organisationFormSchema, type OrganisationSchema } from '$lib/validations/organisation';
	import { onDestroy, untrack } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let {
		data,
		mode = 'create'
	}: {
		data: SuperValidated<Infer<OrganisationSchema>>;
		mode?: 'create' | 'edit';
	} = $props();

	const sf = untrack(() =>
		superForm(data, {
			validators: zod4Client(organisationFormSchema),
			validationMethod: 'oninput'
		})
	);

	const { form: formData, errors, enhance, submitting, message } = sf;

	// Conditional: only show employee count when payroll is active
	const showEmployeeCount = $derived($formData.payrollActive === 'yes');

	// Conditional: only show VAT selections when VAT registered is true
	const showVatInputs = $derived($formData.vatRegistered === 'yes');

	const submitLabel = $derived(
		$submitting ? 'Saving...' : mode === 'create' ? 'Create company...' : 'Save Changes'
	);

	// Clear employeeCount when payroll is toggled off
	function handlePayrollChange(value: 'yes' | 'no') {
		$formData.payrollActive = value;
		if (value === 'no') {
			$formData.employeeCount = undefined;
		}
	}

	function handleVatRegisteredChange(value: 'yes' | 'no') {
		$formData.vatRegistered = value;
		if (value === 'no') {
			$formData.vatFrequency = undefined;
			$formData.vatQuarterGroup = undefined;
			$formData.vatStartDate = undefined;
		}
	}

	function handleVatFrequencyChange(value: 'monthly' | 'quarterly' | 'annual') {
		$formData.vatFrequency = value;
		if (value !== 'monthly') {
			$formData.vatStartDate = undefined;
		}
	}

	// const colorScheme = $derived(themeMode.current === 'dark' ? 'dark' : 'light');
	// $inspect(colorScheme);

	let isDark = $state(false);

	const unsub = theme.resolved.subscribe((v) => (isDark = v === 'dark'));
	onDestroy(unsub);
</script>

<form method="POST" use:enhance class="max-w-xl space-y-(--space-section)">
	<!-- General form message (success / server error) -->
	{#if $message}
		<div
			class={cn(
				'rounded-md border px-4 py-3 text-sm',
				$message.status === 200
					? 'border-green-200 bg-green-50 text-green-800'
					: 'border-destructive/20 text-white dark:text-red-500'
			)}
		>
			{$message.text}
		</div>
	{/if}

	<!-- 1. Company Name -->
	<Form.Field form={sf} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Company Name</Form.Label>
				<input
					{...props}
					type="text"
					bind:value={$formData.name}
					placeholder="e.g. Acme Ltd"
					class={cn(
						'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
						'ring-offset-background placeholder:text-muted-foreground',
						'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
						$errors.name && 'border-destructive'
					)}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- 2. Incorporation Date -->
	<Form.Field form={sf} name="incorporationDate">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Incorporation Date</Form.Label>
				<input
					{...props}
					type="date"
					bind:value={$formData.incorporationDate}
					class={cn(
						'flex h-10 w-fit rounded-md border border-input bg-background px-3 py-2 text-sm',
						'ring-offset-background',
						'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
						$errors.incorporationDate && 'border-destructive'
					)}
					style="color-scheme: {isDark ? 'dark' : 'light'}"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- 3. Financial Year End Date -->
	<Form.Field form={sf} name="financialYearEnd">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Next Financial Year End</Form.Label>
				<input
					{...props}
					type="date"
					bind:value={$formData.financialYearEnd}
					class={cn(
						'flex h-10 w-fit rounded-md border border-input bg-background px-3 py-2 text-sm',
						'ring-offset-background',
						'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
						$errors.financialYearEnd && 'border-destructive'
					)}
					style="color-scheme: {isDark ? 'dark' : 'light'}"
				/>
				<p class="text-xs text-muted-foreground italic">
					We'll use this to determine your ongoing reporting deadlines
				</p>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- 4. VAT Registered (horizontal radio) -->
	<Form.Field form={sf} name="vatRegistered">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Are you VAT Registered?</Form.Label>
				<div class="mt-1 flex gap-6">
					{#each ['yes', 'no'] as option}
						<label class="flex cursor-pointer items-center gap-2">
							<input
								type="radio"
								name={props.name}
								value={option}
								checked={$formData.vatRegistered === option}
								onchange={() => handleVatRegisteredChange(option as 'yes' | 'no')}
								class="h-4 w-4 border-input text-primary focus:ring-ring"
							/>
							<span class="text-sm">{option === 'yes' ? 'Yes' : 'No'}</span>
						</label>
					{/each}
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if showVatInputs}
		<Form.Field form={sf} name="vatFrequency">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>How often do you submit VAT returns?</Form.Label>
					<div class="mt-1 flex flex-col gap-3">
						{#each ['quarterly', 'monthly', 'annual'] as option}
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name={props.name}
									value={option}
									checked={$formData.vatFrequency === option}
									onchange={() =>
										handleVatFrequencyChange(option as 'monthly' | 'quarterly' | 'annual')}
									class="h-4 w-4 border-input text-primary focus:ring-ring"
								/>
								<span class="text-sm">{toProperCase(option)}</span>
							</label>
						{/each}
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field form={sf} name="vatStartDate">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>When is your next VAT period end?</Form.Label>
					<input
						{...props}
						type="month"
						bind:value={$formData.vatStartDate}
						class={cn(
							'flex h-10 w-fit rounded-md border border-input bg-background px-3 py-2 text-sm',
							'ring-offset-background',
							'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
							$errors.vatStartDate && 'border-destructive'
						)}
						style="color-scheme: {isDark ? 'dark' : 'light'}"
					/>
					<p class="text-xs text-muted-foreground italic">
						Select the month in which your VAT period ends
					</p>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/if}

	<!-- 5. Payroll / PAYE Active (horizontal radio) -->
	<Form.Field form={sf} name="payrollActive">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Payroll / PAYE Active?</Form.Label>
				<div class="mt-1 flex gap-6">
					{#each ['yes', 'no'] as option}
						<label class="flex cursor-pointer items-center gap-2">
							<input
								type="radio"
								name={props.name}
								value={option}
								checked={$formData.payrollActive === option}
								onchange={() => handlePayrollChange(option as 'yes' | 'no')}
								class="h-4 w-4 border-input text-primary focus:ring-ring"
							/>
							<span class="text-sm">{option === 'yes' ? 'Yes' : 'No'}</span>
						</label>
					{/each}
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- 6. Number of Employees (vertical radio, conditional) -->
	{#if showEmployeeCount}
		<Form.Field form={sf} name="employeeCount">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Number of Employees</Form.Label>
					<div class="mt-1 flex flex-col gap-3">
						{#each ['0', '1-5', '6-20', '20+'] as option}
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name={props.name}
									value={option}
									bind:group={$formData.employeeCount}
									class="h-4 w-4 border-input text-primary focus:ring-ring"
								/>
								<span class="text-sm">{option}</span>
							</label>
						{/each}
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/if}

	<!-- 7. Business Premises (horizontal radio) -->
	<Form.Field form={sf} name="businessPremises">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Do you operate from business premises?</Form.Label>
				<div class="mt-1 flex gap-6">
					{#each ['yes', 'no'] as option}
						<label class="flex cursor-pointer items-center gap-2">
							<input
								type="radio"
								name={props.name}
								value={option}
								bind:group={$formData.businessPremises}
								class="h-4 w-4 border-input text-primary focus:ring-ring"
							/>
							<span class="text-sm">{option === 'yes' ? 'Yes' : 'No'}</span>
						</label>
					{/each}
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- 8. Submit -->
	<Button type="submit" disabled={$submitting} class="w-full sm:w-auto">
		{#if $submitting}
			<svg
				class="mr-2 h-4 w-4 animate-spin"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
			</svg>
		{/if}
		{submitLabel}
	</Button>
</form>
