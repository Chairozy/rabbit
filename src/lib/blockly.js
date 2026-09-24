// Custom blocks (Scratch style via scratch-blocks): start (hat) + walk x4, jump x4, repeat 2-9.
import * as Blockly from 'scratch-blocks';

export const START_TYPE = 'start';

// scratch-blocks leaves these UI strings to the host app, but its own context-menu items call
// .replace() on them; when missing, right-click throws mid-gesture and later mouse moves pan the view.
Object.assign(Blockly.Msg, {
  DELETE_BLOCK: 'Hapus blok',
  DELETE_X_BLOCKS: 'Hapus %1 blok',
  DELETE_ALL_BLOCKS: 'Hapus semua %1 blok?',
  UNDO: 'Urungkan',
  REDO: 'Ulangi',
  CLEAN_UP: 'Rapikan blok',
  COLLAPSE_ALL: 'Ciutkan semua blok',
  EXPAND_ALL: 'Bentangkan semua blok',
  ADD_COMMENT: 'Tambah komentar',
  COLLAPSE_BLOCK: 'Ciutkan blok',
  EXPAND_BLOCK: 'Bentangkan blok'
});

// Scratch ConstantProvider.setTheme () derives a `*_selected` variant from every block style and the workspace
// applies the theme twice during init, calling String(style.colourQuaternary) on the mutated styles. Classic's
// trimmed styles (colourPrimary only) would inject the literal "undefined" and crash colour parsing, so every
// style must carry all four colours.
function completeStyle(style) {
  const primary = style.colourPrimary != null ? String(style.colourPrimary) : '#000';
  const tertiary = style.colourTertiary != null ? String(style.colourTertiary) : primary;
  return {
    colourPrimary: primary,
    colourSecondary: style.colourSecondary != null ? String(style.colourSecondary) : primary,
    colourTertiary: tertiary,
    colourQuaternary: style.colourQuaternary != null ? String(style.colourQuaternary) : tertiary,
    hat: style.hat || ''
  };
}

export const APP_THEME = Blockly.Theme.defineTheme('default-theme', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    start_blocks: completeStyle({
      colourPrimary: '#FFBF00',
      colourSecondary: '#E6AC00',
      colourTertiary: '#CC9900',
      hat: 'cap'
    }),
    hat_blocks: completeStyle({
      colourPrimary: '#FFBF00',
      colourSecondary: '#E6AC00',
      colourTertiary: '#CC9900',
      hat: 'cap'
    }),
    loop_blocks: completeStyle({
      colourPrimary: '#FFAB19',
      colourSecondary: '#EC9C13',
      colourTertiary: '#CF8B17'
    }),
    logic_blocks: completeStyle({
      colourPrimary: '#59C059',
      colourSecondary: '#46B946',
      colourTertiary: '#389438'
    }),
    math_blocks: completeStyle({
      colourPrimary: '#59C059',
      colourSecondary: '#46B946',
      colourTertiary: '#389438'
    }),
    text_blocks: completeStyle({
      colourPrimary: '#59C059',
      colourSecondary: '#46B946',
      colourTertiary: '#389438'
    }),
    colour_blocks: completeStyle({
      colourPrimary: '#CF63CF',
      colourSecondary: '#C94FC9',
      colourTertiary: '#BD42BD'
    }),
    variable_blocks: completeStyle({
      colourPrimary: '#FF8C1A',
      colourSecondary: '#FF8000',
      colourTertiary: '#DB6E00'
    }),
    variable_dynamic_blocks: completeStyle({
      colourPrimary: '#FF8C1A',
      colourSecondary: '#FF8000',
      colourTertiary: '#DB6E00'
    }),
    list_blocks: completeStyle({
      colourPrimary: '#FF8C1A',
      colourSecondary: '#FF8000',
      colourTertiary: '#DB6E00'
    }),
    procedure_blocks: completeStyle({
      colourPrimary: '#FF6680',
      colourSecondary: '#FF4D6A',
      colourTertiary: '#FF3355'
    })
  }
});

for (const [styleName, style] of Object.entries(APP_THEME.blockStyles)) {
  APP_THEME.blockStyles[styleName] = completeStyle(style);
}

