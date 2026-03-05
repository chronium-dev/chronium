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
	<path d="M4 10a8 8 0 1 1 8 8H4" /><path d="m8 22-4-4 4-4" />
</IconWrapper>
