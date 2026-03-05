<script lang="ts">
  import { cn } from '$lib/utils';

  const {
    as = 'h2',
    size,
    children,
    ...rest
  } = $props<{
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: string;
    class?: string;
    children?: any;
  }>();
</script>

<svelte:element
  this={as}
  {...rest}
  class={cn(
    'font-semibold tracking-tight',
    // sensible defaults by level
    as === 'h1' && 'text-3xl',
    as === 'h2' && 'text-2xl',
    as === 'h3' && 'text-xl',
    as === 'h4' && 'text-lg',
    as === 'h5' && 'text-base',
    as === 'h6' && 'text-sm uppercase tracking-wide',
    size,
    rest.class
  )}
>
  {@render (children ?? (() => ''))()}
</svelte:element>
