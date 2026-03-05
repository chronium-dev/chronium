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
	<path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
</IconWrapper>
