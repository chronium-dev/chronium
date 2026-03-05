<script lang="ts">
	import IconWrapper from './IconWrapper.svelte';

	type IconProps = {
		size?: number;
		color?: string;
		fill?: string; // Add this
		strokeWidth?: number;
		class?: string;
	};

	let { size, color, fill, strokeWidth, ...rest }: IconProps = $props();
</script>

<IconWrapper {size} {color} {fill} {strokeWidth} {...rest}>
	<path
		d="M12 2l2.36 7.23h7.64l-6.15 4.47 2.36 7.23-6.14-4.47-6.15 4.47 2.36-7.23-6.14-4.47h7.64z"
	/>
</IconWrapper>