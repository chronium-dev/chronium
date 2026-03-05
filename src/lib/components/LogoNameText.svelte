<script lang="ts">
	// Define the interface to allow both types
	interface Props {
		height?: number | string;
		color1?: string;
		color2?: string;
		className?: string;
	}

	let {
		height = 40,
		color1 = '#6ea527',
		color2 = 'currentColor',
		className = ''
	}: Props = $props();

	let computedHeight = $derived(typeof height === 'number' ? `${height}px` : height);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 320 80"
	height={computedHeight}
	preserveAspectRatio="xMinYMid meet"
	class={className}
	role="img"
	aria-label="RatingsRobot"
	style="display: block; width: auto;"
>
	<text x="0" y="55" font-family="Cal Sans, system-ui, sans-serif" font-size="48" font-weight="600">
		<tspan fill={color1} letter-spacing="-2">Ratings</tspan>
		<tspan fill={color2} letter-spacing="-2" dx="-6">Robot</tspan>
	</text>
</svg>
