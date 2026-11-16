// Фон теми «Бузок»: ледь помітне сяйво.
// Повільно дрейфують м'які зелені й бузкові відсвіти, а знизу вгору
// спливають кілька крихітних зелених цяточок, як пилок.
// Світлий і темний варіант обирає сам SVG за prefers-color-scheme.
// Рух зроблено на SMIL (<animate>, <animateTransform>), а не на CSS:
// Desktop без апаратного прискорення не оновлює CSS-анімації фону.
// Лише SVG: без скриптів, нічого не завантажує.

// М'яке «туди й назад», як ease-in-out у CSS.
const EASE = '0.42 0 0.58 1'

// Description: builds a keySplines value with one ease segment per interval.
// Inputs: count — the number of values in the animation.
// Outputs: the keySplines string.
function splines(count: number): string {
  return Array.from({ length: count - 1 }, () => EASE).join(';')
}

// Дрейф плями: точки шляху, які вона проходить туди й назад (як alternate у CSS).
type Glow = {
  cls: string
  cx: number
  cy: number
  rx: number
  ry: number
  fill: string
  path: [number, number][]
  drift: number
  breathe: number
  breatheDelay: number
}

const GLOWS: Glow[] = [
  { cls: 'glow-b', cx: 1250, cy: 220, rx: 620, ry: 420, fill: 'g2', path: [[0, 0], [-420, 160], [-200, -60]], drift: 21, breathe: 8, breatheDelay: -4 },
  { cls: 'glow-a', cx: 260, cy: 180, rx: 560, ry: 380, fill: 'g1', path: [[0, 0], [380, 90], [180, 300]], drift: 16, breathe: 6, breatheDelay: 0 },
  { cls: 'glow-c', cx: 1350, cy: 860, rx: 520, ry: 340, fill: 'g3', path: [[0, 0], [-360, -140], [-120, 120]], drift: 18, breathe: 7, breatheDelay: -7 },
]

// Description: draws one glow that drifts along its path and "breathes".
// Inputs: g — the glow's geometry and timings.
// Outputs: the SVG markup of the glow.
function glow(g: Glow): string {
  // Туди й назад: 0 → 1 → 2 → 1 → 0, тож цикл удвічі довший за один прохід.
  const there = g.path.map(([x, y]) => `${x} ${y}`)
  const values = [...there, ...there.slice(0, -1).reverse()]
  const begin = `${g.breatheDelay}s`
  const breathe = (attr: string, base: number, lo: number, hi: number) =>
    `<animate attributeName="${attr}" values="${base * lo};${base * hi};${base * lo}" dur="${g.breathe}s" begin="${begin}" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="${splines(3)}"/>`

  return `<g class="${g.cls}">
    <g>
      <animateTransform attributeName="transform" type="translate" values="${values.join(';')}" dur="${g.drift * 2}s" repeatCount="indefinite" calcMode="spline" keySplines="${splines(values.length)}"/>
      <ellipse cx="${g.cx}" cy="${g.cy}" rx="${g.rx * 0.8}" ry="${g.ry * 0.85}" opacity="0.6" fill="url(#${g.fill})">
        ${breathe('rx', g.rx, 0.8, 1.2)}
        ${breathe('ry', g.ry, 0.85, 1.12)}
        <animate attributeName="opacity" values="0.6;1;0.6" dur="${g.breathe}s" begin="${begin}" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="${splines(3)}"/>
      </ellipse>
    </g>
  </g>`
}

const MOTES = [
  { x: 180, r: 2.2, dur: 28, delay: -4, sway: 18 },
  { x: 420, r: 1.6, dur: 35, delay: -31, sway: -14 },
  { x: 690, r: 2.6, dur: 31, delay: -18, sway: 22 },
  { x: 930, r: 1.8, dur: 38, delay: -47, sway: -20 },
  { x: 1150, r: 2.4, dur: 29, delay: -9, sway: 16 },
  { x: 1380, r: 1.5, dur: 37, delay: -36, sway: -12 },
  { x: 1520, r: 2.0, dur: 33, delay: -22, sway: 14 },
  { x: 290, r: 1.4, dur: 41, delay: -55, sway: 10 },
]

const motes = MOTES.map(
  m => `<circle class="mote" cx="${m.x}" cy="1040" r="${m.r}" opacity="0">
      <animateTransform attributeName="transform" type="translate" values="0 0;${m.sway} -560;0 -1120" keyTimes="0;0.5;1" dur="${m.dur}s" begin="${m.delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="${m.dur}s" begin="${m.delay}s" repeatCount="indefinite"/>
    </circle>`,
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
    .glow-a { opacity: 0.42; }
    .glow-b { opacity: 0.55; }
    .glow-c { opacity: 0.38; }
    .mote { fill: #2e9a52; }
    .motes { opacity: 0.85; }
    @media (prefers-color-scheme: dark) {
      .base { fill: #18141f; }
      .green { stop-color: #33c46a; }
      .mint { stop-color: #4fd08a; }
      .lilac { stop-color: #6b4fa0; }
      .glow-a { opacity: 0.34; }
      .glow-b { opacity: 0.48; }
      .glow-c { opacity: 0.30; }
      .mote { fill: #5fe08f; }
      .motes { opacity: 0.75; }
    }
    /* SMIL не зупинити з CSS, тож за «менше руху» ховаємо цяточки. */
    @media (prefers-reduced-motion: reduce) {
      .motes { display: none; }
    }
  </style>
  <rect class="base" width="1600" height="1000"/>
  ${GLOWS.map(glow).join('\n  ')}
  <g class="motes">
    ${motes}
  </g>
</svg>`
