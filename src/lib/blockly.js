// Custom Blockly blocks: start (hat) + walk x4, jump x4, repeat 2-9.
import * as Blockly from 'blockly';

export const START_TYPE = 'start';

// Theme dengan topi (hat) khusus untuk blok Mulai saja.
// Blok lain yang terlepas TIDAK dapat topi, supaya jelas bukan entry point.
export const APP_THEME = Blockly.Theme.defineTheme('rabbitTheme', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    start_blocks: {
      colourPrimary: '#2e9e44',
      colourSecondary: '#2e9e44',
      colourTertiary: '#1f6f2f',
      hat: 'cap'
    }
  }
});

export function defineBlocks() {
  if (!Blockly.Blocks[START_TYPE]) {
    Blockly.Blocks[START_TYPE] = {
      init() {
        this.appendDummyInput().appendField('Mulai ▶');
        this.setNextStatement(true, null);
        this.setStyle('start_blocks');
        this.setTooltip('Titik mulai program. Hanya blok di bawah Mulai yang dijalankan.');
      }
    };
  }
  const walkDefs = [
    ['walk_up', 'Jalan ⬆️ atas', 160],
    ['walk_down', 'Jalan ⬇️ bawah', 160],
    ['walk_left', 'Jalan ⬅️ kiri', 160],
    ['walk_right', 'Jalan ➡️ kanan', 160]
  ];
  const jumpDefs = [
    ['jump_up', 'Lompat ⬆️ atas', 20],
    ['jump_down', 'Lompat ⬇️ bawah', 20],
    ['jump_left', 'Lompat ⬅️ kiri', 20],
    ['jump_right', 'Lompat ➡️ kanan', 20]
  ];
  const moveDefs = [
    ['move_forward', 'Maju ⏩', 120],
    ['move_backward', 'Mundur ⏪', 120]
  ];
  const jumpFwdDefs = [['jump_forward', 'Lompat ⏩ depan', 20]];
  const turnDefs = [
    ['turn_left', 'Belok kiri ↩️', 210],
    ['turn_right', 'Belok kanan ↪️', 210]
  ];
  for (const [type, label, colour] of [...walkDefs, ...jumpDefs, ...moveDefs, ...jumpFwdDefs, ...turnDefs]) {
    if (Blockly.Blocks[type]) continue;
    const isJump = type.startsWith('jump_');
    const isMove = type.startsWith('move_');
    const isTurn = type.startsWith('turn_');
    Blockly.Blocks[type] = {
      init() {
        this.appendDummyInput().appendField(label);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(colour);
        this.setTooltip(
          isJump
            ? 'Meloncati pagar (fence). Terhalang balok.'
            : isMove
              ? 'Bergerak 1 cell mengikuti arah hadap kelinci. Terhalang balok & pagar.'
              : isTurn
                ? 'Memutar arah hadap kelinci tanpa bergerak.'
                : 'Berjalan 1 cell. Terhalang balok & pagar.'
        );
      }
    };
  }
  if (!Blockly.Blocks['repeat_n']) {
    Blockly.Blocks['repeat_n'] = {
      init() {
        this.appendDummyInput()
          .appendField('Ulangi')
          .appendField(
            new Blockly.FieldDropdown([
              ['2', '2'],
              ['3', '3'],
              ['4', '4'],
              ['5', '5'],
              ['6', '6'],
              ['7', '7'],
              ['8', '8'],
              ['9', '9']
            ]),
            'TIMES'
          )
          .appendField('kali');
        this.appendStatementInput('DO').setCheck(null).appendField('lakukan');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip('Mengulangi blok di dalamnya 2-9 kali.');
      }
    };
  }
}

export const TOOLBOX = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'move_forward' },
    { kind: 'block', type: 'move_backward' },
    { kind: 'block', type: 'turn_left' },
    { kind: 'block', type: 'turn_right' },
    { kind: 'block', type: 'walk_up' },
    { kind: 'block', type: 'walk_down' },
    { kind: 'block', type: 'walk_left' },
    { kind: 'block', type: 'walk_right' },
    { kind: 'block', type: 'jump_up' },
    { kind: 'block', type: 'jump_down' },
    { kind: 'block', type: 'jump_left' },
    { kind: 'block', type: 'jump_right' },
    { kind: 'block', type: 'jump_forward' },
    { kind: 'block', type: 'repeat_n' }
  ]
};

