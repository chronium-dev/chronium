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
	<path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path
		d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
	/>
</IconWrapper>
