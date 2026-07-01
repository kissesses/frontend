import { notifications } from '@mantine/notifications'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { ROUTES } from '@shared/constants'

import { useOpsPanelActions } from '@entities/ops-panel'

export function useOpenOpsConsole() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { unlock } = useOpsPanelActions()

    return useCallback(() => {
        unlock()
        notifications.show({
            title: t('ops-panel.unlocked-title'),
            message: t('ops-panel.unlocked-message'),
            color: 'grape'
        })
        navigate(ROUTES.DASHBOARD.OPS)
    }, [navigate, t, unlock])
}
