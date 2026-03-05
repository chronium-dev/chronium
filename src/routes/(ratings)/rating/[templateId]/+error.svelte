<script>
	import { page } from '$app/state';
</script>

<main class="grid min-h-screen place-items-center bg-slate-50 px-6 py-24 sm:py-32 lg:px-8">
	<div class="text-center">
		<p class="text-base font-semibold text-orange-600">
			{page.status}
		</p>
		
		<h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-slate-900 sm:text-7xl">
			{page.error?.message || 'Something went wrong'}
		</h1>
		
		<p class="mt-6 text-lg font-medium text-pretty text-slate-500 sm:text-xl/8">
			Sorry, we couldn’t find the template you’re looking for. It might have been deleted or moved.
		</p>

		<div class="mt-10 flex items-center justify-center gap-x-6">
			<a
				href="/"
				class="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
			>
				Go back home
			</a>
			<a href="/support" class="text-sm font-semibold text-slate-900">
				Contact support <span aria-hidden="true">&rarr;</span>
			</a>
		</div>
	</div>
</main>