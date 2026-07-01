import { UI_THEME } from '@shared/constants/theme'

import { useUiTheme } from '@entities/dashboard/view-preferences-store'

export function useSparklineTrendColors() {
    const uiTheme = useUiTheme()

    return uiTheme === UI_THEME.NOCTIS
        ? { negative: 'red.6' as const, neutral: 'gray.5' as const, positive: 'violet.5' as const }
        : { negative: 'red.6' as const, neutral: 'gray.5' as const, positive: 'teal.6' as const }
}
