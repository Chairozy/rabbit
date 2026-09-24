<script>
  import { onMount } from 'svelte';
  import * as Blockly from 'scratch-blocks';
  import { defineBlocks, APP_THEME, ensureStartBlock } from '../lib/blockly.js';

  let { onReady, toolbox } = $props();
  let div;
  let ws = null;

  onMount(() => {
    defineBlocks();
    ws = Blockly.inject(div, {
      toolbox,
      theme: APP_THEME,
      scratchTheme: Blockly.ScratchBlocksTheme.CAT_BLOCKS,
      media: 'media/',
      scrollbars: true,
      trashcan: true,
      sounds: true,
      grid: { spacing: 20, length: 2, colour: '#d9d9d9', snap: true },
      zoom: { controls: true, wheel: true, startScale: 0.8, maxScale: 3, minScale: 0.3, scaleSpeed: 1.1 }
    });
    ensureStartBlock(ws);
    const flyout = ws.getFlyout();
    // ContinuousFlyout smooth-scrolls the palette on every category click, so the view keeps gliding
    // after a single click. Jump instantly instead (fraction 1 = full distance in one step).
    if (flyout && 'scrollAnimationFraction' in flyout) {
      Object.assign(flyout, { scrollAnimationFraction: 1 });
    }
    onReady?.(ws);
    return () => ws.dispose();
  });

  $effect(() => {
    if (ws && toolbox) {
      try {
        ws.updateToolbox(toolbox);
        // ScratchContinuousToolbox.refreshSelection is an intentional no-op; forceRerender is the
        // sanctioned path to rebuild the flyout from the new categories (selection kept by name).
        const tb = ws.getToolbox();
        if (tb && typeof tb.forceRerender === 'function') tb.forceRerender();
        else tb?.refreshSelection?.();
      } catch (e) {
        console.warn('[BlocklyWorkspace] updateToolbox failed', e);
      }
    }
  });
</script>

<div bind:this={div} class="blockly-div"></div>

<style>
  .blockly-div {
    flex: 1;
    min-height: 480px;
    border: 1px solid #33453a;
    border-radius: 8px;
    background: #fff;
  }
</style>
