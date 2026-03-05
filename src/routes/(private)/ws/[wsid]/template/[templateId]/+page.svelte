<script lang="ts">
	import { deserialize } from '$app/forms';
	import EditablePlaceholderRow from '$lib/components/EditablePlaceholderRow.svelte';
	import EditableRow from '$lib/components/EditableRow.svelte';
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import EditIcon from '$lib/components/icons/EditIcon.svelte';
	import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
	import UrlIcon from '$lib/components/icons/UrlIcon.svelte';
	import XIcon from '$lib/components/icons/XIcon.svelte';
	import LogoIcon from '$lib/components/LogoIcon.svelte';
	import LogoName from '$lib/components/LogoName.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { getSurveyPageFullUrl } from '$lib/utils/url';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let { template, success } = $derived(data);
	let logoDraft = $state<string | null>(null);
	let logoSave = $state<string | null>(null);
	let logoFile = $state<File | null>();
	let thankyouLogoDraft = $state<string | null>(null);
	let thankyouLogoSave = $state<string | null>(null);
	let thankyouLogoFile = $state<File | null>();
	let url = $derived(template.id ? getSurveyPageFullUrl(template.id) : '');
	let view = $state<'survey' | 'thankyou' | 'url'>('survey');
	let fileInput: HTMLInputElement | null = null;
	let thankyouFileInput: HTMLInputElement | null = null;
	let showThankYou = $state(false);
	let mode = $state<'view' | 'edit' | 'saving'>('view');
	const MAX_SIZE = 1 * 1024 * 1024; // 1MB in bytes
	//const MAX_SIZE = 1024;

	let rating = $state(4);

	$effect(() => {
		logoDraft = template?.logoUrl ?? null;
		thankyouLogoDraft = template?.thankyouLogoUrl ?? null;
	});

	async function onLogoFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		console.log('onLogoFileChange, file:', file);

		if (file && file.size > MAX_SIZE) {
			toast.error(`File too large. Maximum size is ${MAX_SIZE / (1024 * 1024)}MB`);
			return;
		}

		logoFile = file;

		const reader = new FileReader();
		reader.onload = () => {
			logoDraft = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	async function onThankyouLogoFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		console.log('onThankyouLogoFileChange, file:', file);

		if (file && file.size > MAX_SIZE) {
			toast.error(`File too large. Maximum size is ${MAX_SIZE / (1024 * 1024)}MB`);
			return;
		}

		thankyouLogoFile = file;

		const reader = new FileReader();
		reader.onload = () => {
			thankyouLogoDraft = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	async function saveLogoToDb() {
		debugger;
		console.log('saveLogoToDb, logoFile:', logoFile);
		console.log('saveLogoToDb, logoDraft:', logoDraft);
		console.log('saveLogoToDb, template.logoUrl:', template.logoUrl);
		try {
			const formData = new FormData();
			formData.set('templateId', template.id);
			formData.set('logoType', 'survey');
			if (logoFile) {
				formData.set('logoFile', logoFile);
			}
			// if (template.logoUrl) {
			// 	formData.set('oldUrl', template.logoUrl);
			// }

			if (!logoFile) {
				debugger;
				const res = await fetch('?/deleteLogoField', {
					method: 'POST',
					body: formData
				});

				const text = await res.text();
				const result = deserialize(text);

				if (result.type === 'success') {
					toast.success('Logo removed');
				} else if (result.type === 'failure') {
					toast.error('Logo remove failed');
				} else {
					toast.error('Unexpected response');
				}
				return;
			}

			const res = await fetch('?/updateLogoField', {
				method: 'POST',
				body: formData
			});

			const text = await res.text();
			const result = deserialize(text);

			console.log('result:', result);
			debugger;

			if (result.type === 'success') {
				// template.logoUrl = result.data?.url as string;
				logoDraft = result.data?.url as string;
				toast.success('Logo updated!');
			} else if (result.type === 'failure') {
				toast.error('Logo save failed');
			} else {
				toast.error('Unexpected response');
			}
		} catch (err) {
			console.error(err);
			alert('Logo file save failed');
		}
	}

	async function saveThankyouLogoToDb() {
		debugger;
		console.log('saveThankyouLogoToDb, thankyouLogoFile:', thankyouLogoFile);
		console.log('saveThankyouLogoToDb, thankyouLogoDraft:', thankyouLogoDraft);
		console.log('saveThankyouLogoToDb, template.thankyouLogoUrl:', template.thankyouLogoUrl);
		try {
			const formData = new FormData();
			formData.set('templateId', template.id);
			formData.set('logoType', 'thankyou');
			if (thankyouLogoFile) {
				formData.set('thankyouLogoFile', thankyouLogoFile);
			}

			if (!thankyouLogoFile) {
				debugger;
				const res = await fetch('?/deleteLogoField', {
					method: 'POST',
					body: formData
				});

				const text = await res.text();
				const result = deserialize(text);

				if (result.type === 'success') {
					toast.success('Logo removed');
				} else if (result.type === 'failure') {
					toast.error('Logo remove failed');
				} else {
					toast.error('Unexpected response');
				}
				return;
			}

			const res = await fetch('?/updateLogoField', {
				method: 'POST',
				body: formData
			});

			const text = await res.text();
			const result = deserialize(text);

			console.log('result:', result);
			debugger;

			if (result.type === 'success') {
				// template.logoUrl = result.data?.url as string;
				thankyouLogoDraft = result.data?.url as string;
				toast.success('Logo updated!');
			} else if (result.type === 'failure') {
				toast.error('Logo save failed');
			} else {
				toast.error('Unexpected response');
			}
		} catch (err) {
			console.error(err);
			alert('Logo file save failed');
		}
	}

	async function handleSave({ fieldKey, value }: { fieldKey: string; value: string }) {
		//const { fieldKey, value } = event.detail;
		console.log('handleSave:', fieldKey, value);

		try {
			const formData = new FormData();
			formData.set('templateId', template.id);
			formData.set('field', fieldKey);
			formData.set('value', value);

			const res = await fetch('?/updateField', {
				method: 'POST',
				body: formData
			});

			const text = await res.text();
			const result = deserialize(text);

			// console.log('result:', result);
			// debugger;

			if (result.type === 'success') {
				// debugger;
				const data = result.data;
				if (data && data.success) {
					(template as any)[fieldKey] = value;
				} else {
					toast.error('Save failed');
				}
			} else if (result.type === 'failure') {
				toast.error('Save failed');
			} else {
				toast.error('Unexpected response');
			}
		} catch (err) {
			console.error(err);
			alert('Save failed');
		}
	}

	async function editLogo() {
		logoSave = logoDraft;
		mode = 'edit';
		fileInput?.click();
	}

	function cancelLogo() {
		logoDraft = logoSave;
		mode = 'view';
	}

	function deleteLogo() {
		logoDraft = null;
		logoFile = null;
		mode = 'edit';
	}

	async function saveLogo() {
		mode = 'saving';
		await saveLogoToDb();
		mode = 'view';
	}

	async function editThankyouLogo() {
		thankyouLogoSave = thankyouLogoDraft;
		mode = 'edit';
		thankyouFileInput?.click();
	}

	function cancelThankyouLogo() {
		thankyouLogoDraft = thankyouLogoSave;
		mode = 'view';
	}

	function deleteThankyouLogo() {
		thankyouLogoDraft = null;
		thankyouLogoFile = null;
		mode = 'edit';
	}

	async function saveThankyouLogo() {
		mode = 'saving';
		await saveThankyouLogoToDb();
		mode = 'view';
	}
</script>

<div class="mx-auto max-w-xl border border-purple-500 px-4 sm:px-0">
	<PageHeader title="Edit rating template" align="center" class="mb-2" />

	<Tabs.Root value="survey" class="">
		<Tabs.List>
			<Tabs.Trigger value="survey">Survey</Tabs.Trigger>
			<Tabs.Trigger value="thankyou">Thank You</Tabs.Trigger>
			<Tabs.Trigger value="url">Your Rating URL</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="survey">
			<div class="flex justify-center px-0 py-2">
				<div class="w-full space-y-0">
					<!-- Logo upload -->
					<div class="grid grid-cols-[1fr_auto] items-start gap-x-4">
						<!-- Preview -->
						<div class="rounded-t-xl border-x border-t border-slate-300 p-2">
							{#if logoDraft}
								<img
									src={logoDraft}
									alt="Logo"
									class="mx-auto max-h-20 w-auto max-w-full object-contain"
								/>
							{:else}
								<div class="mb-5 max-h-24 w-full object-contain text-center text-sm">
									- no logo selected -
								</div>
							{/if}
						</div>

						<!-- Controls -->
						<div class="flex flex-col gap-4 pt-4 text-xs text-muted-foreground">
							<div class="flex flex-col gap-2">
								{#if mode === 'view'}
									<button onclick={editLogo} aria-label="Edit"><EditIcon class="h-4 w-4" /></button>
								{:else if mode === 'edit'}
									<button onclick={saveLogo} aria-label="Save">
										<CheckIcon class="h-4 w-4 text-green-500" />
									</button>
									<button onclick={cancelLogo} aria-label="Cancel"
										><XIcon class="h-4 w-4 text-red-500" /></button
									>
								{:else}
									<span><Spinner class="h4 w-4 text-blue-600" /></span>
								{/if}
								<input
									type="file"
									accept="image/*"
									bind:this={fileInput}
									style="display: none;"
									onchange={onLogoFileChange}
								/>
							</div>
							{#if logoDraft && mode != 'saving' && mode != 'edit'}
								<button onclick={deleteLogo} aria-label="Delete"
									><TrashIcon class="h-4 w-4" /></button
								>
							{/if}
						</div>
					</div>

					<!-- Editable Rows -->
					<EditableRow
						fieldKey="surveyTitle"
						value={template.surveyTitle}
						textarea={true}
						maxLength={120}
						onSave={handleSave}
						className="text-center text-2xl font-semibold text-balance"
						><div slot="after" class="mt-1"></div></EditableRow
					>

					<EditableRow
						fieldKey="surveyIntro"
						value={template.surveyIntro}
						textarea={true}
						maxLength={200}
						onSave={handleSave}
						className="text-center text-xl text-balance"
						><hr slot="after" class="mt-3 mb-0 border-t border-[#6ea527] border-x-slate-300" />
					</EditableRow>

					<EditableRow
						fieldKey="surveyRatingQuestion"
						value={template.surveyRatingQuestion}
						textarea={true}
						maxLength={200}
						onSave={handleSave}
						className="text-md text-center text-balance"
					>
						<div slot="after" class="mt-3 flex justify-center gap-2 text-2xl select-none">
							<StarRating bind:rating />
						</div>
					</EditableRow>

					<EditablePlaceholderRow
						fieldKey="surveyCommentPrompt"
						value={template.surveyCommentPrompt}
						textarea={true}
						maxLength={120}
						onSave={handleSave}
					/>

					<EditablePlaceholderRow
						fieldKey="surveyEmailPrompt"
						value={template.surveyEmailPrompt ?? ''}
						textarea={false}
						maxLength={120}
						onSave={handleSave}
					/>

					<EditableRow
						fieldKey="surveyEmailDisclaimer"
						value={template.surveyEmailDisclaimer ?? ''}
						textarea={true}
						maxLength={120}
						onSave={handleSave}
						className="text-xs text-muted-foreground"
						><hr
							slot="after"
							class="mt-3 mb-0 border-t border-[#6ea527] border-x-slate-300"
						/></EditableRow
					>

					<div class="grid grid-cols-[1fr_auto] items-start gap-x-4">
						<div class="rounded-b-xl border-x border-b border-slate-300 p-2">
							<div class="flex flex-col">
								<!-- Fake Submit button -->
								<div class="mt-1 flex justify-center">
									<Button type="button" class="mb-2 ">Submit</Button>
								</div>
								<div class="mx-auto mt-8 flex gap-x-2">
									<p class="mt-1 text-[8px] text-muted-foreground">Powered by</p>
									<a href="/" class="flex items-center space-x-1">
										<LogoIcon width={17} height={17} />
										<LogoName height="20" />
									</a>
								</div>
							</div>
						</div>

						<div class="flex flex-col pt-0 text-xs text-muted-foreground">
							<div class="flex flex-col gap-2">
								<div class="h-4 w-4"></div>
							</div>
						</div>
					</div>
				</div>
			</div></Tabs.Content
		>
		<Tabs.Content value="thankyou">
			<div class="flex justify-center px-0 py-2">
				<div class="w-full space-y-0">
					<!-- Logo upload -->
					<div class="grid grid-cols-[1fr_auto] items-start gap-x-4">
						<!-- Preview -->
						<div class="rounded-t-xl border-x border-t border-slate-300 p-2">
							{#if thankyouLogoDraft}
								<img
									src={thankyouLogoDraft}
									alt="Logo"
									class="mx-auto max-h-20 w-auto max-w-full object-contain"
								/>
							{:else}
								<div class="mb-5 max-h-24 w-full object-contain text-center text-sm">
									- no logo selected -
								</div>
							{/if}
						</div>

						<!-- Controls -->
						<div class="flex flex-col gap-4 pt-4 text-xs text-muted-foreground">
							<div class="flex flex-col gap-2">
								{#if mode === 'view'}
									<button onclick={editThankyouLogo} aria-label="Edit"
										><EditIcon class="h-4 w-4" /></button
									>
								{:else if mode === 'edit'}
									<button onclick={saveThankyouLogo} aria-label="Save">
										<CheckIcon class="h-4 w-4 text-green-500" />
									</button>
									<button onclick={cancelThankyouLogo} aria-label="Cancel"
										><XIcon class="h-4 w-4 text-red-500" /></button
									>
								{:else}
									<span><Spinner class="h4 w-4 text-blue-600" /></span>
								{/if}
								<input
									type="file"
									accept="image/*"
									bind:this={thankyouFileInput}
									style="display: none;"
									onchange={onThankyouLogoFileChange}
								/>
							</div>
							{#if thankyouLogoDraft && mode != 'saving' && mode != 'edit'}
								<button onclick={deleteThankyouLogo} aria-label="Delete"
									><TrashIcon class="h-4 w-4" /></button
								>
							{/if}
						</div>
					</div>

					<!-- Editable Rows -->
					<EditableRow
						fieldKey="thankyouTitle"
						value={template.thankyouTitle}
						textarea={true}
						maxLength={120}
						onSave={handleSave}
						className="text-center text-2xl font-semibold text-balance"
						><div slot="after" class="mt-1"></div></EditableRow
					>

					<!-- Thank you text -->
					<EditableRow
						fieldKey="thankyouText"
						value={template.thankyouText}
						textarea={true}
						maxLength={120}
						onSave={handleSave}
						className="text-center text-xl text-balance"
						><hr slot="after" class="mt-3 mb-0 border-t border-[#6ea527] border-x-slate-300" />
					</EditableRow>

					<EditableRow
						fieldKey="thankyouClose"
						value={template.thankyouClose}
						textarea={true}
						maxLength={120}
						onSave={handleSave}
						className="text-md text-center text-balance"
					/>

					<div class="grid grid-cols-[1fr_auto] items-start gap-x-4">
						<div class="rounded-b-xl border-x border-b border-slate-300 p-2">
							<div class="flex flex-col">
								<div class="mx-auto mt-8 flex gap-x-2">
									<p class="mt-1 text-[8px] text-muted-foreground">Powered by</p>
									<a href="/" class="flex items-center space-x-1">
										<LogoIcon width={17} height={17} />
										<LogoName height="20" />
									</a>
								</div>
							</div>
						</div>

						<div class="flex flex-col pt-0 text-xs text-muted-foreground">
							<div class="flex flex-col gap-2">
								<div class="h-4 w-4"></div>
							</div>
						</div>
					</div>
				</div>
			</div></Tabs.Content
		>
		<Tabs.Content value="url">
			<div class="grid grid-cols-1 space-y-3 rounded-xl border border-slate-300 p-2">
				<div class="mb-0 flex w-full items-center text-sm text-current sm:text-base">
					<UrlIcon class="h-4 w-4" />
					<div>
						<div class="mx-3 mt-3">
							<div>
								<p class="mb-4 text-sm">
									This is your unique rating URL. Share it—or the QR code—to promote your customer
									feedback channels. You can include them in emails, on your website, on posters, or
									in printed materials. Customers can simply scan the QR code with their
									smartphones, so there’s no need to remember the URL.
								</p>
								<div class="mb-6 flex flex-row">
									<p class="mt-1 font-medium">{url}</p>
									<div>
										<Button
											variant="outline"
											size="icon"
											aria-label="Copy URL"
											onclick={() => {
												void navigator.clipboard.writeText(url);
												// console.log('success');
												toast.success('URL copied to clipboard');
											}}
											class={'ml-3 flex-none'}
										>
											<CopyIcon class="h-5 w-5" />
										</Button>
									</div>
									<!-- <Tooltip>
										<TooltipTrigger>
											<Button
												variant="ghost"
												type="button"
												onclick={() => {
													void navigator.clipboard.writeText(url);
													// console.log('success');
													toast.success('URL copied to clipboard');
												}}
												class={'mx-1 flex-none'}
											>
												<CopyIcon class="mr-2 size-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Copy to clipboard</p>
										</TooltipContent>
									</Tooltip> -->
								</div>
							</div>

							<div class={'mt-2 mb-3 flex-none'}>
								<QrCode {url} />
							</div>

							<!-- <FormField
                              control={form.control}
                              name='activated'
                              render={({ field }) => (
                                <FormItem class='ml-4 mr-2 flex flex-row items-center space-x-2 rounded-md border-2 border-blue-200 p-3'>
                                  <FormLabel class='mt-1'>Activated?</FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={(field.value ?? false) && canActivate()}
                                      onCheckedChange={field.onChange}
                                      disabled={!canActivate() || !!template.locked}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /> -->
						</div>
					</div>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
