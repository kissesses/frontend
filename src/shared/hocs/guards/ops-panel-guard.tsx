import { Navigate, Outlet } from 'react-router'

import { ROUTES } from '@shared/constants'

import { useOpsPanelUnlocked } from '@entities/ops-panel'

export function OpsPanelGuard() {
    const unlocked = useOpsPanelUnlocked()

    if (!unlocked) {
        return <Navigate replace to={ROUTES.DASHBOARD.HOME} />
    }

    return <Outlet />
}
