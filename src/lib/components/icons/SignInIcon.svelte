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
	<path d="m10 17 5-5-5-5" /><path d="M15 12H3" /><path
		d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
	/>
</IconWrapper>
