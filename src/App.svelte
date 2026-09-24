<script>
  import confetti from 'canvas-confetti';
  import BlocklyWorkspace from './components/BlocklyWorkspace.svelte';
  import GameCanvas from './components/GameCanvas.svelte';
  import { buildProgram, flattenProgram, getStartBlocks, toolboxFor, ensureStartBlock } from './lib/blockly.js';
  import { LEVELS } from './lib/levels.js';

  const storedLevel = Number(localStorage.getItem('rabbit-level') || 1);
  const storedDone = JSON.parse(localStorage.getItem('rabbit-done') || '[]');

  let workspace = $state(null);
  let engine = $state(null);
  let status = $state('Siap. Kumpulkan semua collectables!');
  let levelInfo = $state('');
  let speed = $state(1);
  let running = $state(false);
  let cancelled = false;
  let levelId = $state(LEVELS.some((l) => l.id === storedLevel) ? storedLevel : 1);
  let doneIds = $state(Array.isArray(storedDone) ? storedDone : []);

  let currentLevel = $derived(LEVELS.find((l) => l.id === levelId) ?? LEVELS[0]);
  let toolbox = $derived(toolboxFor(currentLevel.mode));
  let modeLabel = $derived(
    currentLevel.mode === 'relative'
      ? 'Setup B • Relatif'
      : currentLevel.mode === 'sokoban'
        ? 'Setup C • Sokoban'
        : currentLevel.mode === 'coordinate'
          ? 'Setup D • Koordinat'
          : 'Setup A • Mutlak'
  );
  let progress = $derived(`${doneIds.length}/${LEVELS.length}`);
  let isLast = $derived(levelId >= LEVELS.length);
  let isFirst = $derived(levelId <= 1);

  $effect(() => {
    localStorage.setItem('rabbit-level', String(levelId));
  });
  $effect(() => {
    localStorage.setItem('rabbit-done', JSON.stringify(doneIds));
  });

  function markDone(id) {
    if (!doneIds.includes(id)) doneIds = [...doneIds, id];
  }

  function selectLevel(id, clearBlocks = true) {
    const lv = LEVELS.find((l) => l.id === Number(id)) ?? LEVELS[0];
    levelId = lv.id;
    cancelled = true;
    running = false;
    try {
      workspace?.highlightBlock(null);
    } catch {}
    if (clearBlocks && workspace) {
      try {
        workspace.clear();
        ensureStartBlock(workspace);
      } catch {}
    }
    engine?.reset(lv);
    status = `Level ${lv.id}: ${lv.title}. Kumpulkan semua collectables!`;
  }

  let alertClass = $derived(
    status.startsWith('Berhasil')
      ? 'alert-success'
      : status.startsWith('Menabrak')
        ? 'alert-error'
        : status === 'Dihentikan.'
          ? 'alert-warning'
          : 'alert-info'
  );

  function setSpeed(m) {
    speed = m;
    engine?.setSpeed(m);
  }

  function handleReset() {
    cancelled = true;
    running = false;
    workspace?.highlightBlock(null);
    engine?.reset(currentLevel);
    status = 'Siap. Kumpulkan semua collectables!';
  }

  function handleStop() {
    cancelled = true;
    status = 'Dihentikan.';
  }

  function celebrate() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 60, origin: { x: 0 } }), 200);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 60, origin: { x: 1 } }), 350);
  }

  async function handleRun() {
    if (running || !workspace || !engine) return;
    cancelled = false;
    running = true;
    engine.reset(currentLevel);
    if (!getStartBlocks(workspace).length) {
      status = 'Tambahkan blok bendera hijau — kode di luar blok itu tidak dijalankan.';
      running = false;
      return;
    }
    let prog;
    try {
      prog = flattenProgram(buildProgram(workspace));
    } catch {
      status = 'Program terlalu besar (maks 200 langkah).';
      running = false;
      return;
    }
    if (!prog.length) {
      status = 'Tempelkan blok di bawah bendera hijau dulu — kode di luar blok itu tidak dijalankan.';
      running = false;
      return;
    }
    status = `Berjalan... (${prog.length} langkah)`;
    for (const st of prog) {
      if (cancelled) break;
      try {
        workspace.highlightBlock(st.blockId);
      } catch {}
      const res =
        st.op === 'walk'
          ? await engine.stepWalk(st.dir)
          : st.op === 'jump'
            ? await engine.stepJump(st.dir)
            : st.op === 'jumpForward'
              ? await engine.stepJumpForward()
              : st.op === 'move'
                ? await engine.stepMove(st.dir)
                : st.op === 'walkToX'
                  ? await engine.stepWalkToX(st.x)
                  : st.op === 'walkToY'
                    ? await engine.stepWalkToY(st.y)
                    : await engine.stepTurn(st.dir);
      if (res?.bumped) {
        const why = res.reason === 'block' ? 'balok' : res.reason === 'fence' ? 'pagar' : 'tembok';
        status = `Menabrak ${why}! Kode berhenti, kelinci kembali ke cell.`;
        break;
      }
      if (res?.pickup === 'win') {
        markDone(currentLevel.id);
        celebrate();
        break;
      }
      if (cancelled) break;
      await new Promise((r) => setTimeout(r, 60 / speed));
    }
    try {
      workspace.highlightBlock(null);
    } catch {}
    running = false;
    if (!cancelled && engine.state.collectedCount < engine.state.total && !status.startsWith('Menabrak')) {
      status = `Selesai. Terkumpul ${engine.state.collectedCount}/${engine.state.total} - coba lagi!`;
    }
  }
