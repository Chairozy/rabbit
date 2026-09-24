// Engine: logical layer per object + Y-sorted compositor.
// Ground (bg, tiles, grid) tetap di bawah/atas; semua sprite (blocks,
// fences, collectables, rabbit) digambar berurutan berdasarkan Y kaki
// ke dalam canvas entities.
import { ATLAS, GAME_CONST } from './atlas.js';

const { CELL, GRID, OX, OY } = GAME_CONST;
const DIRS = {
  up: { dc: 0, dr: -1 },
  down: { dc: 0, dr: 1 },
  left: { dc: -1, dr: 0 },
  right: { dc: 1, dr: 0 }
};
const LEFT_OF = { up: 'left', left: 'down', down: 'right', right: 'up' };
const RIGHT_OF = { up: 'right', right: 'down', down: 'left', left: 'up' };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
const LAYER_IDS = ['bg', 'tiles', 'blocks', 'fences', 'collectables', 'rabbit', 'entities', 'grid'];
const ISLAND = { c0: 1, r0: 1, c1: 4, r1: 4 };

function insideIsland(c, r) {
  return c >= ISLAND.c0 && c <= ISLAND.c1 && r >= ISLAND.r0 && r <= ISLAND.r1;
}

function cellToPx(c, r) {
  return { x: OX + c * CELL, y: OY + r * CELL };
}
function key(c, r) {
  return c + ',' + r;
}
function rabbitSprite(dir, phase) {
  return dir + '-' + phase;
}

export class Engine {
  constructor(canvases, hooks = {}) {
    this.ctxs = {};
    for (const id of LAYER_IDS) {
      const ctx = canvases[id].getContext('2d');
      ctx.imageSmoothingEnabled = false;
      this.ctxs[id] = ctx;
    }
    this.hooks = hooks;
    this.img = new Image();
    this.ready = new Promise((res, rej) => {
      this.img.onload = res;
      this.img.onerror = rej;
    });
    this.img.src = ATLAS.SRC;
    this.state = {
      rabbit: { c: 2, r: 2, dir: 'down' },
      collectables: [],
      blocks: [],
      blockSet: new Set(),
      fenceList: [],
      pushables: [],
      pushSet: new Set(),
      targets: [],
      collectedCount: 0,
      total: 0,
      speed: 1
    };
  }

  async init(level) {
    this.reset(level);
    await this.ready;
    this.drawAll();
  }

  setStatus(t) {
    this.hooks.onStatus?.(t);
  }

  setInfo() {
    const progress = this.state.targets.length
      ? `Target ${this.state.collectedCount}/${this.state.targets.length}`
      : `Terkumpul ${this.state.collectedCount}/${this.state.total}`;
    this.hooks.onInfo?.(
      `Kelinci (${this.state.rabbit.c},${this.state.rabbit.r}) • ${progress}`
    );
  }

  clear(id) {
    this.ctxs[id].clearRect(0, 0, GAME_CONST.W, GAME_CONST.H);
  }

  blit(ctx, name, dx, dy, dw, dh, alpha) {
    const s = ATLAS.get(name);
    if (!s) return;
    ctx.save();
    if (alpha !== undefined) ctx.globalAlpha = alpha;
    if (dw !== undefined && dh !== undefined) ctx.drawImage(this.img, s.sx, s.sy, s.sw, s.sh, dx, dy, dw, dh);
    else ctx.drawImage(this.img, s.sx, s.sy, s.sw, s.sh, dx, dy, s.sw, s.sh);
    ctx.restore();
  }

