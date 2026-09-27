/* SAHNE 1 — CİSİM (0–10 s)  Açarsak ne çıkar?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function dashL(ctx, p, q, a, seed, color, w = 2.5) {
    if (a <= 0) return; const n = Math.max(6, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 14));
    for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w, alpha: a, seed: seed + j, taper: [0, 0], color });
  }
  function seg2(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]], { w, alpha: a, seed, taper: [0, 0], color }); }
  function dot(ctx, p, a, color) { if (a <= 0) return; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = color ? `rgba(${color},${a})` : `rgba(${LI.INK_RGB},${a})`; ctx.fill(); }
  function txt(ctx, env, p, s, a, hot, sz = 0.8) { if (a > 0) F().T(ctx, s, p[0], p[1], { size: KD.L(env).G.s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function arcAt(ctx, C, r, u0, u1, a, seed, color) {
    if (a <= 0) return; const P = []; for (let j = 0; j <= 16; j++) { const u = lerp(u0, u1, j / 16); P.push([C[0] + r * Math.cos(u), C[1] + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 2.5, alpha: a, seed, taper: [0, 0], color });
  }
  const lerpP = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  function fillP(ctx, P, fill) { ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  const AMB = (a) => `rgba(${LI.AMBER_RGB},${0.3 * a})`;
  function edge(ctx, p, q, a, k, seed, hidden, color, w = 3.5) { if (a <= 0 || k <= 0) return; const r = lerpP(p, q, k); if (hidden) dashL(ctx, p, r, a * 0.6, seed, color); else Ink.path(ctx, [p, r], { w, alpha: a, seed, taper: [0, 0], color }); }
  function ellP(C, rx, ry, u0, u1, n = 28) { const P = []; for (let j = 0; j <= n; j++) { const u = lerp(u0, u1, j / n); P.push([C[0] + rx * Math.cos(u), C[1] + ry * Math.sin(u)]); } return P; }
  function curve(ctx, P, a, seed, hidden, color, w = 3.5) { if (a <= 0 || P.length < 2) return; if (hidden) { for (let j = 0; j < P.length - 1; j += 2) Ink.path(ctx, [P[j], P[j + 1]], { w: 2.5, alpha: a * 0.6, seed: seed + j, taper: [0, 0], color }); } else Ink.path(ctx, P, { w, alpha: a, seed, taper: [0, 0], color }); }
  const part = (P, k) => P.slice(0, Math.max(2, Math.ceil(P.length * k)));
  /* solids, cabinet projection around SB */
  function Pj(env, x, y, z) { const S = KD.L(env).SB; return [S.x + (x + y * 0.5) * S.c, S.y - (z + y * 0.5) * S.c]; }
  function prism(ctx, env, t, t0, a, hl) {
    const b = [[-1.5, -0.9], [1.5, -0.9], [0, 1.7]].map(([x, y]) => [x, y]), H = 4, z0 = -2;
    const lo = b.map(([x, y]) => Pj(env, x, y, z0)), hi = b.map(([x, y]) => Pj(env, x, y, z0 + H));
    if (hl === 'tri') { fillP(ctx, hi, AMB(a)); }
    if (hl === 'rect') { fillP(ctx, [lo[0], lo[1], hi[1], hi[0]], AMB(a)); fillP(ctx, [lo[1], lo[2], hi[2], hi[1]], AMB(a)); }
    const k = (i) => seg(t, t0 + i * 0.15, t0 + i * 0.15 + 0.5);
    edge(ctx, lo[0], lo[1], a, k(0), 2901); edge(ctx, lo[1], lo[2], a, k(1), 2902, true); edge(ctx, lo[2], lo[0], a, k(2), 2903, true);
    edge(ctx, lo[0], hi[0], a, k(3), 2904); edge(ctx, lo[1], hi[1], a, k(4), 2905); edge(ctx, lo[2], hi[2], a, k(5), 2906, true);
    edge(ctx, hi[0], hi[1], a, k(6), 2907); edge(ctx, hi[1], hi[2], a, k(7), 2908); edge(ctx, hi[2], hi[0], a, k(8), 2909);
    if (hl === 'tri') { dashL(ctx, lo[0], lo[1], 0, 0); }
  }
  function pyramid(ctx, env, t, t0, a, hl) {
    const z0 = -2, B = [[-2, -1.5], [2, -1.5], [2, 1.5], [-2, 1.5]].map(([x, y]) => Pj(env, x, y, z0)), T = Pj(env, 0, 0, z0 + 4);
    if (hl === 'tri') { fillP(ctx, [B[0], B[1], T], AMB(a)); fillP(ctx, [B[1], B[2], T], AMB(a)); }
    if (hl === 'base') fillP(ctx, B, AMB(a));
    const k = (i) => seg(t, t0 + i * 0.15, t0 + i * 0.15 + 0.5);
    edge(ctx, B[0], B[1], a, k(0), 2911); edge(ctx, B[1], B[2], a, k(1), 2912); edge(ctx, B[2], B[3], a, k(2), 2913, true); edge(ctx, B[3], B[0], a, k(3), 2914, true);
    edge(ctx, B[0], T, a, k(4), 2915); edge(ctx, B[1], T, a, k(5), 2916); edge(ctx, B[2], T, a, k(6), 2917); edge(ctx, B[3], T, a, k(7), 2918, true);
  }
  function cylinder(ctx, env, t, t0, a, hl) {
    const S = KD.L(env).SB, c = S.c, r = 1.5 * c, ry = 0.45 * c, h = 4 * c, top = [S.x, S.y - h / 2], bot = [S.x, S.y + h / 2];
    if (hl === 'side') fillP(ctx, [[bot[0] - r, bot[1]], ...ellP(bot, r, ry, Math.PI, 0).reverse().reverse(), [top[0] + r, top[1]], ...ellP(top, r, ry, 0, Math.PI)], AMB(a));
    if (hl === 'circ') { fillP(ctx, ellP(top, r, ry, 0, 2 * Math.PI), AMB(a)); }
    const k = seg(t, t0, t0 + 1.2);
    curve(ctx, part(ellP(top, r, ry, 0, 2 * Math.PI, 40), k), a, 2921);
    curve(ctx, part(ellP(bot, r, ry, 0, Math.PI, 20), k), a, 2922); curve(ctx, part(ellP(bot, r, ry, Math.PI, 2 * Math.PI, 20), k), a, 2923, true);
    edge(ctx, [top[0] - r, top[1]], [bot[0] - r, bot[1]], a, k, 2924); edge(ctx, [top[0] + r, top[1]], [bot[0] + r, bot[1]], a, k, 2925);
  }
  function cone(ctx, env, t, t0, a, hl, lab) {
    const S = KD.L(env).SB, c = S.c, r = 1.5 * c, ry = 0.45 * c, h = 4.24 * c, T = [S.x, S.y - h / 2], bot = [S.x, S.y + h / 2];
    if (hl === 'side') fillP(ctx, [T, ...ellP(bot, r, ry, 0, Math.PI)], AMB(a));
    if (hl === 'circ') fillP(ctx, ellP(bot, r, ry, 0, 2 * Math.PI), AMB(a));
    const k = seg(t, t0, t0 + 1.2);
    curve(ctx, part(ellP(bot, r, ry, 0, Math.PI, 20), k), a, 2931, false, hl === 'circ' ? LI.AMBER_RGB : undefined); curve(ctx, part(ellP(bot, r, ry, Math.PI, 2 * Math.PI, 20), k), a, 2932, true);
    edge(ctx, T, [bot[0] - r, bot[1]], a, k, 2933, false, lab ? LI.AMBER_RGB : undefined); edge(ctx, T, [bot[0] + r, bot[1]], a, k, 2934);
    if (lab > 0) { dashL(ctx, T, bot, a * lab * 0.8, 2935); txt(ctx, env, [T[0] - r * 0.5 - 90, (T[1] + bot[1]) / 2 - 10], 'ana doğru', a * lab, true, 0.7); }
  }
  /* nets: shapes in units, fitted into NB */
  function fit(env, box) { const N = KD.L(env).NB, u = Math.min(N.w / (box[2] - box[0]), N.h / (box[3] - box[1])); return { u, M: (p) => [N.x + (p[0] - (box[0] + box[2]) / 2) * u, N.y + (p[1] - (box[1] + box[3]) / 2) * u] }; }
  function face(ctx, P, t, t0, a, hot, seed) {
    const k = seg(t, t0, t0 + 0.5); if (a <= 0 || k <= 0) return;
    if (hot > 0) fillP(ctx, P, AMB(a * hot));
    const Q = P.concat([P[0]]); Ink.path(ctx, Q.slice(0, Math.max(2, Math.ceil(Q.length * k))), { w: 3.5, alpha: a, seed, taper: [0, 0] });
  }
  function prismNet(ctx, env, t, t0, a, hl) {
    const h = 2.6, { u, M } = fit(env, [0, -h, 9, 4 + h]);
    const R = (x) => [[x, 0], [x + 3, 0], [x + 3, 4], [x, 4]].map(M);
    [0, 3, 6].forEach((x, i) => face(ctx, R(x), t, t0 + i * 0.5, a, hl.rect, 2940 + i));
    face(ctx, [[3, 0], [6, 0], [4.5, -h]].map(M), t, t0 + 1.6, a, hl.tri, 2944);
    face(ctx, [[3, 4], [6, 4], [4.5, 4 + h]].map(M), t, t0 + 2.1, a, hl.tri, 2945);
    return { u, M };
  }
  function pyrNet(ctx, env, t, t0, a, hl) {
    const s1 = 4.27, s2 = 4.47, { M } = fit(env, [-s2, -s1, 4 + s2, 3 + s1]);
    face(ctx, [[0, 0], [4, 0], [4, 3], [0, 3]].map(M), t, t0, a, hl.base, 2950);
    face(ctx, [[0, 0], [4, 0], [2, -s1]].map(M), t, t0 + 0.6, a, hl.tri, 2951);
    face(ctx, [[4, 0], [4, 3], [4 + s2, 1.5]].map(M), t, t0 + 1.0, a, hl.tri, 2952);
    face(ctx, [[0, 3], [4, 3], [2, 3 + s1]].map(M), t, t0 + 1.4, a, hl.tri, 2953);
    face(ctx, [[0, 0], [0, 3], [-s2, 1.5]].map(M), t, t0 + 1.8, a, hl.tri, 2954);
  }
  function cylNet(ctx, env, t, t0, a, hl) {
    const W = 3 * Math.PI, { u, M } = fit(env, [0, -3, W, 7]);
    const k = seg(t, t0, t0 + 4.0), x = W * k;
    if (hl.side > 0) fillP(ctx, [[0, 0], [x, 0], [x, 4], [0, 4]].map(M), AMB(a * hl.side));
    if (k > 0 && a > 0) {
      Ink.path(ctx, [M([0, 0]), M([Math.max(0.01, x), 0])], { w: 3.5, alpha: a, seed: 2960, taper: [0, 0] });
      Ink.path(ctx, [M([0, 4]), M([Math.max(0.01, x), 4])], { w: 3.5, alpha: a, seed: 2961, taper: [0, 0] });
      Ink.path(ctx, [M([0, 0]), M([0, 4])], { w: 3.5, alpha: a, seed: 2962, taper: [0, 0] });
      if (k >= 1) Ink.path(ctx, [M([W, 0]), M([W, 4])], { w: 3.5, alpha: a, seed: 2963, taper: [0, 0] });
      // the rolling circle
      const rr = a * (1 - seg(t, t0 + 4.1, t0 + 4.5)); if (rr > 0) { const C = M([x, -1.5]), ang = -x / 1.5; curve(ctx, ellP(C, 1.5 * u, 1.5 * u, 0, 2 * Math.PI, 36), rr, 2964, false, LI.AMBER_RGB, 3); const d = [C[0] + 1.5 * u * Math.cos(ang + Math.PI / 2), C[1] + 1.5 * u * Math.sin(ang + Math.PI / 2)]; dot(ctx, d, rr, LI.AMBER_RGB); }
    }
    const kc = seg(t, t0 + 4.4, t0 + 5.4); if (kc > 0 && a > 0) {
      [[1.5, -1.5], [1.5, 5.5]].forEach(([cx, cy], i) => { const C = M([cx, cy]); if (hl.circ > 0) fillP(ctx, ellP(C, 1.5 * u, 1.5 * u, 0, 2 * Math.PI), AMB(a * hl.circ)); curve(ctx, part(ellP(C, 1.5 * u, 1.5 * u, -Math.PI / 2, 1.5 * Math.PI, 40), kc), a, 2966 + i, false, hl.rim ? LI.AMBER_RGB : undefined); });
    }
    return { u, M, W };
  }
  function coneNet(ctx, env, t, t0, a, hl) {
    const l = 4.5, th = 2 * Math.PI / 3, s = Math.sin(th / 2) * l, { u, M } = fit(env, [-s, 0, s, l + 3.1]);
    const O = M([0, 0]), u0 = Math.PI / 2 - th / 2, u1 = Math.PI / 2 + th / 2;
    const k = seg(t, t0, t0 + 2.2);
    if (hl.side > 0) fillP(ctx, [O, ...ellP(O, l * u, l * u, u0, u1)], AMB(a * hl.side));
    if (a > 0 && k > 0) {
      edge(ctx, O, [O[0] + l * u * Math.cos(u0), O[1] + l * u * Math.sin(u0)], a, seg(t, t0, t0 + 0.5), 2970);
      curve(ctx, part(ellP(O, l * u, l * u, u0, u1, 36), seg(t, t0 + 0.5, t0 + 1.7)), a, 2971, false, hl.rim ? LI.AMBER_RGB : undefined, hl.rim ? 5 : 3.5);
      edge(ctx, O, [O[0] + l * u * Math.cos(u1), O[1] + l * u * Math.sin(u1)], a, seg(t, t0 + 1.7, t0 + 2.2), 2972);
    }
    const kc = seg(t, t0 + 2.6, t0 + 3.4); if (kc > 0 && a > 0) { const C = M([0, l + 1.55]); if (hl.circ > 0) fillP(ctx, ellP(C, 1.5 * u, 1.5 * u, 0, 2 * Math.PI), AMB(a * hl.circ)); curve(ctx, part(ellP(C, 1.5 * u, 1.5 * u, -Math.PI / 2, 1.5 * Math.PI, 40), kc), a, 2973, false, hl.rim ? LI.AMBER_RGB : undefined, hl.rim ? 5 : 3.5); }
    const lab = a * hl.lab; if (lab > 0) txt(ctx, env, [O[0] + l * u * 0.5 * Math.cos(u1) - 40, O[1] + l * u * 0.5 * Math.sin(u1)], 'ana doğru', lab, true, 0.7);
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bir cismi açarsak hangi şekiller çıkar?'],
      [10.6, 27.8, 'Dik üçgen prizma'],
      [28.4, 45.8, 'Dikdörtgen dik piramit'],
      [46.4, 63.8, 'Dik dairesel silindir'],
      [64.4, 79.8, 'Dik dairesel koni'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t);
    const w = (x, y) => win(t, x, y);
    // prism
    const aP = a * w(5.0, 27.8), hlP = { tri: w(15.2, 19.8), rect: w(20.0, 24.6) };
    prism(ctx, env, t, 5.2, aP, hlP.tri > 0.5 ? 'tri' : hlP.rect > 0.5 ? 'rect' : '');
    prismNet(ctx, env, t, 11.0, aP, hlP);
    tally(ctx, env, t, [[11.4, 27.8, 'Dik üçgen prizmayı açtık'], [15.2, 27.8, '2 eş üçgen: tabanlar'], [20.0, 27.8, '3 dikdörtgen: yan yüzler'], [22.4, 27.8, 'Enler = taban kenarları', true]]);
    // pyramid
    const aY = a * w(28.8, 45.8), hlY = { base: w(34.6, 38.2), tri: w(38.4, 45.8) };
    pyramid(ctx, env, t, 28.8, aY, hlY.base > 0.5 ? 'base' : hlY.tri > 0.5 ? 'tri' : '');
    pyrNet(ctx, env, t, 31.0, aY, hlY);
    tally(ctx, env, t, [[31.4, 45.8, 'Dikdörtgen dik piramidi açtık'], [34.6, 45.8, '1 dikdörtgen: taban'], [38.4, 45.8, '4 ikizkenar üçgen: yan yüzler'], [41.0, 45.8, 'Karşılıklı üçgenler eş', true]]);
    // cylinder
    const aC = a * w(46.8, 63.8), hlC = { circ: w(55.0, 58.6), side: w(58.8, 63.8), rim: t > 58.8 && t < 63.8 };
    cylinder(ctx, env, t, 46.8, aC, hlC.circ > 0.5 ? 'circ' : hlC.side > 0.5 ? 'side' : '');
    cylNet(ctx, env, t, 49.0, aC, hlC);
    tally(ctx, env, t, [[49.4, 63.8, 'Yan yüz açılınca: dikdörtgen'], [53.6, 63.8, '2 eş daire: tabanlar'], [55.8, 63.8, 'Dikdörtgenin eni = yükseklik'], [58.8, 63.8, 'Boyu = taban çevresi: 2πr', true]]);
    // cone
    const aK = a * w(64.8, 79.8), hlK = { side: w(67.0, 70.6), circ: 0, rim: t > 72.4 && t < 79.8, lab: w(71.0, 79.8) };
    cone(ctx, env, t, 64.8, aK, hlK.side > 0.5 ? 'side' : '', hlK.lab);
    coneNet(ctx, env, t, 67.0, aK, hlK);
    tally(ctx, env, t, [[67.4, 79.8, 'Yan yüz: daire dilimi'], [69.8, 79.8, '1 daire: taban'], [71.0, 79.8, 'Dilimin yarıçapı = ana doğru'], [72.6, 79.8, 'Yay uzunluğu = taban çevresi', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Kenarlarından kesip düzleme açalım'],
      [11.4, 27.8, 'Her yüz açınımda bir şekil oluyor'],
      [29.4, 45.8, 'Tepe noktası tabanın ortasının tam üstünde'],
      [47.4, 63.8, 'Silindirin yan yüzünü açalım'],
      [65.4, 79.8, 'Koninin yan yüzünü açalım']]);
    exprs(ctx, t, at(W, 1), [[19.4, 27.8, 'Yan yüzlerin boyu prizmanın yüksekliği'],
      [38.8, 45.8, 'Üçgenlerin tabanları dikdörtgenin kenarları'],
      [51.0, 63.8, 'Daire bir tur dönünce çevresi kadar yol alır'],
      [71.0, 79.8, 'Koninin tepe noktası dilimin merkezi oluyor']]);
    exprs(ctx, t, at(W, 2), [[24.6, 27.8, 'Taban beşgen olsa: 2 beşgen, 5 dikdörtgen', true], [42.4, 45.8, 'Kapanınca üçgenler tepede buluşur', true],
      [60.4, 63.8, 'Silindir: 2 eş daire ve 1 dikdörtgen', true], [74.6, 79.8, 'Koni: 1 daire ve 1 daire dilimi', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Prizma: 2 eş taban ve dikdörtgenler', 80.6], ['Piramit: 1 taban ve üçgenler', 81.6], ['Silindir: 2 daire ve 1 dikdörtgen', 82.6], ['Koni: 1 daire ve 1 daire dilimi!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A solid', nameTr: 'Cisim', concept: 'Cut it open', conceptTr: 'Kesip açalım', render });
})(window.LI = window.LI || {});
