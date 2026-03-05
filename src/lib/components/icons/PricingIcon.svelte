<script lang="ts">
	import IconWrapper from './IconWrapper.svelte';

	type IconProps = {
		size?: number;
		color?: string;
		strokeWidth?: number;
		class?: string;
	};

	let { size, color, strokeWidth, ...rest }: IconProps = $props();
</script>

<IconWrapper {size} {color} {strokeWidth} {...rest}>
	<path d="M10 16V9.5a1 1 0 0 1 5 0" /><path d="M8 12h4" /><path d="M8 16h7" /><circle
		cx="12"
		cy="12"
		r="10"
	/>
</IconWrapper>