  drawBg() {
    const ctx = this.ctxs.bg;
    this.clear('bg');
    ctx.fillStyle = '#1c2620';
    ctx.fillRect(0, 0, GAME_CONST.W, GAME_CONST.H);
    ctx.fillStyle = '#2b3a30';
    ctx.fillRect(OX, OY, GRID * CELL, GRID * CELL);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let r = 0; r < GRID; r++)
      for (let c = 0; c < GRID; c++) {
        if ((c + r) % 2 === 0) ctx.fillRect(OX + c * CELL, OY + r * CELL, CELL, CELL);
      }
  }

  islandVariant(ic, ir) {
    if (ic === 0 && ir === 0) return 'top-left';
    if (ir === 0 && (ic === 1 || ic === 2)) return 'top-center';
    if (ic === 3 && ir === 0) return 'top-right';
    if (ic === 0 && (ir === 1 || ir === 2)) return 'left-center';
    if (ic === 3 && (ir === 1 || ir === 2)) return 'right-center';
    if (ic === 0 && ir === 3) return 'bottom-left';
    if (ir === 3 && (ic === 1 || ic === 2)) return 'bottom-center';
    if (ic === 3 && ir === 3) return 'bottom-right';
    return 'center';
  }

  drawTiles() {
    const ctx = this.ctxs.tiles;
    this.clear('tiles');
    for (let ir = 0; ir < 4; ir++)
      for (let ic = 0; ic < 4; ic++) {
        const c = 1 + ic, r = 1 + ir;
        const set = (ic + ir) % 2 === 0 ? 'dark' : 'light';
        const p = cellToPx(c, r);
        this.blit(ctx, set + '-' + this.islandVariant(ic, ir), p.x, p.y);
      }
  }

  fenceDrawPos(f) {
    if (f.side === 'N') return { x: OX + f.c * CELL, y: OY + f.r * CELL - 32, name: 'fence-h' };
    if (f.side === 'S') return { x: OX + f.c * CELL, y: OY + (f.r + 1) * CELL - 32, name: 'fence-h' };
    if (f.side === 'W') return { x: OX + f.c * CELL - 32, y: OY + f.r * CELL - 64, name: 'fence-v' };
    return { x: OX + (f.c + 1) * CELL - 32, y: OY + f.r * CELL - 64, name: 'fence-v' };
  }

  clearLegacyEntityLayers() {
    this.clear('blocks');
    this.clear('fences');
    this.clear('collectables');
    this.clear('rabbit');
  }

  buildEntities(rabbitOverride, pushableOverride) {
    const list = [];
    for (const b of this.state.blocks) {
      const p = cellToPx(b.c, b.r);
      list.push({ depth: p.y + CELL, order: 0, name: b.type, x: p.x, y: p.y });
    }
    for (const f of this.state.fenceList) {
      const d = this.fenceDrawPos(f);
      const s = ATLAS.get(d.name);
      list.push({ depth: d.y + (s ? s.sh : CELL), order: 1, name: d.name, x: d.x, y: d.y });
    }
    for (const it of this.state.collectables) {
      if (it.collected) continue;
      const p = cellToPx(it.c, it.r);
      list.push({
        depth: p.y + CELL,
        order: 2,
        name: it.type,
        x: p.x,
        y: p.y + (it.hop || 0),
        w: CELL,
        h: CELL,
        alpha: it.fade !== undefined ? it.fade : 1
      });
    }
    for (const t of this.state.targets) {
      const p = cellToPx(t.c, t.r);
      list.push({ depth: p.y + CELL, order: -1, name: t.type, x: p.x, y: p.y, w: CELL, h: CELL, alpha: 0.35 });
    }
    for (const pb of this.state.pushables) {
      const p = cellToPx(pb.c, pb.r);
      const o = pushableOverride?.get(pb);
      list.push({ depth: p.y + CELL, order: 0, name: pb.type, x: o ? o.x : p.x, y: o ? o.y : p.y });
    }
    let r = rabbitOverride;
    if (!r) {
      const p = cellToPx(this.state.rabbit.c, this.state.rabbit.r);
      r = { gx: p.x, gy: p.y, arc: 0, sprite: rabbitSprite(this.state.rabbit.dir, 'idle') };
    }
    list.push({
      depth: r.gy + CELL,
      order: 3,
      name: r.sprite,
      x: r.gx,
      y: r.gy + (r.arc || 0) + CELL - 128,
      rot: r.rot || 0,
      px: r.gx + CELL / 2,
      py: r.gy + (r.arc || 0) + CELL
    });
    list.sort((a, b) => a.depth - b.depth || a.order - b.order);
    return list;
  }

  drawEntities(rabbitOverride, pushableOverride) {
    const ctx = this.ctxs.entities;
    this.clear('entities');
    this.clearLegacyEntityLayers();
    for (const e of this.buildEntities(rabbitOverride, pushableOverride)) {
      if (e.rot) {
        const s = ATLAS.get(e.name);
        if (!s) continue;
        ctx.save();
        ctx.translate(e.px, e.py);
        ctx.rotate(e.rot);
        ctx.drawImage(this.img, s.sx, s.sy, s.sw, s.sh, e.x - e.px, e.y - e.py, s.sw, s.sh);
        ctx.restore();
      } else if (e.w !== undefined) this.blit(ctx, e.name, e.x, e.y, e.w, e.h, e.alpha);
      else if (e.alpha !== undefined) this.blit(ctx, e.name, e.x, e.y, undefined, undefined, e.alpha);
      else this.blit(ctx, e.name, e.x, e.y);
    }
  }

  drawBlocks() {
    this.drawEntities();
  }
  drawFences() {
    this.drawEntities();
  }
  drawCollectables() {
    this.drawEntities();
  }

  drawRabbitAt(px, py, spriteName) {
    this.drawEntities({ gx: px, gy: py, arc: 0, sprite: spriteName });
  }

  drawRabbitIdle() {
    const p = cellToPx(this.state.rabbit.c, this.state.rabbit.r);
    this.drawEntities({ gx: p.x, gy: p.y, arc: 0, sprite: rabbitSprite(this.state.rabbit.dir, 'idle') });
  }

  drawGrid() {
    const ctx = this.ctxs.grid;
    this.clear('grid');
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(OX + i * CELL + 0.5, OY);
      ctx.lineTo(OX + i * CELL + 0.5, OY + GRID * CELL);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(OX, OY + i * CELL + 0.5);
      ctx.lineTo(OX + GRID * CELL, OY + i * CELL + 0.5);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,235,150,0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(OX + CELL, OY + CELL, 4 * CELL, 4 * CELL);
  }

  drawAll() {
    this.drawBg();
    this.drawTiles();
    this.drawEntities();
    this.drawGrid();
    this.setInfo();
  }

  reset(level) {
    const lv = JSON.parse(JSON.stringify(level));
    this.state.rabbit = { c: lv.rabbit.c, r: lv.rabbit.r, dir: lv.rabbit.dir || 'down' };
    this.state.collectables = (lv.collectables || []).map((o) => ({
      c: o.c,
      r: o.r,
      type: o.type,
      collected: false,
      fade: 1,
      hop: 0
    }));
    this.state.blocks = lv.blocks || [];
    this.state.fenceList = lv.fences || [];
    this.state.blockSet = new Set(this.state.blocks.map((b) => key(b.c, b.r)));
    this.state.pushables = (lv.pushables || []).map((o) => ({ c: o.c, r: o.r, type: o.type }));
    this.state.pushSet = new Set(this.state.pushables.map((b) => key(b.c, b.r)));
    this.state.targets = (lv.targets || []).map((o) => ({ c: o.c, r: o.r, type: o.type }));
    this.state.collectedCount = 0;
    this.state.total = this.state.collectables.length;
    if (this.state.targets.length) {
      this.state.total = this.state.targets.length;
      this.state.collectedCount = this.sokobanFilled();
    }
    if (this.img.complete) this.drawAll();
    this.setInfo();
  }

  setSpeed(m) {
    this.state.speed = m;
  }

  dur(base) {
    return base / (this.state.speed || 1);
  }

  inBounds(c, r) {
    return c >= 0 && c < GRID && r >= 0 && r < GRID;
  }
  hasBlock(c, r) {
    return this.state.blockSet.has(key(c, r));
  }
  hasFenceBetween(c1, r1, c2, r2) {
    const dc = c2 - c1, dr = r2 - r1;
    for (const f of this.state.fenceList) {
      if (dc === 1 && dr === 0) {
        if ((f.c === c1 && f.r === r1 && f.side === 'E') || (f.c === c2 && f.r === r2 && f.side === 'W')) return true;
      } else if (dc === -1 && dr === 0) {
        if ((f.c === c1 && f.r === r1 && f.side === 'W') || (f.c === c2 && f.r === r2 && f.side === 'E')) return true;
      } else if (dc === 0 && dr === -1) {
        if ((f.c === c1 && f.r === r1 && f.side === 'N') || (f.c === c2 && f.r === r2 && f.side === 'S')) return true;
      } else if (dc === 0 && dr === 1) {
        if ((f.c === c1 && f.r === r1 && f.side === 'S') || (f.c === c2 && f.r === r2 && f.side === 'N')) return true;
      }
    }
    return false;
  }

  // Dinding tak terlihat: garis di sekeliling border island 4x4.
  // Menahan perpindahan yang melintasi batas (dalam <-> luar), baik walk maupun jump.
  hasWallBetween(c1, r1, c2, r2) {
    return insideIsland(c1, r1) !== insideIsland(c2, r2);
  }

  hasPushable(c, r) {
    return this.state.pushSet.has(key(c, r));
  }
  pushableAt(c, r) {
    return this.state.pushables.find((p) => p.c === c && p.r === r) ?? null;
  }
  // Dorong rantai pushable bertumpuk ke arah dir; tiap sambungan (termasuk pagar) harus bebas.
  tryPush(c, r, dir) {
    const d = DIRS[dir];
    const chain = [];
    let cc = c + d.dc, rr = r + d.dr;
    while (this.hasPushable(cc, rr)) {
      if (this.hasFenceBetween(cc - d.dc, rr - d.dr, cc, rr)) return { ok: false, reason: 'fence' };
      chain.push({ c: cc, r: rr });
      cc += d.dc;
      rr += d.dr;
      if (chain.length > GRID * GRID) return { ok: false, reason: 'block' };
    }
    if (!chain.length) return { ok: false, reason: 'block' };
    const last = chain[chain.length - 1];
    if (!this.inBounds(cc, rr)) return { ok: false, reason: 'out' };
    if (this.hasFenceBetween(last.c, last.r, cc, rr)) return { ok: false, reason: 'fence' };
    if (this.hasWallBetween(last.c, last.r, cc, rr)) return { ok: false, reason: 'wall' };
    if (this.hasBlock(cc, rr)) return { ok: false, reason: 'block' };
    return { ok: true, chain };
  }
  applyPush(chain, dir) {
    const d = DIRS[dir];
    for (let i = chain.length - 1; i >= 0; i--) {
      const pb = this.pushableAt(chain[i].c, chain[i].r);
      this.state.pushSet.delete(key(pb.c, pb.r));
      pb.c += d.dc;
      pb.r += d.dr;
      this.state.pushSet.add(key(pb.c, pb.r));
    }
  }
  sokobanFilled() {
    let n = 0;
    for (const t of this.state.targets) {
      const pb = this.pushableAt(t.c, t.r);
      if (pb && pb.type === t.type) n++;
    }
    return n;
  }
  checkSokobanWin() {
    if (!this.state.targets.length) return null;
    this.state.collectedCount = this.sokobanFilled();
    this.setInfo();
    if (this.state.collectedCount >= this.state.targets.length) {
      this.setStatus('Berhasil! Semua target terisi 🎉');
      return 'win';
    }
    return null;
  }
  async afterStep() {
    const res = await this.checkPickup();
    if (res === 'win') return res;
    return this.checkSokobanWin();
  }

  canWalk(c, r, dir) {
    const d = DIRS[dir];
    const nc = c + d.dc, nr = r + d.dr;
    if (!this.inBounds(nc, nr)) return { ok: false, reason: 'out' };
    if (this.hasBlock(nc, nr)) return { ok: false, reason: 'block' };
    if (this.hasFenceBetween(c, r, nc, nr)) return { ok: false, reason: 'fence' };
    if (this.hasWallBetween(c, r, nc, nr)) return { ok: false, reason: 'wall' };
    return { ok: true, nc, nr };
  }
  canJump(c, r, dir) {
    const d = DIRS[dir];
    const nc = c + d.dc, nr = r + d.dr;
    if (!this.inBounds(nc, nr)) return { ok: false, reason: 'out' };
    if (this.hasBlock(nc, nr)) return { ok: false, reason: 'block' };
    if (this.hasPushable(nc, nr)) return { ok: false, reason: 'block' };
    if (this.hasWallBetween(c, r, nc, nr)) return { ok: false, reason: 'wall' };
    return { ok: true, nc, nr };
  }

  animateWalk(dir, faceDir) {
    const from = cellToPx(this.state.rabbit.c, this.state.rabbit.r);
    const d = DIRS[dir];
    const to = cellToPx(this.state.rabbit.c + d.dc, this.state.rabbit.r + d.dr);
    const face = faceDir || dir;
    const frames = [
      rabbitSprite(face, 'walk-1'),
      rabbitSprite(face, 'idle'),
      rabbitSprite(face, 'walk-2'),
      rabbitSprite(face, 'idle')
    ];
    const total = this.dur(580);
    const t0 = performance.now();
    return new Promise((resolve) => {
      const frame = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / total));
        const x = from.x + (to.x - from.x) * k;
        const y = from.y + (to.y - from.y) * k;
        const fi = Math.min(frames.length - 1, Math.floor(k * frames.length));
        this.drawEntities({ gx: x, gy: y, arc: 0, sprite: frames[fi] });
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  animatePush(dir, faceDir, moves) {
    const from = cellToPx(this.state.rabbit.c, this.state.rabbit.r);
    const d = DIRS[dir];
    const to = cellToPx(this.state.rabbit.c + d.dc, this.state.rabbit.r + d.dr);
    const face = faceDir || dir;
    const frames = [
      rabbitSprite(face, 'walk-1'),
      rabbitSprite(face, 'idle'),
      rabbitSprite(face, 'walk-2'),
      rabbitSprite(face, 'idle')
    ];
    const total = this.dur(580);
    const t0 = performance.now();
    return new Promise((resolve) => {
      const frame = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / total));
        const x = from.x + (to.x - from.x) * k;
        const y = from.y + (to.y - from.y) * k;
        const fi = Math.min(frames.length - 1, Math.floor(k * frames.length));
        const crates = new Map();
        for (const m of moves) {
          const dst = cellToPx(m.pb.c, m.pb.r);
          crates.set(m.pb, { x: m.fx + (dst.x - m.fx) * k, y: m.fy + (dst.y - m.fy) * k });
        }
        this.drawEntities({ gx: x, gy: y, arc: 0, sprite: frames[fi] }, crates);
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  animateJump(dir, inPlace) {
    const from = cellToPx(this.state.rabbit.c, this.state.rabbit.r);
    const d = DIRS[dir];
    const to = inPlace ? from : cellToPx(this.state.rabbit.c + d.dc, this.state.rabbit.r + d.dr);
    const sprite = rabbitSprite(dir, 'walk-1');
    const total = this.dur(340);
    const t0 = performance.now();
    const peak = -38;
    return new Promise((resolve) => {
      const frame = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / total));
        const x = from.x + (to.x - from.x) * k;
        const y = from.y + (to.y - from.y) * k;
        const arc = 4 * peak * k * (1 - k);
        this.drawEntities({ gx: x, gy: y, arc, sprite });
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  animateBump(dir) {
    const from = cellToPx(this.state.rabbit.c, this.state.rabbit.r);
    const d = DIRS[dir];
    const mid = { x: from.x + d.dc * CELL * 0.4, y: from.y + d.dr * CELL * 0.4 };
    const sprite = rabbitSprite(dir, 'idle');
    const total = this.dur(220);
    const t0 = performance.now();
    return new Promise((resolve) => {
      const frame = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / total));
        const back = k < 0.5 ? k * 2 : (1 - k) * 2;
        this.drawEntities({
          gx: from.x + (mid.x - from.x) * back,
          gy: from.y + (mid.y - from.y) * back,
          arc: 0,
          sprite
        });
        if (k < 1) requestAnimationFrame(frame);
        else {
          this.drawRabbitIdle();
          resolve();
        }
      };
      requestAnimationFrame(frame);
    });
  }

  async animatePickup(item) {
    const total = this.dur(520);
    const t0 = performance.now();
    const peak = -72;
    await new Promise((resolve) => {
      const frame = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / total));
        item.hop = 4 * peak * k * (1 - k);
        item.fade = 1 - k * k;
        this.drawCollectables();
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
    item.collected = true;
    item.hop = 0;
    item.fade = 0;
    this.drawCollectables();
    this.drawRabbitIdle();
  }

  async checkPickup() {
    let hit = null;
    for (const it of this.state.collectables) {
      if (!it.collected && it.c === this.state.rabbit.c && it.r === this.state.rabbit.r) {
        hit = it;
        break;
      }
    }
    if (hit) {
      await this.animatePickup(hit);
      this.state.collectedCount++;
      this.setInfo();
      if (this.state.collectedCount >= this.state.total) {
        this.setStatus('Berhasil! Semua collectables terkumpul 🎉');
        return 'win';
      }
      this.setStatus(`Dapat ${hit.type}! (${this.state.collectedCount}/${this.state.total})`);
      return 'picked';
    }
    return null;
  }

  async stepWalk(dir) {
    this.state.rabbit.dir = dir;
    const chk = this.canWalk(this.state.rabbit.c, this.state.rabbit.r, dir);
    if (!chk.ok) {
      await this.animateBump(dir);
      return { bumped: true, reason: chk.reason };
    }
    let moves = null;
    if (this.hasPushable(chk.nc, chk.nr)) {
      const push = this.tryPush(this.state.rabbit.c, this.state.rabbit.r, dir);
      if (!push.ok) {
        await this.animateBump(dir);
        return { bumped: true, reason: push.reason };
      }
      moves = push.chain.map((p) => {
        const f = cellToPx(p.c, p.r);
        return { pb: this.pushableAt(p.c, p.r), fx: f.x, fy: f.y };
      });
      this.applyPush(push.chain, dir);
    }
    if (moves) await this.animatePush(dir, undefined, moves);
    else await this.animateWalk(dir);
    this.state.rabbit.c = chk.nc;
    this.state.rabbit.r = chk.nr;
    this.drawRabbitIdle();
    this.setInfo();
    return { bumped: false, pickup: await this.afterStep() };
  }

  async stepJump(dir) {
    this.state.rabbit.dir = dir;
    const chk = this.canJump(this.state.rabbit.c, this.state.rabbit.r, dir);
    if (!chk.ok) {
      await this.animateBump(dir);
      return { bumped: true, reason: chk.reason };
    }
    await this.animateJump(dir, false);
    this.state.rabbit.c = chk.nc;
    this.state.rabbit.r = chk.nr;
    this.drawRabbitIdle();
    this.setInfo();
    return { bumped: false, pickup: await this.afterStep() };
  }

  async stepJumpForward() {
    return this.stepJump(this.state.rabbit.dir);
  }

  async stepMove(rel) {
    const face = this.state.rabbit.dir;
    const dir = rel === 'forward' ? face : OPPOSITE[face];
    const chk = this.canWalk(this.state.rabbit.c, this.state.rabbit.r, dir);
    if (!chk.ok) {
      await this.animateBump(dir);
      return { bumped: true, reason: chk.reason };
    }
    let moves = null;
    if (this.hasPushable(chk.nc, chk.nr)) {
      const push = this.tryPush(this.state.rabbit.c, this.state.rabbit.r, dir);
      if (!push.ok) {
        await this.animateBump(dir);
        return { bumped: true, reason: push.reason };
      }
      moves = push.chain.map((p) => {
        const f = cellToPx(p.c, p.r);
        return { pb: this.pushableAt(p.c, p.r), fx: f.x, fy: f.y };
      });
      this.applyPush(push.chain, dir);
    }
    if (moves) await this.animatePush(dir, face, moves);
    else await this.animateWalk(dir, face);
    this.state.rabbit.c = chk.nc;
    this.state.rabbit.r = chk.nr;
    this.drawRabbitIdle();
    this.setInfo();
    return { bumped: false, pickup: await this.afterStep() };
  }

  async stepWalkToX(x) {
    const target = Math.max(0, Math.min(GRID - 1, parseInt(x, 10) || 0));
    let guard = 0;
    while (this.state.rabbit.c !== target) {
      if (++guard > GRID * 2) break;
      const dir = target > this.state.rabbit.c ? 'right' : 'left';
      this.state.rabbit.dir = dir;
      const chk = this.canWalk(this.state.rabbit.c, this.state.rabbit.r, dir);
      if (!chk.ok || this.hasPushable(chk.nc, chk.nr)) {
        await this.animateBump(dir);
        return { bumped: true, reason: chk.ok ? 'block' : chk.reason };
      }
      await this.animateWalk(dir);
      this.state.rabbit.c = chk.nc;
      this.state.rabbit.r = chk.nr;
      this.drawRabbitIdle();
      this.setInfo();
      const res = await this.afterStep();
      if (res === 'win') return { bumped: false, pickup: 'win' };
    }
    return { bumped: false, pickup: null };
  }

  async stepWalkToY(y) {
    const target = Math.max(0, Math.min(GRID - 1, parseInt(y, 10) || 0));
    let guard = 0;
    while (this.state.rabbit.r !== target) {
      if (++guard > GRID * 2) break;
      const dir = target > this.state.rabbit.r ? 'down' : 'up';
      this.state.rabbit.dir = dir;
      const chk = this.canWalk(this.state.rabbit.c, this.state.rabbit.r, dir);
      if (!chk.ok || this.hasPushable(chk.nc, chk.nr)) {
        await this.animateBump(dir);
        return { bumped: true, reason: chk.ok ? 'block' : chk.reason };
      }
      await this.animateWalk(dir);
      this.state.rabbit.c = chk.nc;
      this.state.rabbit.r = chk.nr;
      this.drawRabbitIdle();
      this.setInfo();
      const res = await this.afterStep();
      if (res === 'win') return { bumped: false, pickup: 'win' };
    }
    return { bumped: false, pickup: null };
  }

  async stepTurn(rel) {
    const from = this.state.rabbit.dir;
    const to = rel === 'left' ? LEFT_OF[from] : RIGHT_OF[from];
    this.state.rabbit.dir = to;
    await this.animateTurn(from, to, rel);
    this.drawRabbitIdle();
    this.setInfo();
    return { bumped: false };
  }

  animateTurn(fromFace, toFace, rel) {
    const p = cellToPx(this.state.rabbit.c, this.state.rabbit.r);
    const peak = ((rel === 'left' ? -30 : 30) * Math.PI) / 180;
    const total = this.dur(580);
    const t0 = performance.now();
    return new Promise((resolve) => {
      const frame = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / total));
        const rot = peak * Math.sin(Math.PI * k);
        const sprite = rabbitSprite(k < 0.5 ? fromFace : toFace, 'idle');
        this.drawEntities({ gx: p.x, gy: p.y, arc: 0, sprite, rot });
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }
}
