// Індикатор роботи для теми «Термінал».
//
// Один цикл (8 с):
//   1. рядок друкується по літері, блимаючий курсор █ біжить за текстом;
//   2. несподіванка: курсорові нудно, він підстрибує, як м'ячик, і,
//      приземлившись, висипає дощ зелених символів;
//   3. короткий збій кінескопа: текст смикається з кольоровими «привидами»;
//   4. рядок стирається, і все починається знову.
// Лише SVG і CSS: без скриптів, нічого не завантажує.

const LABELS: Record<string, string> = {
  thinking: 'ДУМАЮ',
  responding: 'ПИШУ',
  'tool-use': 'ВИКОНУЮ',
  'tool-input': 'ГОТУЮ',
  requesting: "З'ЄДНУЮСЬ",
}

const CYCLE = 8 // секунд
const STEP = 0.07 // секунд на літеру
const CW = 9 // ширина літери моноширинного шрифту 15px
const X0 = 4
const BASE = 28
const HEIGHT = 54
const GLYPHS = ['0', '1', 'ж', 'λ', 'ї', '#', '1', '0', 'Ω', '$']

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function pct(seconds: number): string {
  return `${Math.min(99, (seconds / CYCLE) * 100).toFixed(2)}%`
}

export function spinnerText(mode: string, word: string, message: string | null): string {
  const label = LABELS[mode] ?? 'ПРАЦЮЮ'
  const raw = (message ?? word).trim()
  const detail = raw === '' || raw === 'Working' ? '' : raw
  const short = detail.length > 30 ? `${detail.slice(0, 29)}…` : detail

  return short === '' ? `> ${label}` : `> ${label} · ${short}`
}

export function cursorSpinner(text: string): { source: string; width: number; height: number } {
  const chars = [...text]
  const n = chars.length
  const xEnd = X0 + n * CW + 2
  const width = xEnd + CW + 48
  const typed = n * STEP

  const letters = chars
    .map((c, i) => {
      const x = X0 + i * CW

      return c === ' '
        ? ''
        : `<text class="ch" x="${x}" y="${BASE}" style="animation-delay:${(i * STEP).toFixed(2)}s">${esc(c)}</text>`
    })
    .join('')

  const glyphs = GLYPHS.slice(0, 7)
    .map((g, i) => {
      const dx = i * 5
      const delay = (i % 3) * 0.12

      return `<text class="drop d${i}" x="${xEnd + 4 + dx}" y="${BASE}" style="animation-delay:${delay.toFixed(2)}s">${esc(g)}</text>`
    })
    .join('')

  const dropKeys = GLYPHS.slice(0, 7)
    .map((_, i) => {
      const fall = 12 + ((i * 7) % 11)
      const turn = (i % 2 === 0 ? 1 : -1) * (20 + i * 9)

      return `@keyframes d${i} {
        0%, ${pct(4.9)} { opacity: 0; transform: translate(0, 0) rotate(0deg); }
        ${pct(5.0)} { opacity: 1; transform: translate(0, -6px) rotate(0deg); }
        ${pct(6.3)} { opacity: 0; transform: translate(${(i - 2) * 4}px, ${fall}px) rotate(${turn}deg); }
        100% { opacity: 0; }
      }
      .d${i} { animation-name: d${i}; }`
    })
    .join('\n')

  const source = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${HEIGHT}" viewBox="0 0 ${width} ${HEIGHT}">
  <style>
    text { font: 600 15px ui-monospace, "SF Mono", Menlo, monospace; fill: #5cff7a; }
    .glow { filter: drop-shadow(0 0 3px rgba(92, 255, 122, 0.55)); }
    .ch { opacity: 0; animation: type ${CYCLE}s linear infinite; }
    @keyframes type {
      0% { opacity: 0; } 0.8% { opacity: 1; } 93% { opacity: 1; } 94.5% { opacity: 0; } 100% { opacity: 0; }
    }
    .walk { animation: walk ${CYCLE}s steps(1, end) infinite; }
    @keyframes walk {
      ${chars.map((_, i) => `${pct(i * STEP)} { transform: translateX(${-(n - i) * CW}px); }`).join('\n      ')}
      ${pct(typed)}, 94% { transform: translateX(0); }
      95%, 100% { transform: translateX(${-n * CW}px); }
    }
    .hop { animation: hop ${CYCLE}s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
    @keyframes hop {
      0%, ${pct(3.2)} { transform: translateY(0) scale(1, 1); }
      ${pct(3.35)} { transform: translateY(0) scale(1.25, 0.7); }
      ${pct(3.7)} { transform: translateY(-15px) scale(0.85, 1.15); }
      ${pct(4.05)} { transform: translateY(0) scale(1.2, 0.8); }
      ${pct(4.35)} { transform: translateY(-8px) scale(0.9, 1.1); }
      ${pct(4.6)} { transform: translateY(0) scale(1.15, 0.85); }
      ${pct(4.8)} { transform: translateY(-3px) scale(1, 1); }
      ${pct(4.95)}, 100% { transform: translateY(0) scale(1, 1); }
    }
    .blink { animation: blink 1s steps(1, end) infinite; }
    @keyframes blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
    .solid { opacity: 0; animation: solid ${CYCLE}s steps(1, end) infinite; }
    @keyframes solid { 0% { opacity: 0; } ${pct(3.2)} { opacity: 1; } ${pct(5.0)}, 100% { opacity: 0; } }
    .drop { opacity: 0; font-size: 13px; animation-duration: ${CYCLE}s; animation-timing-function: ease-in; animation-iteration-count: infinite; transform-box: fill-box; transform-origin: 50% 50%; }
    ${dropKeys}
    .jolt { animation: jolt ${CYCLE}s linear infinite; }
    @keyframes jolt {
      0%, ${pct(6.6)} { transform: translateX(0); }
      ${pct(6.65)} { transform: translateX(-3px) skewX(-8deg); }
      ${pct(6.72)} { transform: translateX(4px); }
      ${pct(6.8)} { transform: translateX(-1px) skewX(6deg); }
      ${pct(6.88)}, 100% { transform: translateX(0); }
    }
    .ghost { opacity: 0; animation: ghost ${CYCLE}s linear infinite; }
    .ghost.m text { fill: #ff3df0; }
    .ghost.c text { fill: #3df0ff; }
    .ghost.m { --dx: -3px; }
    .ghost.c { --dx: 3px; }
    @keyframes ghost {
      0%, ${pct(6.6)} { opacity: 0; transform: translateX(0); }
      ${pct(6.65)} { opacity: 0.7; transform: translateX(var(--dx)); }
      ${pct(6.9)} { opacity: 0; transform: translateX(0); }
      100% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ch { animation: none; opacity: 1; }
      .walk, .hop, .drop, .jolt, .ghost, .solid { animation: none; }
      .drop, .ghost, .solid { opacity: 0; }
    }
  </style>
  <g class="ghost m"><text x="${X0}" y="${BASE}">${esc(text)}</text></g>
  <g class="ghost c"><text x="${X0}" y="${BASE}">${esc(text)}</text></g>
  <g class="jolt glow">
    ${letters}
    <g class="walk"><g class="hop"><rect class="blink" x="${xEnd}" y="${BASE - 13}" width="${CW}" height="16" fill="#5cff7a"/><rect class="solid" x="${xEnd}" y="${BASE - 13}" width="${CW}" height="16" fill="#5cff7a"/></g></g>
  </g>
  <g class="glow">${glyphs}</g>
</svg>`

  return { source, width, height: HEIGHT }
}
