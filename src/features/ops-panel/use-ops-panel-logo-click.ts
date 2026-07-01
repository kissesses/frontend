import { useCallback, useRef } from 'react'

import { useOpenOpsConsole } from './use-open-ops-console'

const LOGO_CLICKS_REQUIRED = 5
const LOGO_CLICK_WINDOW_MS = 900

export function useOpsPanelLogoClick() {
    const openOpsConsole = useOpenOpsConsole()

    const clickCountRef = useRef(0)
    const clickTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const handleLogoClick = useCallback(
        (onSingleClick: () => void) => {
            clickCountRef.current += 1

            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current)
            }

            if (clickCountRef.current >= LOGO_CLICKS_REQUIRED) {
                clickCountRef.current = 0
                openOpsConsole()
                return
            }

            clickTimerRef.current = setTimeout(() => {
                if (clickCountRef.current === 1) {
                    onSingleClick()
                }

                clickCountRef.current = 0
            }, LOGO_CLICK_WINDOW_MS)
        },
        [openOpsConsole]
    )

    return { handleLogoClick }
}
