import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

function createTheme() {
	const { subscribe, set } = writable<ThemeMode>('system');
	const { subscribe: subscribeResolved, set: setResolved } = writable<ResolvedTheme>('light');

	let mediaQuery: MediaQueryList | null = null;

	function getSystemTheme(): ResolvedTheme {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	function apply(mode: ThemeMode) {
		if (!browser) return;

		const resolved = mode === 'system' ? getSystemTheme() : mode;

		const isDark = resolved === 'dark';

		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', mode);

		set(mode);
		setResolved(resolved);
	}

	function init() {
		if (!browser) return;

		const stored = localStorage.getItem('theme') as ThemeMode | null;
		const initial = stored ?? 'system';

		apply(initial);

		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', () => {
			const current = localStorage.getItem('theme') as ThemeMode;
			if (current === 'system') apply('system');
		});
	}

	return {
		subscribe, // user choice
		resolved: { subscribe: subscribeResolved }, // actual theme
		set: apply,
		init
	};
}

export const theme = createTheme();
