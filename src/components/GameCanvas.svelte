<script>
  import { onMount } from 'svelte';
  import { Engine } from '../lib/engine.js';

  let { onReady, onStatus, onInfo, level } = $props();

  let bg, tiles, blocks, fences, collectables, rabbit, entities, grid;
  let engine = null;

  onMount(async () => {
    engine = new Engine(
      { bg, tiles, blocks, fences, collectables, rabbit, entities, grid },
      { onStatus, onInfo }
    );
    try {
      await engine.init(level);
    } catch {
      onStatus?.('Gagal memuat spritesheet-lite.png');
    }
    onReady?.(engine);
  });
</script>

<div id="game-stack">
  <canvas bind:this={bg} id="layer-bg" width="384" height="448"></canvas>
  <canvas bind:this={tiles} id="layer-tiles" width="384" height="448"></canvas>
  <canvas bind:this={blocks} id="layer-blocks" width="384" height="448"></canvas>
  <canvas bind:this={fences} id="layer-fences" width="384" height="448"></canvas>
  <canvas bind:this={collectables} id="layer-collectables" width="384" height="448"></canvas>
  <canvas bind:this={rabbit} id="layer-rabbit" width="384" height="448"></canvas>
  <canvas bind:this={entities} id="layer-entities" width="384" height="448"></canvas>
  <canvas bind:this={grid} id="layer-grid" width="384" height="448"></canvas>
</div>

<style>
  #game-stack {
    position: relative;
    width: 384px;
    height: 448px;
    border: 2px solid #33453a;
    border-radius: 8px;
    overflow: hidden;
    background: #1c2620;
  }
  #game-stack canvas {
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
  }
</style>
