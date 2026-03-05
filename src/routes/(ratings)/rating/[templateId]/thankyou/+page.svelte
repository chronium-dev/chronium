<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import LogoIcon from '$lib/components/LogoIcon.svelte';
	import LogoName from '$lib/components/LogoName.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let pending = $state(false);
	let rating = $state(0);
</script>

<div class="mx-auto max-w-xl">
	<div class="rounded-lg border py-4">
		<!-- {#if form?.formError}
			<p class="mb-4 text-sm text-destructive">
				{form.formError}
			</p>
		{/if} -->

		<div>
			<div class="space-y-4 px-5">
				{#if data.template.thankyouLogoUrl}
					<img
						src={data.template.thankyouLogoUrl}
						alt="Logo"
						class="mx-auto max-h-20 w-auto object-contain"
					/>
				{/if}

				{#if data.template.thankyouTitle}
					<Heading as="h2" class="text-center">
						{data.template.thankyouTitle}
					</Heading>
				{/if}

				<p class="text-center text-xl text-balance whitespace-pre-line">
					{data.template.thankyouText}
				</p>

				<hr class="border-t border-[#6ea527]" />

				<p class="text-md text-center text-balance whitespace-pre-line">
					{data.template.thankyouClose}
				</p>

				<!-- Submit -->
				<div class="flex flex-col items-center space-y-6 mt-10">
					<!-- <Button type="submit">Submit</Button> -->

					<div class="flex items-center gap-2">
						<p class="text-[8px] text-muted-foreground">Powered by</p>
						<a href="/" class="flex gap-1">
							<LogoIcon width={17} height={17} />
							<LogoName height="22" className="-mt-0.5" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
