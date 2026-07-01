import { useEffect } from 'react'
import type { Monaco } from '@monaco-editor/react'

import { useUiTheme } from '@entities/dashboard/view-preferences-store'

import { applyMonacoTheme, MONACO_THEME_NAME } from './apply-monaco-theme'

export function useApplyMonacoTheme(monaco: Monaco | null | undefined) {
    const uiTheme = useUiTheme()

    useEffect(() => {
        if (!monaco) {
            return
        }

        applyMonacoTheme(monaco, uiTheme)
        monaco.editor.setTheme(MONACO_THEME_NAME)
    }, [monaco, uiTheme])
}
