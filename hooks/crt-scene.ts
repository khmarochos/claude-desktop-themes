// Фон «старий CRT-монітор»: скан-лінії, легке мерехтіння, світна смуга,
// що повільно котиться екраном, і затемнені кути кінескопа.
// Лише SVG і CSS: без скриптів, нічого не завантажує.
export const CRT_SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="tube" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#0b1a0e"/>
      <stop offset="60%" stop-color="#061009"/>
      <stop offset="100%" stop-color="#010302"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
      <stop offset="65%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
    </radialGradient>
    <linearGradient id="roll" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5cff7a" stop-opacity="0"/>
      <stop offset="50%" stop-color="#5cff7a" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#5cff7a" stop-opacity="0"/>
    </linearGradient>
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" fill="#000" fill-opacity="0.38"/>
      <rect y="2" width="4" height="2" fill="#2fff5a" fill-opacity="0.025"/>
    </pattern>
  </defs>
  <style>
    .glow { animation: flicker 4.5s steps(1, end) infinite; }
    .roll { animation: roll 9s linear infinite; }
    @keyframes flicker {
      0%, 100% { opacity: 1; }
      7% { opacity: 0.93; }
      8% { opacity: 1; }
      43% { opacity: 0.96; }
      44% { opacity: 1; }
      71% { opacity: 0.9; }
      72% { opacity: 1; }
    }
    @keyframes roll {
      from { transform: translateY(-260px); }
      to { transform: translateY(1000px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .glow, .roll { animation: none; }
    }
  </style>
  <rect width="1600" height="1000" fill="url(#tube)"/>
  <g class="glow">
    <rect width="1600" height="1000" fill="#33ff66" fill-opacity="0.03"/>
  </g>
  <rect class="roll" width="1600" height="260" fill="url(#roll)"/>
  <rect width="1600" height="1000" fill="url(#scan)"/>
  <rect width="1600" height="1000" fill="url(#vignette)"/>
</svg>`
