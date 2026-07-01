import { useHotkeys } from '@mantine/hooks'

import { useOpenOpsConsole } from './use-open-ops-console'

export function OpsPanelUnlockBridge() {
    const openOpsConsole = useOpenOpsConsole()

    useHotkeys([['mod+shift+O', () => openOpsConsole()]])

    return null
}
