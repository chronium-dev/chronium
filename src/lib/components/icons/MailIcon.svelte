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
	<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect
		x="2"
		y="4"
		width="20"
		height="16"
		rx="2"
	/>
</IconWrapper>
