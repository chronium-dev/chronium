<script lang="ts">
	type IconWrapperProps = {
		size?: number;
		color?: string;
		fill?: string; // Add this
		strokeWidth?: number;
		class?: string;
		children: import('svelte').Snippet; // Use the proper Snippet type for Svelte 5
	};

	let {
		size = 24,
		color = 'currentColor',
		fill = 'none', // Default to none
		strokeWidth = 2,
		children,
		...rest
	}: IconWrapperProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	{fill} 
	stroke={color}
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={rest.class}
	{...rest}
>
	{@render children()}
</svg>