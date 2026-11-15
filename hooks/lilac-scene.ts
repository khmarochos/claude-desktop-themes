// Фон теми «Бузок»: ледь помітне сяйво.
// Повільно дрейфують м'які зелені й бузкові відсвіти, а знизу вгору
// спливають кілька крихітних зелених цяточок, як пилок.
// Світлий і темний варіант обирає сам SVG за prefers-color-scheme.
// Лише SVG і CSS: без скриптів, нічого не завантажує.

const MOTES = [
  { x: 180, r: 2.2, dur: 46, delay: -4, sway: 18 },
  { x: 420, r: 1.6, dur: 58, delay: -31, sway: -14 },
  { x: 690, r: 2.6, dur: 52, delay: -18, sway: 22 },
  { x: 930, r: 1.8, dur: 64, delay: -47, sway: -20 },
  { x: 1150, r: 2.4, dur: 49, delay: -9, sway: 16 },
  { x: 1380, r: 1.5, dur: 61, delay: -36, sway: -12 },
  { x: 1520, r: 2.0, dur: 55, delay: -22, sway: 14 },
  { x: 290, r: 1.4, dur: 68, delay: -55, sway: 10 },
]

const motes = MOTES.map(
  (m, i) =>
    `<circle class="mote m${i}" cx="${m.x}" cy="1040" r="${m.r}"/>`,
).join('\n    ')

const moteStyles = MOTES.map(
  (m, i) => `.m${i} { animation: rise${i} ${m.dur}s linear ${m.delay}s infinite; }
    @keyframes rise${i} {
      0% { transform: translate(0, 0); opacity: 0; }
      10% { opacity: 1; }
      50% { transform: translate(${m.sway}px, -560px); }
      90% { opacity: 1; }
      100% { transform: translate(0, -1120px); opacity: 0; }
    }`,
).join('\n    ')

export const LILAC_SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="g1"><stop offset="0%" class="green" stop-opacity="1"/><stop offset="100%" class="green" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2"><stop offset="0%" class="lilac" stop-opacity="1"/><stop offset="100%" class="lilac" stop-opacity="0"/></radialGradient>
    <radialGradient id="g3"><stop offset="0%" class="mint" stop-opacity="1"/><stop offset="100%" class="mint" stop-opacity="0"/></radialGradient>
  </defs>
  <style>
    .base { fill: #f1edf6; }
    .green { stop-color: #2e9a52; }
    .mint { stop-color: #5fc98a; }
    .lilac { stop-color: #b9a3e0; }
    .glow-a { opacity: 0.22; }
    .glow-b { opacity: 0.35; }
    .glow-c { opacity: 0.18; }
    .mote { fill: #2e9a52; opacity: 0; }
    .motes { opacity: 0.5; }
    @media (prefers-color-scheme: dark) {
      .base { fill: #18141f; }
      .green { stop-color: #33c46a; }
      .mint { stop-color: #4fd08a; }
      .lilac { stop-color: #6b4fa0; }
      .glow-a { opacity: 0.17; }
      .glow-b { opacity: 0.30; }
      .glow-c { opacity: 0.13; }
      .mote { fill: #5fe08f; }
      .motes { opacity: 0.4; }
    }
    /* Плями мандрують по екрану... */
    .drift-a { animation: drift-a 26s ease-in-out infinite alternate; }
    .drift-b { animation: drift-b 34s ease-in-out infinite alternate; }
    .drift-c { animation: drift-c 30s ease-in-out infinite alternate; }
    @keyframes drift-a {
      0% { transform: translate(0, 0); }
      50% { transform: translate(380px, 90px); }
      100% { transform: translate(180px, 300px); }
    }
    @keyframes drift-b {
      0% { transform: translate(0, 0); }
      50% { transform: translate(-420px, 160px); }
      100% { transform: translate(-200px, -60px); }
    }
    @keyframes drift-c {
      0% { transform: translate(0, 0); }
      50% { transform: translate(-360px, -140px); }
      100% { transform: translate(-120px, 120px); }
    }
    /* ...і водночас «дихають»: ростуть, стискаються, яскравішають. */
    .breathe { transform-box: fill-box; transform-origin: 50% 50%; }
    .breathe-a { animation: breathe 9s ease-in-out infinite; }
    .breathe-b { animation: breathe 12s ease-in-out -4s infinite; }
    .breathe-c { animation: breathe 10s ease-in-out -7s infinite; }
    @keyframes breathe {
      0%, 100% { transform: scale(0.8, 0.85); opacity: 0.6; }
      50% { transform: scale(1.2, 1.12); opacity: 1; }
    }
    ${moteStyles}
    @media (prefers-reduced-motion: reduce) {
      .drift-a, .drift-b, .drift-c, .breathe, .mote { animation: none; }
      .mote { opacity: 0; }
    }
  </style>
  <rect class="base" width="1600" height="1000"/>
  <g class="glow-b drift-b"><ellipse class="breathe breathe-b" cx="1250" cy="220" rx="620" ry="420" fill="url(#g2)"/></g>
  <g class="glow-a drift-a"><ellipse class="breathe breathe-a" cx="260" cy="180" rx="560" ry="380" fill="url(#g1)"/></g>
  <g class="glow-c drift-c"><ellipse class="breathe breathe-c" cx="1350" cy="860" rx="520" ry="340" fill="url(#g3)"/></g>
  <g class="motes">
    ${motes}
  </g>
</svg>`
