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
	<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path
		d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
	/>
</IconWrapper>
