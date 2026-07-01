import { MantineThemeOverride } from '@mantine/core'

import { noctisTheme } from './themes/noctis.theme'
import { theme as defaultTheme } from './theme'
import { ThemeId, UI_THEME } from './types'

const themes: Record<ThemeId, MantineThemeOverride> = {
    [UI_THEME.DEFAULT]: defaultTheme,
    [UI_THEME.NOCTIS]: noctisTheme
}

export function getMantineTheme(themeId: ThemeId): MantineThemeOverride {
    return themes[themeId] ?? defaultTheme
}

export function getThemeColorMeta(themeId: ThemeId): string {
    return themeId === UI_THEME.NOCTIS ? '#0a0a0b' : '#161B23'
}
