import type { Register, ThemeBackdrop, ThemeSetArgs } from 'claude-code'

import { CRT_SCENE } from './crt-scene'
import { cursorSpinner, spinnerText } from './cursor-spinner'
import { makeColors } from './make-colors.js'

type Look = { title: string; spec: Parameters<typeof makeColors>[0]; backdrop?: ThemeBackdrop }

const CRT = 'crt'

// Кожна тема має світлий і темний варіант.
const LOOKS: Record<string, Look> = {
  paper: {
    title: 'Папір — тепла сторінка вдень, лампа вночі',
    spec: {
      label: 'Папір',
      roles: { accent: '#2f5d8c', danger: '#b3392f', success: '#4e7d3a', warning: '#a86f14', pro: '#6d4f94' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#efe6d3',
            'surface-1': '#f4ecdc',
            'surface-2': '#faf5e9',
            'text-primary': '#2a241d',
            'text-secondary': '#544a3d',
            'text-muted': '#6a5f50',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#1f1a15',
            'surface-1': '#28221b',
            'surface-2': '#312a22',
            'surface-3': '#3a3229',
            'text-primary': '#f0e7d7',
            'text-secondary': '#cfc4b2',
            'text-muted': '#aca08d',
          },
        },
      },
    },
  },
  midnight: {
    title: 'Північ — холодний синій',
    spec: {
      label: 'Північ',
      roles: { accent: '#4f7bd9', danger: '#c8414b', success: '#3f9a6b', warning: '#c08a1e', pro: '#8a63d2' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#e3e8f2',
            'surface-1': '#eaeef6',
            'surface-2': '#f3f6fb',
            'text-primary': '#141b2b',
            'text-secondary': '#36405a',
            'text-muted': '#4f5a74',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#0f1422',
            'surface-1': '#151b2c',
            'surface-2': '#1b2236',
            'surface-3': '#212940',
            'text-primary': '#e6ebf7',
            'text-secondary': '#bcc5dc',
            'text-muted': '#98a3bf',
          },
        },
      },
    },
  },
  forest: {
    title: 'Ліс — мох і хвоя',
    spec: {
      label: 'Ліс',
      roles: { accent: '#3d7a5a', danger: '#b5443a', success: '#5a8a2e', warning: '#a87a1a', pro: '#7a5a92' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#e4eadf',
            'surface-1': '#ebf0e6',
            'surface-2': '#f4f7f0',
            'text-primary': '#18221a',
            'text-secondary': '#3a4a3d',
            'text-muted': '#516253',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#121a15',
            'surface-1': '#18221b',
            'surface-2': '#1e2a22',
            'surface-3': '#243128',
            'text-primary': '#e4ede5',
            'text-secondary': '#bccbbf',
            'text-muted': '#97a89a',
          },
        },
      },
    },
  },
  field: {
    title: 'Поле — небо і соняшники',
    spec: {
      label: 'Поле',
      roles: { accent: '#2b6cb0', danger: '#b83a3a', success: '#4a8a3a', warning: '#c99a12', pro: '#6e58b0' },
      light: {
        gray: {
          anchors: {
            'surface-0': '#eef0e6',
            'surface-1': '#f3f5ec',
            'surface-2': '#fafbf4',
            'text-primary': '#1c2230',
            'text-secondary': '#3c4456',
            'text-muted': '#555d6e',
          },
        },
      },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#11161f',
            'surface-1': '#171d28',
            'surface-2': '#1d2431',
            'surface-3': '#232b39',
            'text-primary': '#eef1e6',
            'text-secondary': '#c7ccbf',
            'text-muted': '#a2a99b',
          },
        },
      },
    },
  },
  terminal: {
    title: 'Термінал — зелений люмінофор на чорному (лише темна)',
    spec: {
      label: 'Термінал',
      only: 'dark',
      contrast: 'more',
      roles: { accent: '#33ff66', danger: '#ff5a4a', success: '#7dff4a', warning: '#ffc23a', pro: '#4af0d0' },
      dark: {
        gray: {
          anchors: {
            'surface-0': '#050a06',
            'surface-1': '#08110a',
            'surface-2': '#0c170e',
            'surface-3': '#101d12',
            'text-primary': '#5cff7a',
            'text-secondary': '#3fd65f',
            'text-muted': '#2fae4b',
          },
        },
      },
    },
    // Панелі ледь прозорі, щоб скан-лінії просвічували, але текст лишався чітким.
    backdrop: { scene: CRT, glass: { blur: 3, tint: '#050a06', opacity: 0.72 } },
  },
}

