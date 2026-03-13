<script lang="ts">
	import { goto } from '$app/navigation';
	import InboxScreenshot from '$lib/assets/inbox-screenshot.png';
	import QRCodeExample from '$lib/assets/qr-code.png';
	import CircleListItem from '$lib/components/CircleListItem.svelte';
	import CrossListItem from '$lib/components/CrossListItem.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<!-- Hero Section -->
<section
	class="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center md:px-20"
>
	<!-- <div class="mb-6 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
		🚀 The Simplest Feedback Tool for Small Businesses
	</div> -->

	<h1 class="mb-6 max-w-4xl text-3xl leading-tight font-bold md:text-4xl">
		Never miss an important business obligation again.
	</h1>

	<p class="leading-relaxedmd:text-xl mb-10 max-w-2xl text-lg text-balance">
		Chronium helps UK limited companies track statutory, operational and governance obligations in
		one simple system.
	</p>

	<p class="text-md mb-10 max-w-2xl leading-relaxed text-balance text-muted-foreground md:text-xl">
		Replace scattered spreadsheets, forgotten reminders and tribal knowledge with a structured
		recurring obligation ledger.
	</p>

	<p class="text-md mb-10 max-w-2xl leading-relaxed text-balance text-[#6ea527] md:text-xl">
		Remove the background stress and risk of missing important company obligations.
	</p>

	<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
		<Button
			class="h-12 px-8 text-base font-semibold shadow-lg transition-transform hover:scale-105"
			onclick={() => goto('/get-your-rating-link')}
		>
			Start Your 14-Day Trial →
		</Button>
		<Button
			variant="outline"
			class="h-12 border-2 px-8 text-base font-semibold transition-transform hover:scale-105"
			onclick={() => goto('/about')}
		>
			Learn How Chronium Works
		</Button>
	</div>

	<p class="mt-6 text-sm text-muted-foreground">
		Built for UK Limited Companies • Simple setup • Cancel anytime
	</p>

	<!-- Screenshot Showcase -->
	<div class="mt-16 flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row">
		<div class="w-full transition-transform hover:scale-[1.02] md:w-2/3">
			<img src={InboxScreenshot} alt="Inbox Screenshot" class="rounded-2xl shadow-2xl" />
		</div>
		<div class="w-full transition-transform hover:scale-[1.02] md:w-1/3">
			<img src={QRCodeExample} alt="QR Code Example" class="rounded-2xl shadow-2xl" />
		</div>
	</div>
</section>

<!-- How It Works -->
<section class="bg-muted px-6 py-24 text-balance md:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">How It Works</h2>
			<!-- <p class="text-lg text-muted-foreground">Three simple steps to better customer feedback</p> -->
		</div>

		<div class="grid gap-12 md:grid-cols-3">
			<div class="flex flex-col items-center text-center transition-transform hover:scale-105">
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 text-2xl font-bold text-white shadow-lg"
				>
					1
				</div>
				<h3 class="mb-3 text-xl font-bold">Add Your Company Obligations</h3>
				<p class="max-w-xs leading-relaxed text-muted-foreground">
					Chronium provides ready-made templates for common UK company obligations such as Companies
					House filings, VAT returns and insurance renewals.
				</p>
			</div>

			<div class="flex flex-col items-center text-center transition-transform hover:scale-105">
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-bold text-white shadow-lg"
				>
					2
				</div>
				<h3 class="mb-3 text-xl font-bold">Assign Responsibility</h3>
				<p class="max-w-xs leading-relaxed text-muted-foreground">
					Allocate obligations to the appropriate team members so everyone knows what they are
					responsible for.
				</p>
			</div>

			<div class="flex flex-col items-center text-center transition-transform hover:scale-105">
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-bold text-white shadow-lg"
				>
					3
				</div>
				<h3 class="mb-3 text-xl font-bold">Track, Complete and Record</h3>
				<p class="max-w-xs leading-relaxed text-muted-foreground">
					Chronium keeps a clear history of what was done, when it was completed, and any notes
					needed for next time.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Why Chronium? -->
<section class="px-6 py-24 md:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">Why Chronium?</h2>
			<p class="text-lg text-muted-foreground">Built for small businesses who value simplicity</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="rounded-2xl border bg-card p-8 shadow-lg transition-transform hover:scale-105">
				<div class="mb-4 inline-block rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
					<svg
						class="h-8 w-8 text-green-600 dark:text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Never Forget Important Deadlines</h3>
				<p class="leading-relaxed text-muted-foreground">
					Track all recurring company obligations in one structured system instead of scattered
					spreadsheets and reminders.
				</p>
			</div>

			<div class="rounded-2xl border bg-card p-8 shadow-lg transition-transform hover:scale-105">
				<div class="mb-4 inline-block rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
					<svg
						class="h-8 w-8 text-blue-600 dark:text-blue-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
						></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Preserve Business Knowledge</h3>
				<p class="leading-relaxed text-muted-foreground">
					Store notes, links, login details and instructions so next year’s task is simple — even if
					staff have changed.
				</p>
			</div>

			<div class="rounded-2xl border bg-card p-8 shadow-lg transition-transform hover:scale-105">
				<div class="mb-4 inline-block rounded-xl bg-orange-100 p-3 dark:bg-orange-900/30">
					<svg
						class="h-8 w-8 text-orange-600 dark:text-orange-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Peace of Mind</h3>
				<p class="leading-relaxed text-muted-foreground">
					Know that nothing important is quietly slipping through the cracks.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- The Three Obligation Types -->
