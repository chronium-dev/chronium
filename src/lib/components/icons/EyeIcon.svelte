<script lang="ts">
	import IconWrapper from './IconWrapper.svelte';

	type IconProps = {
		size?: number;
		color?: string;
		strokeWidth?: number;
		class?: string;
	};

	let {
		size,
		color,
		strokeWidth,
		...rest
	}: IconProps = $props();
</script>

<IconWrapper {size} {color} {strokeWidth} {...rest}>
	<path
		d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
	/>
	<circle cx="12" cy="12" r="3" />
</IconWrapper>
