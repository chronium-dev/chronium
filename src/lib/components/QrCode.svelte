<script lang="ts">
	import QRCode from 'qrcode';

	interface Props {
		url: string;
		size?: number;
		filename?: string;
	}

	const { url, size = 192, filename = 'qr-code' }: Props = $props();

	let svg = $state('');

	$effect(() => {
		if (!url) {
			svg = '';
			return;
		}

		(async () => {
			svg = await QRCode.toString(url, {
				type: 'svg',
				margin: 1
			});
		})();
	});

	function downloadPng() {
		if (!svg) return;

		const img = new Image();
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const urlObject = URL.createObjectURL(blob);

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.drawImage(img, 0, 0, size, size);

			const pngUrl = canvas.toDataURL('image/png');

			const a = document.createElement('a');
			a.href = pngUrl;
			a.download = `${filename}.png`;
			a.click();

			URL.revokeObjectURL(urlObject);
		};

		img.src = urlObject;
	}
</script>

<div class="inline-flex flex-col items-center gap-2">
	<div class="inline-block" style="width: {size}px; height: {size}px">
		{@html svg}
	</div>

	<button
		type="button"
		onclick={downloadPng}
		class="text-sm text-muted-foreground underline hover:text-foreground"
	>
		Download PNG
	</button>
</div>
