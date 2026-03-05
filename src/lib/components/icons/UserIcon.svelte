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
	<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
	<circle cx="12" cy="7" r="4" />
</IconWrapper>