const DEFAULT = 'paper'
const STORE_KEY = 'theme'

// Яка тема ввімкнена зараз; session.start ставить її знову після перезавантаження.
let active = DEFAULT

function build(name: string): { look: ThemeSetArgs; blocker?: string } {
  const chosen = LOOKS[name] ?? LOOKS[DEFAULT]!
  const { theme, problems } = makeColors(chosen.spec)
  const blocker = problems.find(line => line.startsWith("Desktop won't paint"))
  const look: ThemeSetArgs =
    chosen.backdrop === undefined ? { colors: theme } : { colors: theme, backdrop: chosen.backdrop }

  return { look, blocker }
}

function listing(current: string): string {
  return Object.entries(LOOKS)
    .map(([name, l]) => `${name === current ? '●' : '○'} ${name} — ${l.title}`)
    .concat('○ off — повернути стандартну тему')
    .join('\n')
}

export const register: Register = on => {
  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (
      (e.surface !== 'desktop' && e.surface !== 'mobile') ||
      e.props.plugin !== 'desktop-themes' ||
      e.props.scene !== CRT
    ) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={CRT_SCENE} alt="Екран старого CRT-монітора зі скан-лініями" isInteractive />
  })

  // Замість помаранчевих крапок Claude: курсор-непосида, лише в темі «Термінал».
  on('ui.render', { component: 'Spinner' }, ($, e, next) => {
    if (e.surface !== 'desktop' || active !== 'terminal') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const text = spinnerText(e.props.mode, e.props.word, e.props.message)
    const { source, width, height } = cursorSpinner(text)

    return <Svg source={source} alt={text} width={width} height={height} isInteractive />
  })

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'theme-custom',
      description: 'Змінити тему: /theme-custom paper | midnight | forest | field | terminal | off',
    })

    const saved = await $.store.get(STORE_KEY)

    active = typeof saved === 'string' && (saved in LOOKS || saved === 'off') ? saved : DEFAULT

    if (saved !== 'off') {
      const name = active
      const { look, blocker } = build(name)

      if (blocker !== undefined) {
        $.ui.toast(blocker)
      }
      await $.theme.set(look)
    }

    return next(e)
  })

  on('command.run', { command: 'theme-custom' }, async ($, e) => {
    const wanted = e.args.trim().toLowerCase()
    const saved = await $.store.get(STORE_KEY)
    const current = typeof saved === 'string' ? saved : DEFAULT

    if (wanted === '') {
      return { text: `Теми (зараз: ${current}):\n${listing(current)}` }
    }

    if (wanted === 'off') {
      await $.theme.clear()
      await $.store.set(STORE_KEY, 'off')
      active = 'off'

      return { text: 'Повернуто стандартну тему Claude.' }
    }

    if (!(wanted in LOOKS)) {
      return { text: `Немає теми «${wanted}».\n${listing(current)}` }
    }

    const { look, blocker } = build(wanted)

    if (blocker !== undefined) {
      return { text: `Desktop не намалює цю тему: ${blocker}` }
    }
    const set = await $.theme.set(look)
    await $.store.set(STORE_KEY, wanted)
    active = wanted

    return {
      text: set.isDrawn
        ? `Тему змінено: ${LOOKS[wanted]?.title ?? wanted}`
        : `Тему збережено, але тут вона не малюється: ${set.reason}`,
    }
  })
}
