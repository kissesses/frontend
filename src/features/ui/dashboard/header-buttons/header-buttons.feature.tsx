import { ActionIcon, Group } from '@mantine/core'
import { PiArrowsClockwise, PiSignOutDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router'

import { clearQueryClient } from '@shared/api'
import { ROUTES } from '@shared/constants'
import { resetAllStores } from '@shared/hocs/store-wrapper'
import { useAuth } from '@shared/hooks'
import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'

import { removeToken } from '@entities/auth'
import { usePrimaryColorName } from '@shared/hocs/theme-applier'

export const HeaderButtons = () => {
    const primaryColor = usePrimaryColorName()
    const { setIsAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        setIsAuthenticated(false)
        removeToken()
        resetAllStores()
        clearQueryClient()
        navigate(ROUTES.AUTH.LOGIN)
    }

    const handleRefresh = () => {
        resetAllStores()
        clearQueryClient()
        navigate(0)
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <LanguagePicker />

            <ActionIcon color="gray" onClick={handleRefresh} size="xl">
                <PiArrowsClockwise size="24px" />
            </ActionIcon>

            <ActionIcon color={primaryColor} onClick={handleLogout} size="xl">
                <PiSignOutDuotone size="24px" />
            </ActionIcon>
        </Group>
    )
}