export function defineBlocks() {
  if (!Blockly.Blocks[START_TYPE]) {
    Blockly.Blocks[START_TYPE] = {
      init() {
        const ws = this.workspace.options.parentWorkspace ?? this.workspace;
        this.appendDummyInput()
          .appendField('Ketika')
          .appendField(new Blockly.FieldImage(ws.options.pathToMedia + 'green-flag.svg', 24, 24, 'bendera hijau'))
          .appendField('diklik');
        this.setNextStatement(true, null);
        this.setStyle('start_blocks');
        this.setTooltip('Jalankan program saat bendera hijau diklik. Hanya blok di bawahnya yang dijalankan.');
      }
    };
  }
  const walkDefs = [
    ['walk_up', 'Jalan ⬆️ atas', '#4C97FF'],
    ['walk_down', 'Jalan ⬇️ bawah', '#4C97FF'],
    ['walk_left', 'Jalan ⬅️ kiri', '#4C97FF'],
    ['walk_right', 'Jalan ➡️ kanan', '#4C97FF']
  ];
  const jumpDefs = [
    ['jump_up', 'Lompat ⬆️ atas', '#9966FF'],
    ['jump_down', 'Lompat ⬇️ bawah', '#9966FF'],
    ['jump_left', 'Lompat ⬅️ kiri', '#9966FF'],
    ['jump_right', 'Lompat ➡️ kanan', '#9966FF']
  ];
  const moveDefs = [
    ['move_forward', 'Maju ⏩', '#4C97FF'],
    ['move_backward', 'Mundur ⏪', '#4C97FF']
  ];
  const jumpFwdDefs = [['jump_forward', 'Lompat ⏩ depan', '#9966FF']];
  const turnDefs = [
    ['turn_left', 'Belok kiri ↩️', '#4C97FF'],
    ['turn_right', 'Belok kanan ↪️', '#4C97FF']
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
        this.setColour('#FFAB19');
        this.setTooltip('Mengulangi blok di dalamnya 2-9 kali.');
      }
    };
  }
  if (!Blockly.Blocks['walk_to_x']) {
    Blockly.Blocks['walk_to_x'] = {
      init() {
        this.appendDummyInput()
          .appendField('Jalan lurus ke x')
          .appendField(
            new Blockly.FieldDropdown([
              ['1', '1'],
              ['2', '2'],
              ['3', '3'],
              ['4', '4']
            ]),
            'X'
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#4C97FF');
        this.setTooltip('Berjalan lurus horizontal sampai koordinat x tujuan. Terhalang balok, pagar & tembok.');
      }
    };
  }
  if (!Blockly.Blocks['walk_to_y']) {
    Blockly.Blocks['walk_to_y'] = {
      init() {
        this.appendDummyInput()
          .appendField('Jalan lurus ke y')
          .appendField(
            new Blockly.FieldDropdown([
              ['1', '1'],
              ['2', '2'],
              ['3', '3'],
              ['4', '4']
            ]),
            'Y'
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#4C97FF');
        this.setTooltip('Berjalan lurus vertikal sampai koordinat y tujuan. Terhalang balok, pagar & tembok.');
      }
    };
  }
  if (!Blockly.Blocks['jump_dir']) {
    Blockly.Blocks['jump_dir'] = {
      init() {
        this.appendDummyInput()
          .appendField('Lompat')
          .appendField(
            new Blockly.FieldDropdown([
              ['atas', 'up'],
              ['kanan', 'right'],
              ['bawah', 'down'],
              ['kiri', 'left']
            ]),
            'DIR'
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#9966FF');
        this.setTooltip('Meloncat 1 cell ke arah pilihan. Bisa melewati pagar, terhalang balok.');
      }
    };
  }
}

// Toolbox kategori gaya Scratch (continuous toolbox): rail kategori kiri +
// flyout berisi semua blok. Warna kategori mengikuti palet Scratch.
const CAT_MOTION = '#4c97ff'; // biru "Gerak"
const CAT_LOOKS = '#9966ff'; // ungu "Lompat"
const CAT_CONTROL = '#ffab19'; // oranye "Ulangi"

// Setup A (Level 1-20): arah mutlak + repeat.
// Jalan kiri/kanan/atas/bawah, Lompat kiri/kanan/atas/bawah, Ulangi.
export const TOOLBOX_ABSOLUTE = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Gerak',
      colour: CAT_MOTION,
      contents: [
        { kind: 'block', type: 'walk_up' },
        { kind: 'block', type: 'walk_down' },
        { kind: 'block', type: 'walk_left' },
        { kind: 'block', type: 'walk_right' }
      ]
    },
    {
      kind: 'category',
      name: 'Lompat',
      colour: CAT_LOOKS,
      contents: [
        { kind: 'block', type: 'jump_up' },
        { kind: 'block', type: 'jump_down' },
        { kind: 'block', type: 'jump_left' },
        { kind: 'block', type: 'jump_right' }
      ]
    },
    {
      kind: 'category',
      name: 'Ulangi',
      colour: CAT_CONTROL,
      contents: [{ kind: 'block', type: 'repeat_n' }]
    }
  ]
};

// Setup B (Level 21-40): relatif arah hadap + repeat.
// Maju/Mundur, Belok kiri/kanan, Lompat ke depan, Ulangi.
export const TOOLBOX_RELATIVE = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Gerak',
      colour: CAT_MOTION,
      contents: [
        { kind: 'block', type: 'move_forward' },
        { kind: 'block', type: 'move_backward' },
        { kind: 'block', type: 'turn_left' },
        { kind: 'block', type: 'turn_right' }
      ]
    },
    {
      kind: 'category',
      name: 'Lompat',
      colour: CAT_LOOKS,
      contents: [{ kind: 'block', type: 'jump_forward' }]
    },
    {
      kind: 'category',
      name: 'Ulangi',
      colour: CAT_CONTROL,
      contents: [{ kind: 'block', type: 'repeat_n' }]
    }
  ]
};

export const TOOLBOX_COORDINATE = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Gerak',
      colour: CAT_MOTION,
      contents: [
        { kind: 'block', type: 'walk_to_x' },
        { kind: 'block', type: 'walk_to_y' },
        { kind: 'block', type: 'jump_dir' }
      ]
    },
    {
      kind: 'category',
      name: 'Ulangi',
      colour: CAT_CONTROL,
      contents: [{ kind: 'block', type: 'repeat_n' }]
    }
  ]
};

export function toolboxFor(mode) {
  if (mode === 'relative') return TOOLBOX_RELATIVE;
  if (mode === 'coordinate') return TOOLBOX_COORDINATE;
  return TOOLBOX_ABSOLUTE;
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
    } else if (cur.type === 'walk_to_x') {
      out.push({ op: 'walkToX', x: parseInt(cur.getFieldValue('X') || '1', 10), blockId: cur.id });
    } else if (cur.type === 'walk_to_y') {
      out.push({ op: 'walkToY', y: parseInt(cur.getFieldValue('Y') || '1', 10), blockId: cur.id });
    } else if (cur.type === 'jump_dir') {
      out.push({ op: 'jump', dir: cur.getFieldValue('DIR') || 'up', blockId: cur.id });
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
