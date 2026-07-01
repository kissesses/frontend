import { createTheme } from '@mantine/core'

import { createVariantColorResolver } from '../create-variant-resolver'

import noctisOverrides from './noctis/overrides'

export const noctisTheme = createTheme({
    variantColorResolver: createVariantColorResolver(),
    components: noctisOverrides,
    cursorType: 'pointer',
    fontFamily:
        'Inter, Vazirmatn, Apple Color Emoji, Noto Sans SC, Twemoji Country Flags, sans-serif',
    fontFamilyMonospace: 'Fira Mono, monospace',
    breakpoints: {
        xs: '30em',
        sm: '40em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        '3xl': '120em',
        '4xl': '160em'
    },
    scale: 1,
    fontSmoothing: true,
    focusRing: 'never',
    white: '#ffffff',
    black: '#0a0a0b',
    colors: {
        dark: [
            '#fafafa',
            '#e4e4e7',
            '#a1a1aa',
            '#71717a',
            '#52525b',
            '#3f3f46',
            '#27272a',
            '#1c1c1f',
            '#141416',
            '#0a0a0b'
        ],
        violet: [
            '#f5f3ff',
            '#ede9fe',
            '#ddd6fe',
            '#c4b5fd',
            '#a78bfa',
            '#8C69FB',
            '#694bca',
            '#58389a',
            '#4c1d95',
            '#2e1065'
        ],
        'shaded-gray': [
            '#f5f5f5',
            '#ececec',
            '#d9d9d9',
            '#c4c4c4',
            '#a8a8a8',
            '#8f8f8f',
            '#737373',
            '#5c5c5c',
            '#404040',
            '#262626'
        ]
    },
    primaryShade: { light: 6, dark: 5 },
    primaryColor: 'violet',
    autoContrast: true,
    luminanceThreshold: 0.35,
    headings: {
        fontWeight: '500'
    },
    defaultRadius: 'md',
    radius: {
        xs: '6px',
        sm: '8px',
        md: '10px',
        lg: '15px',
        xl: '20px'
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    },
    shadows: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.24)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.28)',
        md: '0 4px 12px rgba(0, 0, 0, 0.32)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.36)',
        xl: '0 16px 40px rgba(0, 0, 0, 0.4)'
    }
})
