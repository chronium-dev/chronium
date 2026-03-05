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
	<rect width="18" height="7" x="3" y="3" rx="1" /><rect
		width="9"
		height="7"
		x="3"
		y="14"
		rx="1"
	/><rect width="5" height="7" x="16" y="14" rx="1" />
</IconWrapper>
