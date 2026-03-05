<script lang="ts">
	import { goto } from '$app/navigation';
	import InboxScreenshot from '$lib/assets/inbox-screenshot.png';
	import QRCodeExample from '$lib/assets/qr-code.png';
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
		Collect 5-Star Feedback.<br />Reply Instantly.
	</h1>

	<p class="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
		The simplest way for small businesses to hear from customers and respond - no dashboards, no
		setup, no jargon.
	</p>

	<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
		<Button
			class="h-12 px-8 text-base font-semibold shadow-lg transition-transform hover:scale-105"
			onclick={() => goto('/get-your-rating-link')}
		>
			Get Your Rating Link →
		</Button>
		<Button
			variant="outline"
			class="h-12 border-2 px-8 text-base font-semibold transition-transform hover:scale-105"
			onclick={() => goto('/about')}
		>
			Learn More
		</Button>
	</div>

	<p class="mt-6 text-sm text-muted-foreground">
		✨ Free to start • No credit card required • Cancel anytime
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
				<h3 class="mb-3 text-xl font-bold">Create Your Rating Link</h3>
				<p class="max-w-xs leading-relaxed text-muted-foreground">
					One question, one thank-you message - editable in seconds. No complicated forms or
					surveys.
				</p>
			</div>

			<div class="flex flex-col items-center text-center transition-transform hover:scale-105">
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-bold text-white shadow-lg"
				>
					2
				</div>
				<h3 class="mb-3 text-xl font-bold">Share Your Link or QR Code</h3>
				<p class="max-w-xs leading-relaxed text-muted-foreground">
					Place it wherever your customers interact: website, email signatures, table tents,
					receipts... anywhere you want.
				</p>
			</div>

			<div class="flex flex-col items-center text-center transition-transform hover:scale-105">
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-bold text-white shadow-lg"
				>
					3
				</div>
				<h3 class="mb-3 text-xl font-bold">See Ratings, Reply - and Showcase the Best</h3>
				<p class="max-w-xs leading-relaxed text-muted-foreground">
					See ratings in one inbox, reply instantly, and publish the best ones to your Feedback
					Wall.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Benefits / Why It's Different -->
<section class="px-6 py-24 md:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">Why RatingsRobot?</h2>
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
				<h3 class="mb-3 text-xl font-bold">Catch Problems Early</h3>
				<p class="leading-relaxed text-muted-foreground">
					See problems before they become bad reviews. No complex analytics - just actionable
					feedback.
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
				<h3 class="mb-3 text-xl font-bold">Personal, Fast Replies</h3>
				<p class="leading-relaxed text-muted-foreground">
					Keep customers happy with fast, personal responses. Reply directly to anyone who provides
					an email.
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
				<h3 class="mb-3 text-xl font-bold">Zero Complexity</h3>
				<p class="leading-relaxed text-muted-foreground">
					One survey, one inbox, one flow - nothing else to set up. Get started in under 2 minutes.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Feedback Wall Highlight -->
<section class="bg-muted/50 px-6 py-20 md:px-20">
	<div class="mx-auto max-w-6xl grid gap-12 md:grid-cols-2 items-center">
		<div>
			<h2 class="mb-4 text-3xl font-bold">
				Showcase the Best with Your Feedback Wall
			</h2>

			<p class="mb-6 text-lg leading-relaxed text-muted-foreground">
				Not all feedback has to stay private. Publish your best ratings to a
				public Feedback Wall you can proudly share.
			</p>

			<ul class="space-y-3 text-muted-foreground">
				<li>⭐ Highlight real 5-star reviews</li>
				<li>🔗 Share a simple public link</li>
				<li>🛡️ You control what goes live</li>
			</ul>
		</div>

		<div class="relative">
			<div class="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl"></div>
			<div class="relative rounded-2xl border bg-card p-6 shadow-xl">
				<div class="mb-2 text-2xl">⭐⭐⭐⭐⭐</div>
				<p class="italic leading-relaxed">
					“Fantastic service — quick response and very friendly staff.”
				</p>
				<p class="mt-4 text-sm text-muted-foreground">
					— Sarah, verified customer
				</p>
			</div>
		</div>
	</div>
</section>


<!-- Testimonials -->
<section class="bg-muted px-6 py-24 md:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold">What Our Customers Say</h2>
			<p class="text-lg text-muted-foreground">Real results from real businesses</p>
		</div>

		<div class="flex flex-col justify-center gap-8 md:flex-row">
			<div
				class="flex-1 rounded-2xl border-2 bg-card p-8 shadow-lg transition-transform hover:scale-105"
			>
				<div class="mb-4 text-4xl">⭐⭐⭐⭐⭐</div>
				<p class="mb-4 text-lg leading-relaxed italic">
					"We doubled the number of 5-star reviews in one month! RatingsRobot made it so easy."
				</p>
				<span class="font-bold">– Local Café Owner</span>
			</div>

			<div
				class="flex-1 rounded-2xl border-2 bg-card p-8 shadow-lg transition-transform hover:scale-105"
			>
				<div class="mb-4 text-4xl">⭐⭐⭐⭐⭐</div>
				<p class="mb-4 text-lg leading-relaxed italic">
					"Finally, an inbox that doesn't confuse me. Simple, clean, and it just works."
				</p>
				<span class="font-bold">– Boutique Store Manager</span>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="px-6 py-24 text-center md:px-20">
	<div class="mx-auto max-w-3xl">
		<h2 class="mb-6 text-4xl font-bold md:text-5xl">Ready to Get Started?</h2>
		<p class="mb-10 text-xl leading-relaxed text-muted-foreground">
			Join hundreds of small businesses already using RatingsRobot to improve customer satisfaction.
		</p>

		<Button
			class="h-14 px-10 text-lg font-bold shadow-2xl transition-transform hover:scale-110"
			onclick={() => goto('/get-your-rating-link')}
		>
			Get Your Rating Link →
		</Button>

		<p class="mt-6 text-lg text-muted-foreground">
			✨ Free to start • No credit card required • Set up in 2 minutes
		</p>
	</div>
</section>
