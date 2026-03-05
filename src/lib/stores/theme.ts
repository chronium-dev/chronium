import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';

function createTheme() {
	const { subscribe, set } = writable<ThemeMode>('system');

	let mediaQuery: MediaQueryList | null = null;

	function apply(mode: ThemeMode) {
		if (!browser) return;

		const isDark =
			mode === 'dark' ||
			(mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', mode);
		set(mode);
	}

	function init() {
		if (!browser) return;

		const stored = localStorage.getItem('theme') as ThemeMode | null;
		apply(stored ?? 'system');

		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', () => {
			const current = localStorage.getItem('theme') as ThemeMode;
			if (current === 'system') apply('system');
		});
	}

	return {
		subscribe,
		set: apply,
		init
	};
}

export const theme = createTheme();