<section class="bg-muted/50 px-6 py-24 md:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">The Three Types of Obligation</h2>
			<p class="text-lg text-muted-foreground">One system for all types of recurring obligation.</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="rounded-2xl border bg-card p-8 shadow-lg transition-transform hover:scale-105">
				<div class="mb-4 inline-block rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
					<svg
						class="h-8 w-8 text-green-600 dark:text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Statutory</h3>
				<p class="mb-2 leading-relaxed text-muted-foreground">Legal obligations such as:</p>
				<ul>
					<CircleListItem label="Confirmation Statements" />
					<CircleListItem label="Director Identity Verifications" />
					<CircleListItem label="Annual Accounts" />
					<CircleListItem label="VAT Returns" />
					<CircleListItem label="PAYE Submissions" />
				</ul>
			</div>

			<div class="rounded-2xl border bg-card p-8 shadow-lg transition-transform hover:scale-105">
				<div class="mb-4 inline-block rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
					<svg
						class="h-8 w-8 text-blue-600 dark:text-blue-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
						></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Operational</h3>
				<p class="mb-2 leading-relaxed text-muted-foreground">
					Essential business tasks such as these examples:
				</p>
				<ul>
					<CircleListItem label="Public liability and employer’s liability insurance renewals" />
					<CircleListItem label="Professional indemnity insurance" />
					<CircleListItem label="Software licence renewals" />
					<CircleListItem label="Fire safety checks" />
					<CircleListItem label="PAT testing" />
					<CircleListItem label="Health & Safety reviews" />
					<CircleListItem label="GDPR / Data Protection reviews" />
					<CircleListItem label="Certification renewals" />
					<CircleListItem label="Trade memberships" />
					<CircleListItem label="Equipment servicing" />
					<CircleListItem label="...etc" />
				</ul>
			</div>

			<div class="rounded-2xl border bg-card p-8 shadow-lg transition-transform hover:scale-105">
				<div class="mb-4 inline-block rounded-xl bg-orange-100 p-3 dark:bg-orange-900/30">
					<svg
						class="h-8 w-8 text-orange-600 dark:text-orange-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Governance - Internal obligations</h3>
				<p class="mb-2 leading-relaxed text-muted-foreground">
					Know that nothing important is quietly slipping through the cracks.
				</p>
				<ul>
					<CircleListItem label="Annual staff appraisals" />
					<CircleListItem label="Salary reviews" />
					<CircleListItem label="Directors meetings" />
					<CircleListItem label="Shareholder meetings" />
					<CircleListItem label="Policy reviews" />
					<CircleListItem label="Risk assessments" />
					<CircleListItem label="Cybersecurity reviews" />
					<CircleListItem label="Business continuity testing" />
					<CircleListItem label="...etc" />
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Replace the Spreadsheet Chaos -->
<section class="flex justify-center px-6 py-20 md:px-20">
	<div class="mx-auto max-w-6xl gap-12">
		<h2 class="mb-4 text-3xl font-bold">Replace the Spreadsheet Chaos</h2>

		<p class="mb-6 text-lg leading-relaxed text-muted-foreground">
			Most companies track obligations like this:
		</p>

		<ul class="space-y-3 text-muted-foreground">
			<CrossListItem label="A spreadsheet someone created years ago" />
			<CrossListItem label="Calendar reminders that get ignored" />
			<CrossListItem label="Knowledge locked in someone's head that has left the business" />
			<CrossListItem label="Old documents nobody can find" />
		</ul>
	</div>
</section>

<!-- Testimonials (LATER...), for now some further positive reasons -->
<section class="bg-muted px-6 py-24 md:px-20">
	<div class="mx-auto max-w-2xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">Designed for Real Businesses</h2>
			<p class="text-lg text-muted-foreground">
				Chronium was created for the everyday realities of running a company - where dozens of small
				but important obligations must be remembered throughout the year.
			</p>

			<p class="my-4 text-xl leading-relaxed text-[#6ea527] italic">
				"When running a business, there are always things that need doing again next year — and you
				never remember how you did them last time."
			</p>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="px-6 py-24 text-center md:px-20">
	<div class="mx-auto max-w-3xl">
		<h2 class="mb-6 text-4xl font-bold md:text-5xl">Stop worrying about forgotten obligations.</h2>
		<p class="mb-10 text-xl leading-relaxed text-muted-foreground">
			Chronium gives your company a calm, reliable system for managing recurring responsibilities.
		</p>

		<Button
			class="h-14 px-10 text-lg font-bold shadow-2xl transition-transform hover:scale-110"
			onclick={() => goto('/get-your-rating-link')}
		>
			Start Your 14-Day Trial →
		</Button>

		<p class="mt-6 text-lg text-muted-foreground">
			Simple pricing • No setup fees • Cancel anytime
		</p>
	</div>
</section>
