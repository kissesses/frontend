import { useEffect } from 'react'

import { getThemeColorMeta } from '@shared/constants/theme/theme-registry'
import { UI_THEME } from '@shared/constants/theme'

import { useUiTheme } from '@entities/dashboard/view-preferences-store'

interface ThemeApplierProps {
    children: React.ReactNode
}

export function ThemeApplier({ children }: ThemeApplierProps) {
    const uiTheme = useUiTheme()

    useEffect(() => {
        const root = document.documentElement
        root.dataset.theme = uiTheme

        const meta = document.querySelector('meta[name="theme-color"]')
        if (meta) {
            meta.setAttribute('content', getThemeColorMeta(uiTheme))
        }

        document.body.style.backgroundColor = getThemeColorMeta(uiTheme)
    }, [uiTheme])

    return children
}

export function usePrimaryColorName(): string {
    const uiTheme = useUiTheme()
    return uiTheme === UI_THEME.NOCTIS ? 'violet' : 'cyan'
}

export function useEntityAccentColor(): string {
    const uiTheme = useUiTheme()
    return uiTheme === UI_THEME.NOCTIS ? 'violet' : 'teal'
}

export function getEntityAccentColorFromDom(): string {
    return document.documentElement.dataset.theme === UI_THEME.NOCTIS ? 'violet' : 'teal'
}
