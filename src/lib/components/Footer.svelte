<script>
	import ThemeDropdownMainMenu from './ThemeDropdownMainMenu.svelte';

	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
	<div class="mx-auto max-w-6xl px-6 py-12 md:px-20">
		<!-- Main Footer Content -->
		<div class="mb-8 flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
			<!-- Brand Section -->
			<div class="text-center md:text-left">
				<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Chronium</h3>
				<p class="max-w-xs text-sm text-gray-600 dark:text-gray-400">
					The simplest way for small businesses to collect and respond to customer feedback.
				</p>
			</div>

			<!-- Links Section -->
			<div class="flex flex-wrap justify-center gap-6 text-sm md:gap-8">
				<a
					href="/"
					class="font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
				>
					Home
				</a>
				<a
					href="/about"
					class="font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
				>
					About
				</a>
				<a
					href="/terms"
					class="font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
				>
					Terms
				</a>
				<a
					href="/privacy"
					class="font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
				>
					Privacy
				</a>
				<a
					href="/contact"
					class="font-medium text-gray-700 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
				>
					Contact
				</a>
				<ThemeDropdownMainMenu />
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-gray-200 pt-8 text-center dark:border-gray-800">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				© {currentYear} Chronium. All rights reserved.
			</p>
		</div>
	</div>
</footer>
