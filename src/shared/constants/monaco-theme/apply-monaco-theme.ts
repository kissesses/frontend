import type { Monaco } from '@monaco-editor/react'

import { UI_THEME } from '@shared/constants/theme'

import { defaultMonacoTheme } from './default.monaco-theme'
import { noctisMonacoTheme } from './noctis.monaco-theme'

export const MONACO_THEME_NAME = 'RemnaTheme'

export function getCurrentUiThemeFromDom(): UI_THEME {
    return document.documentElement.dataset.theme === UI_THEME.NOCTIS
        ? UI_THEME.NOCTIS
        : UI_THEME.DEFAULT
}

export function getMonacoThemeDefinition(themeId: UI_THEME) {
    return themeId === UI_THEME.NOCTIS ? noctisMonacoTheme : defaultMonacoTheme
}

export function applyMonacoTheme(monaco: Monaco, themeId: UI_THEME = getCurrentUiThemeFromDom()) {
    monaco.editor.defineTheme(MONACO_THEME_NAME, {
        ...getMonacoThemeDefinition(themeId),
        base: 'vs-dark'
    })
}
