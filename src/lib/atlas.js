// Atlas mapping untuk spritesheet-lite.png (832x384 = 13x6 tile @64px).
// Semua sprite render origin top-left.
export const TILE = 64;
export const ATLAS_SRC = 'spritesheet-lite.png';

const map = {};

function add(name, cx, cy, wCols, hRows) {
  map[name] = { sx: cx * TILE, sy: cy * TILE, sw: wCols * TILE, sh: hRows * TILE };
}

const rabbitNames = ['down-idle','down-walk-1','down-walk-2','right-idle','right-walk-1','right-walk-2','up-idle','up-walk-1','up-walk-2','left-walk-2','left-walk-1','left-idle'];
rabbitNames.forEach((n, i) => add(n, i, 0, 1, 2));

const colNames = ['pumpkin','wheat','turnip','tomato','corn','cabbage'];
colNames.forEach((n, i) => add(n, 12, i, 1, 1));

const blockRow = ['grass','red-flower','white-flower','blue-flower','sprout','stump','bush','bush-white','bush-blue','bush-red','haybale','crate'];
blockRow.forEach((n, i) => add(n, i, 2, 1, 1));
add('rock', 6, 3, 1, 1);
add('rock-2', 6, 4, 1, 1);
add('sign', 6, 5, 1, 1);

add('fence-h', 7, 3, 1, 1);
add('fence-v', 7, 4, 1, 2);

const tileNames = ['top-left','top-center','top-right','left-center','center','right-center','bottom-left','bottom-center','bottom-right'];
tileNames.forEach((n, i) => {
  const lx = i % 3, ly = Math.floor(i / 3);
  map['dark-' + n] = { sx: (0 + lx) * TILE, sy: (3 + ly) * TILE, sw: TILE, sh: TILE };
  map['light-' + n] = { sx: (3 + lx) * TILE, sy: (3 + ly) * TILE, sw: TILE, sh: TILE };
});

map['light-tree'] = { sx: 8 * TILE, sy: 3 * TILE, sw: 2 * TILE, sh: 3 * TILE };
map['dark-tree'] = { sx: 10 * TILE, sy: 3 * TILE, sw: 2 * TILE, sh: 3 * TILE };

export const ATLAS = {
  SRC: ATLAS_SRC,
  TILE,
  map,
  get(name) { return map[name] ?? null; }
};

export const GAME_CONST = { CELL: 64, GRID: 6, OX: 0, OY: 64, W: 384, H: 448 };
