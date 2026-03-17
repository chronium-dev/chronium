<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  
  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(companySchema),
    delayMs: 500
  });

  const { form: formData, enhance, delayed, errors } = form;
</script>

<form method="POST" use:enhance class="max-w-2xl space-y-8 p-6 border rounded-xl bg-card">
  <input type="hidden" name="id" bind:value={$formData.id} />

  <Form.Field {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Company Name</Form.Label>
        <Input {...props} bind:value={$formData.name} placeholder="Acme Corp Ltd" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Form.Field {form} name="incorpDate">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Incorporation Date</Form.Label>
          <Input {...props} type="date" bind:value={$formData.incorpDate} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="financialYearEnd">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Financial Year End</Form.Label>
          <Input {...props} type="date" bind:value={$formData.financialYearEnd} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>

  {#snippet horizontalRadio(name: any, label: string)}
    <Form.Field {form} {name}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>{label}</Form.Label>
          <RadioGroup.Root bind:value={$formData[name]} class="flex items-center space-x-4 pt-2">
            <div class="flex items-center space-x-2">
              <RadioGroup.Item value="Yes" />
              <RadioGroup.Label>Yes</RadioGroup.Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroup.Item value="No" />
              <RadioGroup.Label>No</RadioGroup.Label>
            </div>
          </RadioGroup.Root>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  {/snippet}

  {@render horizontalRadio("isVatRegistered", "VAT Registered?")}
  {@render horizontalRadio("isPayrollActive", "Payroll / PAYE active?")}

  <Form.Field {form} name="employeeCount">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Number of employees?</Form.Label>
        <RadioGroup.Root bind:value={$formData.employeeCount} class="flex flex-col space-y-2 pt-2">
          {#each ["0", "1-5", "6-20", "20+"] as val}
            <div class="flex items-center space-x-2">
              <RadioGroup.Item value={val} />
              <RadioGroup.Label>{val}</RadioGroup.Label>
            </div>
          {/each}
        </RadioGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  {@render horizontalRadio("hasPremises", "Do you operate from business premises?")}

  <Form.Button class="w-full" disabled={$delayed}>
    {#if $delayed}
      <span class="mr-2 h-4 w-4 animate-spin">⏳</span> Saving...
    {:else}
      Continue...
    {/if}
  </Form.Button>
</form>