</script>

<div class="navbar bg-base-200 min-h-0 py-2 px-4 gap-3 flex-wrap">
  <h1 class="text-xl font-bold">🐇 Rabbit Blockly</h1>
  <div class="flex gap-2 items-center flex-wrap">
    <button class="btn btn-sm btn-outline" onclick={() => selectLevel(levelId - 1)} disabled={isFirst || running}>←</button>
    <select class="select select-sm select-bordered w-[220px]" value={levelId} onchange={(e) => selectLevel(Number(e.currentTarget.value))} disabled={running}>
      {#each LEVELS as lv}
        <option value={lv.id}>
          {lv.id}. {lv.title} {doneIds.includes(lv.id) ? '✅' : ''}
        </option>
      {/each}
    </select>
    <button class="btn btn-sm btn-outline" onclick={() => selectLevel(levelId + 1)} disabled={isLast || running}>→</button>
    <span class="badge {currentLevel.mode === 'relative' ? 'badge-secondary' : 'badge-primary'}">{modeLabel}</span>
    <span class="badge badge-ghost">{currentLevel.difficulty}</span>
    <span class="badge badge-outline">Selesai {progress}</span>
  </div>
</div>

<main class="flex gap-3 p-3" style="height: calc(100vh - 53px)">
  <section class="flex-[1.2] flex flex-col min-w-0">
    <BlocklyWorkspace toolbox={toolbox} onReady={(ws) => (workspace = ws)} />
    <p class="text-xs opacity-60 mt-1">
      {#if currentLevel.mode === 'relative'}
        Setup B: Maju/Mundur/Belok/Lompat depan (relatif arah hadap) + Ulangi 2-9. Susun di bawah blok bendera hijau.
      {:else if currentLevel.mode === 'sokoban'}
        Setup C: Dorong crate/haybale ke bayangannya (bisa bertumpuk, tak bisa menembus pagar). Susun di bawah blok bendera hijau.
      {:else if currentLevel.mode === 'coordinate'}
        Setup D: Jalan lurus ke x/y + Lompat arah + Ulangi. Susun di bawah blok bendera hijau.
      {:else}
        Setup A: Jalan/Lompat atas-bawah-kiri-kanan (arah mutlak) + Ulangi 2-9. Susun di bawah blok bendera hijau.
      {/if}
    </p>
  </section>

  <section class="flex flex-col items-center gap-2 w-[430px] shrink-0 overflow-y-auto">
    <div class="flex gap-2 items-center flex-wrap justify-center">
      <button class="btn btn-sm" onclick={handleRun} disabled={running || !workspace || !engine} title="Jalankan">
        <img src="media/green-flag.svg" alt="Jalankan" class="w-6 h-6" />
      </button>
      <button class="btn btn-sm" onclick={handleStop} title="Berhenti">
        <svg viewBox="0 0 24 24" class="w-6 h-6" role="img" aria-label="Berhenti"><polygon points="8,3 16,3 21,8 21,16 16,21 8,21 3,16 3,8" fill="#FF0000" /></svg>
      </button>
      <button class="btn btn-sm btn-outline" onclick={handleReset}>↺ Reset</button>
      <div class="join">
        <button class="join-item btn btn-sm" class:btn-active={speed === 1} onclick={() => setSpeed(1)}>x1</button>
        <button class="join-item btn btn-sm" class:btn-active={speed === 2} onclick={() => setSpeed(2)}>x2</button>
        <button class="join-item btn btn-sm" class:btn-active={speed === 3} onclick={() => setSpeed(3)}>x3</button>
      </div>
    </div>

    <div role="alert" class="alert {alertClass} w-[384px] py-2 text-sm">
      <span>{status}</span>
    </div>

    <GameCanvas
      level={currentLevel}
      onReady={(e) => {
        engine = e;
        engine.reset(currentLevel);
      }}
      onStatus={(t) => (status = t)}
      onInfo={(t) => (levelInfo = t)}
    />

    <div class="badge badge-ghost">{levelInfo}</div>

    <div class="card bg-base-200 w-[384px] shadow-sm">
      <div class="card-body p-3 gap-1">
        <h2 class="font-bold text-sm">Level {currentLevel.id}: {currentLevel.title}</h2>
        <p class="text-sm">💡 {currentLevel.hint}</p>
        <p class="text-xs opacity-70">Target (par): {currentLevel.par} blok/langkah inti • Hadap awal: {currentLevel.rabbit.dir}</p>
        {#if !isLast}
          {#if doneIds.includes(levelId)}
            <button class="btn btn-sm btn-success mt-1" onclick={() => selectLevel(levelId + 1)} disabled={running}>
              Level berikutnya →
            </button>
          {:else}
            <p class="text-xs opacity-60 mt-1">🔒 Selesaikan level ini untuk membuka level berikutnya.</p>
          {/if}
        {:else}
          <p class="text-xs font-bold mt-1">🎉 Level terakhir — tamatkan semua {LEVELS.length} level!</p>
        {/if}
      </div>
    </div>

  </section>
</main>
