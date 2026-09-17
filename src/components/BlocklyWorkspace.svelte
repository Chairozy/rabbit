<script>
  import { onMount } from 'svelte';
  import * as Blockly from 'blockly';
  import { defineBlocks, APP_THEME, ensureStartBlock } from '../lib/blockly.js';

  let { onReady, toolbox } = $props();
  let div;
  let ws = null;

  onMount(() => {
    defineBlocks();
    ws = Blockly.inject(div, {
      toolbox,
      theme: APP_THEME,
      scrollbars: true,
      trashcan: true,
      grid: { spacing: 20, length: 2, colour: '#ddd', snap: true }
    });
    ensureStartBlock(ws);
    onReady?.(ws);
    return () => ws.dispose();
  });

  $effect(() => {
    if (ws && toolbox) {
      try {
        ws.updateToolbox(toolbox);
      } catch {}
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
