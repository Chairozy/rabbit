export const MODES = { ABSOLUTE: 'absolute', RELATIVE: 'relative' };

export const LEVELS = [
  {
    id: 1, title: 'Langkah Pertama', mode: 'absolute', difficulty: 'Mudah',
    hint: 'Kelinci di (1,1). Wortel ada tepat di kanan. Pakai 1x Jalan kanan.',
    par: 1, solution: ['Jalan kanan'],
    rabbit: { c: 1, r: 1, dir: 'down' },
    collectables: [{ c: 2, r: 1, type: 'pumpkin' }],
    blocks: [], fences: []
  },
  {
    id: 2, title: 'Jalan Dua Kali', mode: 'absolute', difficulty: 'Mudah',
    hint: 'Dari (1,1) turun 2 cell ke (1,3). Susun 2x Jalan bawah.',
    par: 2, solution: ['Jalan bawah', 'Jalan bawah'],
    rabbit: { c: 1, r: 1, dir: 'down' },
    collectables: [{ c: 1, r: 3, type: 'tomato' }],
    blocks: [], fences: []
  },
  {
    id: 3, title: 'Belokan L', mode: 'absolute', difficulty: 'Mudah',
    hint: 'Dari (1,4) ke (3,2): 2x atas lalu 2x kanan. Urutan bebas, coba!',
    par: 4, solution: ['Jalan atas x2', 'Jalan kanan x2'],
    rabbit: { c: 1, r: 4, dir: 'up' },
    collectables: [{ c: 3, r: 2, type: 'corn' }],
    blocks: [], fences: []
  },
  {
    id: 4, title: 'Panen Atas', mode: 'absolute', difficulty: 'Mudah',
    hint: 'Tiga labu sejajar ke kanan. Hemat blok: Ulangi 3x + Jalan kanan.',
    par: 2, solution: ['Ulangi 3x [Jalan kanan]'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 2, r: 1, type: 'pumpkin' },
      { c: 3, r: 1, type: 'pumpkin' },
      { c: 4, r: 1, type: 'pumpkin' }
    ],
    blocks: [], fences: []
  },
  {
    id: 5, title: 'Panen Bawah', mode: 'absolute', difficulty: 'Mudah',
    hint: 'Dari (3,1): bawah ke (3,2), kiri ke (2,2), bawah ke (2,3). Urutan Bawah-Kiri-Bawah.',
    par: 3, solution: ['Jalan bawah', 'Jalan kiri', 'Jalan bawah'],
    rabbit: { c: 3, r: 1, dir: 'down' },
    collectables: [
      { c: 3, r: 2, type: 'tomato' },
      { c: 2, r: 2, type: 'tomato' },
      { c: 2, r: 3, type: 'tomato' }
    ],
    blocks: [], fences: []
  },
  {
    id: 6, title: 'Memutar Balok', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Balok menutup jalan lurus (2,1) dan (3,1). Memutar lewat baris 2: bawah, kanan x3, atas.',
    par: 5, solution: ['Jalan bawah', 'Jalan kanan x3', 'Jalan atas'],
    rabbit: { c: 1, r: 1, dir: 'down' },
    collectables: [{ c: 4, r: 1, type: 'pumpkin' }],
    blocks: [{ c: 2, r: 1, type: 'crate' }, { c: 3, r: 1, type: 'crate' }],
    fences: []
  },
  {
    id: 7, title: 'Pagar Pertama', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Pagar di tepi kanan (1,2) menahan Jalan. Lompat kanan 1x lalu Jalan kanan.',
    par: 2, solution: ['Lompat kanan', 'Jalan kanan'],
    rabbit: { c: 1, r: 2, dir: 'right' },
    collectables: [{ c: 3, r: 2, type: 'tomato' }],
    blocks: [],
    fences: [{ c: 1, r: 2, side: 'E', type: 'v' }]
  },
  {
    id: 8, title: 'Lompat Ganda', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Dua pagar beruntun: (1,3)->(2,3) dan (2,3)->(3,3). Lompat, Lompat, Jalan.',
    par: 3, solution: ['Lompat kanan x2', 'Jalan kanan'],
    rabbit: { c: 1, r: 3, dir: 'right' },
    collectables: [{ c: 4, r: 3, type: 'corn' }],
    blocks: [],
    fences: [
      { c: 1, r: 3, side: 'E', type: 'v' },
      { c: 2, r: 3, side: 'E', type: 'v' }
    ]
  },
  {
    id: 9, title: 'Jalan Memutar + Lompat', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Dari (2,1) yang terkepung balok: kiri ke (1,1), turun 2x ke (1,3), kanan ke (2,3), Lompat kanan lewati pagar (2,3) ke (3,3). Balok (1,4) menutup jalan bawah.',
    par: 5, solution: ['Jalan kiri', 'Jalan bawah x2', 'Jalan kanan', 'Lompat kanan'],
    rabbit: { c: 2, r: 1, dir: 'down' },
    collectables: [{ c: 3, r: 3, type: 'cabbage' }],
    blocks: [{ c: 3, r: 1, type: 'rock' }, { c: 2, r: 2, type: 'rock' }, { c: 1, r: 4, type: 'rock' }],
    fences: [{ c: 2, r: 3, side: 'E', type: 'v' }]
  },
  {
    id: 10, title: 'Ujian Absolut', mode: 'absolute', difficulty: 'Sulit',
    hint: 'Tengah 2x2 diblok. Kelilingi pulau: Ulangi 3x kanan, Ulangi 3x bawah, Ulangi 3x kiri untuk 3 sudut.',
    par: 6, solution: ['Ulangi 3x [Jalan kanan]', 'Ulangi 3x [Jalan bawah]', 'Ulangi 3x [Jalan kiri]'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 4, r: 1, type: 'pumpkin' },
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 4, type: 'tomato' }
    ],
    blocks: [
      { c: 2, r: 2, type: 'crate' },
      { c: 3, r: 2, type: 'crate' },
      { c: 2, r: 3, type: 'crate' },
      { c: 3, r: 3, type: 'crate' }
    ],
    fences: []
  },
  {
    id: 11, title: 'Slalom Balok', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Dinding balok di atas (2,1),(3,1) dan tengah (1,3),(2,3). Rute: bawah, kanan x3, bawah x2, kiri x3.',
    par: 9, solution: ['Jalan bawah', 'Jalan kanan x3', 'Jalan bawah x2', 'Jalan kiri x3'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 4, type: 'tomato' }
    ],
    blocks: [
      { c: 2, r: 1, type: 'crate' },
      { c: 3, r: 1, type: 'crate' },
      { c: 1, r: 3, type: 'rock' },
      { c: 2, r: 3, type: 'rock' }
    ],
    fences: []
  },
  {
    id: 12, title: 'Tiga Pagar Sejajar', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Tiga pagar beruntun ke timur. Hemat blok: Ulangi 3x + Lompat kanan.',
    par: 2, solution: ['Ulangi 3x [Lompat kanan]'],
    rabbit: { c: 1, r: 2, dir: 'right' },
    collectables: [{ c: 4, r: 2, type: 'wheat' }],
    blocks: [],
    fences: [
      { c: 1, r: 2, side: 'E', type: 'v' },
      { c: 2, r: 2, side: 'E', type: 'v' },
      { c: 3, r: 2, side: 'E', type: 'v' }
    ]
  },
  {
    id: 13, title: 'Pagar Vertikal', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Mulai (3,2): kiri masuk kolom 2, Lompat atas ambil (2,1), lalu Lompat bawah 3x susuri pagar sampai (2,4).',
    par: 5, solution: ['Jalan kiri', 'Lompat atas', 'Ulangi 3x [Lompat bawah]'],
    rabbit: { c: 3, r: 2, dir: 'left' },
    collectables: [
      { c: 2, r: 1, type: 'pumpkin' },
      { c: 2, r: 4, type: 'turnip' }
    ],
    blocks: [],
    fences: [
      { c: 2, r: 1, side: 'S', type: 'h' },
      { c: 2, r: 2, side: 'S', type: 'h' },
      { c: 2, r: 3, side: 'S', type: 'h' }
    ]
  },
  {
    id: 14, title: 'Pintu Pagar Ganda', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Pagar di timur (1,1) dan selatan (2,2), balok dan bunga menutup barat dan timur. Rute: Lompat kanan, bawah, Lompat bawah, bawah, kanan ke (3,4).',
    par: 5, solution: ['Lompat kanan', 'Jalan bawah', 'Lompat bawah', 'Jalan bawah', 'Jalan kanan'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [{ c: 3, r: 4, type: 'corn' }],
    blocks: [
      { c: 1, r: 2, type: 'crate' },
      { c: 3, r: 1, type: 'red-flower' },
      { c: 3, r: 2, type: 'white-flower' }
    ],
    fences: [
      { c: 1, r: 1, side: 'E', type: 'v' },
      { c: 2, r: 2, side: 'S', type: 'h' }
    ]
  },
  {
    id: 15, title: 'Panen Silang', mode: 'absolute', difficulty: 'Sedang',
    hint: 'Mulai (2,2) terkepung pagar timur dan selatan. Atas-bawah dulu, Lompat kanan-kiri ambil tomat, Lompat bawah-atas ambil jagung, terakhir kiri ambil kubis.',
    par: 7, solution: ['Jalan atas', 'Jalan bawah', 'Lompat kanan', 'Lompat kiri', 'Lompat bawah', 'Lompat atas', 'Jalan kiri'],
    rabbit: { c: 2, r: 2, dir: 'up' },
    collectables: [
      { c: 2, r: 1, type: 'pumpkin' },
      { c: 3, r: 2, type: 'tomato' },
      { c: 2, r: 3, type: 'corn' },
      { c: 1, r: 2, type: 'cabbage' }
    ],
    blocks: [{ c: 1, r: 1, type: 'crate' }],
    fences: [
      { c: 2, r: 2, side: 'S', type: 'h' },
      { c: 3, r: 2, side: 'S', type: 'h' },
      { c: 2, r: 2, side: 'E', type: 'v' }
    ]
  },
  {
    id: 16, title: 'Kurung Balok U', mode: 'absolute', difficulty: 'Sulit',
    hint: 'Start (1,1) dipagar selatan — Lompat bawah dulu. Balok (1,3) menutup barat, memutar lewat (2,2) masuk kantong (3,3), kembali lalu Lompat bawah lewati pagar (2,3) dan kiri ke (1,4).',
    par: 7, solution: ['Lompat bawah', 'Jalan kanan', 'Jalan bawah', 'Jalan kanan', 'Jalan kiri', 'Lompat bawah', 'Jalan kiri'],
    rabbit: { c: 1, r: 1, dir: 'down' },
    collectables: [
      { c: 3, r: 3, type: 'pumpkin' },
      { c: 1, r: 4, type: 'tomato' }
    ],
    blocks: [
      { c: 3, r: 2, type: 'crate' },
      { c: 4, r: 3, type: 'crate' },
      { c: 3, r: 4, type: 'rock' },
      { c: 1, r: 3, type: 'rock' }
    ],
    fences: [
      { c: 1, r: 1, side: 'S', type: 'h' },
      { c: 2, r: 1, side: 'S', type: 'h' },
      { c: 2, r: 3, side: 'S', type: 'h' }
    ]
  },
  {
    id: 17, title: 'Ular Raksasa', mode: 'absolute', difficulty: 'Sulit',
    hint: 'Menyusuri ular: kanan, Lompat kanan lewati pagar (2,4), kanan, atas, kiri + Lompat kiri lewati pagar (2,3) + kiri, atas, kanan x3, atas. Pagar selatan (3,2),(4,2) menutup jalan pintas.',
    par: 12, solution: ['Jalan kanan', 'Lompat kanan', 'Jalan kanan', 'Jalan atas', 'Jalan kiri', 'Lompat kiri', 'Jalan kiri', 'Jalan atas', 'Jalan kanan x3', 'Jalan atas'],
    rabbit: { c: 1, r: 4, dir: 'right' },
    collectables: [
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 3, type: 'tomato' },
      { c: 4, r: 1, type: 'pumpkin' }
    ],
    blocks: [
      { c: 1, r: 1, type: 'crate' },
      { c: 2, r: 1, type: 'crate' },
      { c: 3, r: 1, type: 'crate' }
    ],
    fences: [
      { c: 2, r: 3, side: 'E', type: 'v' },
      { c: 2, r: 4, side: 'E', type: 'v' },
      { c: 3, r: 2, side: 'S', type: 'h' },
      { c: 4, r: 2, side: 'S', type: 'h' }
    ]
  },
  {
    id: 18, title: 'Kandang Pagar', mode: 'absolute', difficulty: 'Sulit',
    hint: 'Baris 1 ditutup balok, wajib lewat selatan. Lompat masuk ke (3,3) lewati pagar (2,3), lalu turun-kanan ke (4,4).',
    par: 6, solution: ['Jalan bawah x2', 'Jalan kanan', 'Lompat kanan', 'Jalan bawah', 'Jalan kanan'],
    rabbit: { c: 1, r: 1, dir: 'down' },
    collectables: [
      { c: 3, r: 3, type: 'cabbage' },
      { c: 4, r: 4, type: 'pumpkin' }
    ],
    blocks: [
      { c: 2, r: 1, type: 'crate' },
      { c: 3, r: 1, type: 'crate' },
      { c: 4, r: 1, type: 'crate' }
    ],
    fences: [
      { c: 2, r: 3, side: 'E', type: 'v' },
      { c: 3, r: 2, side: 'S', type: 'h' }
    ]
  },
  {
    id: 19, title: 'Pesta Panen', mode: 'absolute', difficulty: 'Sulit',
    hint: 'Dinding crate menutup barat. Masuk kolom 3 (lompat pagar (2,1)), susuri selatan lompat pagar (3,2), ke timur lalu lompat naik lewati pagar (4,2), ambil (4,1), lompat turun lagi, dan lompat pagar (2,4) untuk mencapai (1,4).',
    par: 15, solution: ['Jalan kanan', 'Lompat kanan', 'Jalan bawah', 'Lompat bawah', 'Jalan bawah', 'Jalan kanan', 'Lompat atas x2', 'Jalan atas', 'Lompat bawah x3', 'Jalan kiri', 'Lompat kiri', 'Jalan kiri'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 4, r: 1, type: 'pumpkin' },
      { c: 4, r: 2, type: 'wheat' },
      { c: 4, r: 3, type: 'tomato' },
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 4, type: 'cabbage' },
      { c: 3, r: 1, type: 'turnip' },
      { c: 3, r: 2, type: 'corn' },
      { c: 3, r: 3, type: 'wheat' },
      { c: 3, r: 4, type: 'pumpkin' }
    ],
    blocks: [
      { c: 1, r: 2, type: 'crate' },
      { c: 2, r: 2, type: 'crate' },
      { c: 1, r: 3, type: 'crate' },
      { c: 2, r: 3, type: 'crate' }
    ],
    fences: [
      { c: 2, r: 1, side: 'E', type: 'v' },
      { c: 2, r: 4, side: 'E', type: 'v' },
      { c: 3, r: 2, side: 'S', type: 'h' },
      { c: 4, r: 2, side: 'S', type: 'h' }
    ]
  },
  {
    id: 20, title: 'Master Absolut', mode: 'absolute', difficulty: 'Sulit',
    hint: 'Enam panen! Rute 17 langkah: naik ambil (1,3), lompat-naik ambil (2,2), lompat ambil (3,2), naik-kanan panen (4,1), turun 3x panen (4,4), kembali ke barat, naik kolom 2 lalu kiri ke (1,1) terakhir.',
    par: 17, solution: ['Jalan atas', 'Lompat kanan', 'Jalan atas', 'Lompat kanan', 'Jalan atas', 'Jalan kanan', 'Jalan bawah x3', 'Jalan kiri', 'Lompat kiri', 'Jalan kiri', 'Jalan atas', 'Lompat kanan', 'Jalan atas x2', 'Jalan kiri'],
    rabbit: { c: 1, r: 4, dir: 'up' },
    collectables: [
      { c: 4, r: 1, type: 'pumpkin' },
      { c: 1, r: 1, type: 'cabbage' },
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 3, type: 'tomato' },
      { c: 2, r: 2, type: 'wheat' },
      { c: 3, r: 2, type: 'turnip' }
    ],
    blocks: [{ c: 1, r: 2, type: 'crate' }, { c: 3, r: 3, type: 'crate' }],
    fences: [
      { c: 1, r: 3, side: 'E', type: 'v' },
      { c: 2, r: 4, side: 'E', type: 'v' },
      { c: 2, r: 1, side: 'E', type: 'v' },
      { c: 2, r: 2, side: 'E', type: 'v' }
    ]
  },
  {
    id: 21, title: 'Hadap & Maju', mode: 'relative', difficulty: 'Mudah',
    hint: 'Kelinci menghadap kanan di (1,2). Maju 2x sampai (3,2). Maju mengikuti arah hadap!',
    par: 2, solution: ['Maju', 'Maju'],
    rabbit: { c: 1, r: 2, dir: 'right' },
    collectables: [{ c: 3, r: 2, type: 'pumpkin' }],
    blocks: [], fences: []
  },
  {
    id: 22, title: 'Belok Kanan Pertama', mode: 'relative', difficulty: 'Mudah',
    hint: 'Menghadap kanan di (1,1), target (1,3) di selatan. Belok kanan 1x lalu Maju 2x.',
    par: 3, solution: ['Belok kanan', 'Maju x2'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [{ c: 1, r: 3, type: 'tomato' }],
    blocks: [], fences: []
  },
  {
    id: 23, title: 'Mundur Cerdas', mode: 'relative', difficulty: 'Mudah',
    hint: 'Menghadap atas di (2,2). Depan ada labu (2,1), belakang ada jagung (2,3). Maju, Mundur, Mundur.',
    par: 3, solution: ['Maju', 'Mundur x2'],
    rabbit: { c: 2, r: 2, dir: 'up' },
    collectables: [
      { c: 2, r: 1, type: 'pumpkin' },
      { c: 2, r: 3, type: 'corn' }
    ],
    blocks: [], fences: []
  },
  {
    id: 24, title: 'Kotak Sempurna', mode: 'relative', difficulty: 'Sedang',
    hint: 'Putari kotak 1x1 kembali ke awal: Ulangi 4x [Maju, Belok kanan]. Panen 3 sudut!',
    par: 2, solution: ['Ulangi 4x [Maju, Belok kanan]'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 2, r: 1, type: 'pumpkin' },
      { c: 2, r: 2, type: 'tomato' },
      { c: 1, r: 2, type: 'corn' }
    ],
    blocks: [], fences: []
  },
  {
    id: 25, title: 'Lompat Depan Pertama', mode: 'relative', difficulty: 'Sedang',
    hint: 'Menghadap kanan, pagar di depan (1,2). Lompat depan 1x lalu Maju 1x.',
    par: 2, solution: ['Lompat depan', 'Maju'],
    rabbit: { c: 1, r: 2, dir: 'right' },
    collectables: [{ c: 3, r: 2, type: 'tomato' }],
    blocks: [],
    fences: [{ c: 1, r: 2, side: 'E', type: 'v' }]
  },
  {
    id: 26, title: 'Koridor Pagar', mode: 'relative', difficulty: 'Sedang',
    hint: 'Dua pagar beruntun ke timur. Lompat depan 2x sampai (3,3), lalu Belok kiri dan Maju ambil (3,2).',
    par: 4, solution: ['Lompat depan x2', 'Belok kiri', 'Maju'],
    rabbit: { c: 1, r: 3, dir: 'right' },
    collectables: [
      { c: 3, r: 2, type: 'tomato' },
      { c: 3, r: 3, type: 'corn' }
    ],
    blocks: [],
    fences: [
      { c: 1, r: 3, side: 'E', type: 'v' },
      { c: 2, r: 3, side: 'E', type: 'v' }
    ]
  },
  {
    id: 27, title: 'Labirin Balok Relatif', mode: 'relative', difficulty: 'Sulit',
    hint: 'Balok (2,1),(3,1) tutup atas. Belok kanan, Maju, Belok kiri, Maju x3, Belok kiri, Maju ke (4,1).',
    par: 8, solution: ['Belok kanan', 'Maju', 'Belok kiri', 'Maju x3', 'Belok kiri', 'Maju'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [{ c: 4, r: 1, type: 'pumpkin' }],
    blocks: [{ c: 2, r: 1, type: 'crate' }, { c: 3, r: 1, type: 'crate' }],
    fences: []
  },
  {
    id: 28, title: 'Zigzag Pagar Relatif', mode: 'relative', difficulty: 'Sulit',
    hint: 'Balok menutup utara dan barat-selatan. Belok kanan, maju 2x, belok kiri, maju, Lompat depan lewati pagar (2,3) ke (3,3).',
    par: 6, solution: ['Belok kanan', 'Maju x2', 'Belok kiri', 'Maju', 'Lompat depan'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [{ c: 3, r: 3, type: 'cabbage' }],
    blocks: [
      { c: 2, r: 1, type: 'rock' },
      { c: 3, r: 1, type: 'rock' },
      { c: 1, r: 4, type: 'rock' },
      { c: 2, r: 4, type: 'rock' },
      { c: 3, r: 2, type: 'rock' }
    ],
    fences: [{ c: 2, r: 3, side: 'E', type: 'v' }]
  },
  {
    id: 29, title: 'Keliling Relatif', mode: 'relative', difficulty: 'Sulit',
    hint: 'Maju x3, Belok kanan, Maju x3, Belok kanan, Maju x3 mengelilingi blok tengah.',
    par: 8, solution: ['Ulangi 3x [Maju]', 'Belok kanan', 'Ulangi 3x [Maju]', 'Belok kanan', 'Ulangi 3x [Maju]'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 4, r: 1, type: 'pumpkin' },
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 4, type: 'tomato' }
    ],
    blocks: [
      { c: 2, r: 2, type: 'crate' },
      { c: 3, r: 2, type: 'crate' },
      { c: 2, r: 3, type: 'crate' },
      { c: 3, r: 3, type: 'crate' }
    ],
    fences: []
  },
  {
    id: 30, title: 'Raja Kelinci', mode: 'relative', difficulty: 'Sulit',
    hint: 'Rute: utara ambil (1,1), lompat ke timur panen (4,1), turun ambil (4,2), susuri selatan ke barat, lompat pagar (2,4), lalu naik kolom 2 panen (2,2).',
    par: 16, solution: ['Belok kiri', 'Maju', 'Belok kanan', 'Lompat depan', 'Maju x2', 'Belok kanan', 'Maju x3', 'Belok kanan', 'Maju', 'Lompat depan', 'Belok kanan', 'Maju x2'],
    rabbit: { c: 1, r: 2, dir: 'right' },
    collectables: [
      { c: 1, r: 1, type: 'cabbage' },
      { c: 4, r: 1, type: 'pumpkin' },
      { c: 4, r: 2, type: 'corn' },
      { c: 2, r: 2, type: 'tomato' }
    ],
    blocks: [{ c: 3, r: 2, type: 'crate' }, { c: 3, r: 3, type: 'crate' }],
    fences: [
      { c: 1, r: 1, side: 'E', type: 'v' },
      { c: 2, r: 4, side: 'E', type: 'v' }
    ]
  },
  {
    id: 31, title: 'Belok Beruntun', mode: 'relative', difficulty: 'Sedang',
    hint: 'Tiga sayur terkepung pagar — semua jalan tertutup. Lompat depan, belok kanan, Lompat depan, belok kanan, Lompat depan.',
    par: 5, solution: ['Lompat depan', 'Belok kanan', 'Lompat depan', 'Belok kanan', 'Lompat depan'],
    rabbit: { c: 2, r: 2, dir: 'right' },
    collectables: [
      { c: 3, r: 2, type: 'pumpkin' },
      { c: 3, r: 3, type: 'tomato' },
      { c: 2, r: 3, type: 'corn' }
    ],
    blocks: [],
    fences: [
      { c: 2, r: 2, side: 'E', type: 'v' },
      { c: 2, r: 3, side: 'E', type: 'v' },
      { c: 2, r: 2, side: 'S', type: 'h' },
      { c: 3, r: 2, side: 'S', type: 'h' }
    ]
  },
  {
    id: 32, title: 'Mundur Panjang', mode: 'relative', difficulty: 'Sedang',
    hint: 'Menghadap tembok utara di (1,1). Jangan berbalik — Mundur 3x sampai (1,4)!',
    par: 2, solution: ['Ulangi 3x [Mundur]'],
    rabbit: { c: 1, r: 1, dir: 'up' },
    collectables: [{ c: 1, r: 4, type: 'cabbage' }],
    blocks: [], fences: []
  },
  {
    id: 33, title: 'Belok Kiri Wajib', mode: 'relative', difficulty: 'Sedang',
    hint: 'Kolom 3-4 disegel pagar selatan. Maju dulu ambil (3,1), putar balik (2x belok kiri), maju, belok kanan, Lompat depan 2x susuri kolom 4 ke (4,3).',
    par: 7, solution: ['Maju', 'Belok kiri x2', 'Maju', 'Belok kanan', 'Lompat depan x2'],
    rabbit: { c: 4, r: 1, dir: 'left' },
    collectables: [
      { c: 4, r: 3, type: 'pumpkin' },
      { c: 3, r: 1, type: 'tomato' }
    ],
    blocks: [],
    fences: [
      { c: 4, r: 1, side: 'S', type: 'h' },
      { c: 4, r: 2, side: 'S', type: 'h' },
      { c: 4, r: 3, side: 'S', type: 'h' },
      { c: 3, r: 1, side: 'S', type: 'h' },
      { c: 3, r: 2, side: 'S', type: 'h' },
      { c: 3, r: 3, side: 'S', type: 'h' }
    ]
  },
  {
    id: 34, title: 'Slalom Relatif', mode: 'relative', difficulty: 'Sedang',
    hint: 'Peta Slalom versi relatif: belok kanan, maju, belok kiri, maju x3, belok kanan, maju x2, belok kanan, maju x3.',
    par: 13, solution: ['Belok kanan', 'Maju', 'Belok kiri', 'Maju x3', 'Belok kanan', 'Maju x2', 'Belok kanan', 'Maju x3'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 4, type: 'tomato' }
    ],
    blocks: [
      { c: 2, r: 1, type: 'crate' },
      { c: 3, r: 1, type: 'crate' },
      { c: 1, r: 3, type: 'rock' },
      { c: 2, r: 3, type: 'rock' }
    ],
    fences: []
  },
  {
    id: 35, title: 'Gerbang Lompat Relatif', mode: 'relative', difficulty: 'Sedang',
    hint: 'Pagar di depan (1,1) dan di selatan (2,2). Rute: Lompat depan, belok kanan, maju, Lompat depan, maju, belok kiri, maju x2.',
    par: 8, solution: ['Lompat depan', 'Belok kanan', 'Maju', 'Lompat depan', 'Maju', 'Belok kiri', 'Maju x2'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [{ c: 4, r: 4, type: 'corn' }],
    blocks: [],
    fences: [
      { c: 1, r: 1, side: 'E', type: 'v' },
      { c: 2, r: 2, side: 'S', type: 'h' }
    ]
  },
  {
    id: 36, title: 'Kantong Relatif', mode: 'relative', difficulty: 'Sulit',
    hint: 'Labu di kantong (3,3) hanya dari barat. Masuk dari (1,3), putar balik dengan 2x belok, kembali, lalu belok ke (1,4).',
    par: 12, solution: ['Belok kanan', 'Maju x2', 'Belok kiri', 'Maju x2', 'Belok kiri x2', 'Maju x2', 'Belok kiri', 'Maju'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 3, r: 3, type: 'pumpkin' },
      { c: 1, r: 4, type: 'tomato' }
    ],
    blocks: [
      { c: 3, r: 2, type: 'crate' },
      { c: 4, r: 3, type: 'crate' },
      { c: 3, r: 4, type: 'rock' }
    ],
    fences: []
  },
  {
    id: 37, title: 'Ular Relatif', mode: 'relative', difficulty: 'Sulit',
    hint: 'Ular raksasa versi relatif dari (1,4): maju x3, belok kiri, maju, belok kiri, maju, Lompat depan ke barat, maju, belok kanan, maju, belok kanan, maju x3, belok kiri, maju.',
    par: 18, solution: ['Maju x3', 'Belok kiri', 'Maju', 'Belok kiri', 'Maju', 'Lompat depan', 'Maju', 'Belok kanan', 'Maju', 'Belok kanan', 'Maju x3', 'Belok kiri', 'Maju'],
    rabbit: { c: 1, r: 4, dir: 'right' },
    collectables: [
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 3, type: 'tomato' },
      { c: 4, r: 1, type: 'pumpkin' }
    ],
    blocks: [
      { c: 1, r: 1, type: 'crate' },
      { c: 2, r: 1, type: 'crate' },
      { c: 3, r: 1, type: 'crate' }
    ],
    fences: [{ c: 2, r: 3, side: 'E', type: 'v' }]
  },
  {
    id: 38, title: 'Kandang Relatif', mode: 'relative', difficulty: 'Sulit',
    hint: 'Baris 1 diblok, turun dulu. Belok kanan, maju x2, belok kiri, maju, Lompat depan masuk (3,3), belok kanan, maju, belok kiri, maju ke (4,4).',
    par: 10, solution: ['Belok kanan', 'Maju x2', 'Belok kiri', 'Maju', 'Lompat depan', 'Belok kanan', 'Maju', 'Belok kiri', 'Maju'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 3, r: 3, type: 'cabbage' },
      { c: 4, r: 4, type: 'pumpkin' }
    ],
    blocks: [
      { c: 2, r: 1, type: 'crate' },
      { c: 3, r: 1, type: 'crate' },
      { c: 4, r: 1, type: 'crate' }
    ],
    fences: [
      { c: 2, r: 3, side: 'E', type: 'v' },
      { c: 3, r: 2, side: 'S', type: 'h' }
    ]
  },
  {
    id: 39, title: 'Pesta Keliling Relatif', mode: 'relative', difficulty: 'Sulit',
    hint: 'Lima sayur sekali putaran relatif: Maju x3, Belok kanan, Maju x3, Belok kanan, Maju x3. Semua dengan Ulangi!',
    par: 8, solution: ['Ulangi 3x [Maju]', 'Belok kanan', 'Ulangi 3x [Maju]', 'Belok kanan', 'Ulangi 3x [Maju]'],
    rabbit: { c: 1, r: 1, dir: 'right' },
    collectables: [
      { c: 4, r: 1, type: 'pumpkin' },
      { c: 4, r: 2, type: 'wheat' },
      { c: 4, r: 3, type: 'tomato' },
      { c: 4, r: 4, type: 'corn' },
      { c: 1, r: 4, type: 'cabbage' }
    ],
    blocks: [], fences: []
  },
  {
    id: 40, title: 'Kaisar Kelinci', mode: 'relative', difficulty: 'Sulit',
    hint: 'Final! Peta Master Absolut versi relatif. Ingat: Lompat depan hanya ke arah hadap, putar dulu baru lompat. Panen (4,1), (1,1), (4,4) berurutan.',
    par: 20, solution: ['Maju', 'Belok kanan', 'Lompat depan', 'Maju x2', 'Belok kiri', 'Maju x2', 'Belok kiri', 'Maju x3', 'Belok kiri', 'Maju x3', 'Belok kiri', 'Maju', 'Lompat depan', 'Maju'],
    rabbit: { c: 1, r: 4, dir: 'up' },
    collectables: [
      { c: 4, r: 1, type: 'pumpkin' },
      { c: 1, r: 1, type: 'cabbage' },
      { c: 4, r: 4, type: 'corn' }
    ],
    blocks: [{ c: 2, r: 2, type: 'crate' }, { c: 3, r: 2, type: 'crate' }],
    fences: [
      { c: 1, r: 3, side: 'E', type: 'v' },
      { c: 2, r: 4, side: 'E', type: 'v' }
    ]
  }
];

export const DEFAULT_LEVEL = LEVELS[0];
export const getLevel = (id) => LEVELS.find((l) => l.id === Number(id)) ?? LEVELS[0];
