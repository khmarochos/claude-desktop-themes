// Індикатор роботи для теми «Термінал»: лише курсор █, без написів.
//
// Один цикл: курсор блимає 5 разів, потім один раз підскакує
// (присідає, злітає, приземляється з приплющенням), і все спочатку.
// Лише SVG і CSS: без скриптів, нічого не завантажує.

const LABELS: Record<string, string> = {
  thinking: 'Думаю',
  responding: 'Пишу',
  'tool-use': 'Виконую',
  'tool-input': 'Готую',
  requesting: "З'єднуюсь",
}

const BLINKS = 5
const PERIOD = 1 // секунда на одне блимання
const HOP = 0.9 // секунд на стрибок
const CYCLE = BLINKS * PERIOD + HOP

const W = 10 // ширина курсора
const H = 18 // висота курсора
const LIFT = 14 // висота стрибка
const WIDTH = W + 8
const HEIGHT = H + LIFT + 8
const X = 4
const Y = HEIGHT - H - 3

function pct(seconds: number): string {
  return `${((seconds / CYCLE) * 100).toFixed(2)}%`
}

// Що прочитає екранний диктор: стан роботи, адже напису на екрані немає.
export function spinnerText(mode: string, word: string, message: string | null): string {
  const label = LABELS[mode] ?? 'Працюю'
  const raw = (message ?? word).trim()

  return raw === '' || raw === 'Working' ? label : `${label}: ${raw}`
}

export function cursorSpinner(): { source: string; width: number; height: number } {
  const blink: string[] = []

  for (let i = 0; i < BLINKS; i++) {
    blink.push(`${pct(i * PERIOD)} { opacity: 1; }`)
    blink.push(`${pct(i * PERIOD + PERIOD * 0.55)} { opacity: 0; }`)
  }
  blink.push(`${pct(BLINKS * PERIOD)}, 100% { opacity: 1; }`)

  const t0 = BLINKS * PERIOD
  const source = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <style>
    .cur { fill: #5cff7a; filter: drop-shadow(0 0 3px rgba(92, 255, 122, 0.6)); }
    .blink { animation: blink ${CYCLE}s steps(1, end) infinite; }
    @keyframes blink {
      ${blink.join('\n      ')}
    }
    .hop { animation: hop ${CYCLE}s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
    @keyframes hop {
      0%, ${pct(t0)} { transform: translateY(0) scale(1, 1); }
      ${pct(t0 + HOP * 0.15)} { transform: translateY(0) scale(1.3, 0.7); }
      ${pct(t0 + HOP * 0.5)} { transform: translateY(-${LIFT}px) scale(0.85, 1.15); }
      ${pct(t0 + HOP * 0.8)} { transform: translateY(0) scale(1.25, 0.75); }
      ${pct(t0 + HOP * 0.92)} { transform: translateY(0) scale(0.95, 1.05); }
      100% { transform: translateY(0) scale(1, 1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .hop { animation: none; }
    }
  </style>
  <g class="hop"><rect class="cur blink" x="${X}" y="${Y}" width="${W}" height="${H}"/></g>
</svg>`

  return { source, width: WIDTH, height: HEIGHT }
}