// Setup A (Level 1-20): arah mutlak + repeat.
// Jalan kiri/kanan/atas/bawah, Lompat kiri/kanan/atas/bawah, Ulangi.
export const TOOLBOX_ABSOLUTE = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'walk_up' },
    { kind: 'block', type: 'walk_down' },
    { kind: 'block', type: 'walk_left' },
    { kind: 'block', type: 'walk_right' },
    { kind: 'block', type: 'jump_up' },
    { kind: 'block', type: 'jump_down' },
    { kind: 'block', type: 'jump_left' },
    { kind: 'block', type: 'jump_right' },
    { kind: 'block', type: 'repeat_n' }
  ]
};

// Setup B (Level 21-40): relatif arah hadap + repeat.
// Maju/Mundur, Belok kiri/kanan, Lompat ke depan, Ulangi.
export const TOOLBOX_RELATIVE = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: 'move_forward' },
    { kind: 'block', type: 'move_backward' },
    { kind: 'block', type: 'turn_left' },
    { kind: 'block', type: 'turn_right' },
    { kind: 'block', type: 'jump_forward' },
    { kind: 'block', type: 'repeat_n' }
  ]
};

export function toolboxFor(mode) {
  return mode === 'relative' ? TOOLBOX_RELATIVE : TOOLBOX_ABSOLUTE;
}

const dirOf = (type) => /_(up|down|left|right)$/.exec(type)?.[1] ?? null;

function collectInto(start, out) {
  let cur = start;
  while (cur) {
    if (cur.type === START_TYPE) {
      cur = cur.getNextBlock();
      continue;
    }
    if (cur.type === 'repeat_n') {
      const t = parseInt(cur.getFieldValue('TIMES') || '2', 10);
      const sub = [];
      collectInto(cur.getInputTargetBlock('DO'), sub);
      out.push({ op: 'repeat', times: t, body: sub, blockId: cur.id });
    } else if (cur.type.startsWith('walk_')) {
      out.push({ op: 'walk', dir: dirOf(cur.type), blockId: cur.id });
    } else if (cur.type === 'jump_forward') {
      out.push({ op: 'jumpForward', blockId: cur.id });
    } else if (cur.type.startsWith('jump_')) {
      out.push({ op: 'jump', dir: dirOf(cur.type), blockId: cur.id });
    } else if (cur.type.startsWith('move_')) {
      out.push({ op: 'move', dir: cur.type === 'move_forward' ? 'forward' : 'backward', blockId: cur.id });
    } else if (cur.type.startsWith('turn_')) {
      out.push({ op: 'turn', dir: cur.type === 'turn_left' ? 'left' : 'right', blockId: cur.id });
    }
    cur = cur.getNextBlock();
  }
}

// Hanya rantai di bawah blok Mulai yang menjadi program.
// Blok yatim (tidak tersambung ke Mulai) sengaja diabaikan.
export function getStartBlocks(ws) {
  return ws.getTopBlocks(true).filter((b) => b.type === START_TYPE);
}

export function ensureStartBlock(ws) {
  const existing = ws.getAllBlocks(false).find((b) => b.type === START_TYPE);
  if (existing) return existing;
  const b = ws.newBlock(START_TYPE);
  b.initSvg();
  b.render();
  b.moveBy(24, 24);
  b.setDeletable(false);
  return b;
}

export function buildProgram(ws) {
  const ops = [];
  const starts = getStartBlocks(ws).sort((a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y);
  for (const top of starts) {
    collectInto(top.getNextBlock(), ops);
  }
  return ops;
}

// Nested repeat menjadi flat [{op, dir, blockId}], maks 200 langkah
export function flattenProgram(prog) {
  const flat = [];
  let guard = 0;
  function expand(list) {
    for (const it of list) {
      if (it.op === 'repeat') {
        for (let i = 0; i < it.times; i++) expand(it.body);
      } else {
        flat.push(it);
      }
      if (++guard > 2000) throw new Error('Program terlalu besar');
    }
  }
  expand(prog);
  return flat.slice(0, 200);
}
