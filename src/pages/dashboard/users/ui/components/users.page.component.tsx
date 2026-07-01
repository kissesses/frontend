import { Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { CreateUserModalWidget } from '@widgets/dashboard/users/create-user-modal'
import { DetailedUserInfoDrawerWidget } from '@widgets/dashboard/users/detailed-user-info-drawer/detailed-user-info-drawer.widget'
import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { UserAccessibleNodesModalWidget } from '@widgets/dashboard/users/user-accessible-nodes-modal/user-accessible-nodes.modal.widget'
import { UserTorrentBlockerReportsDrawerWidget } from '@widgets/dashboard/users/user-torrent-blocker-reports/user-torrent-blocker-reports.drawer.widget'
import { UsersMetrics } from '@widgets/dashboard/users/users-metrics'
import { UsersCardsWidget } from '@widgets/dashboard/users/users-cards'
import { UserTableWidget } from '@widgets/dashboard/users/users-table'
import { ViewUserModal } from '@widgets/dashboard/users/view-user-modal'
import { useTranslation } from 'react-i18next'

import { MobileWarningOverlay } from '@shared/ui/mobile-warning-overlay/mobile-warning-overlay'
import { Page } from '@shared/ui/page'

import { USERS_VIEW_MODE, useUsersViewMode } from '@entities/dashboard/view-preferences-store'

export default function UsersPageComponent() {
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 500px)')
    const viewMode = useUsersViewMode()

    return (
        <Page title={t('constants.users')}>
            <Stack>
                {isMobile && viewMode === USERS_VIEW_MODE.TABLE && <MobileWarningOverlay />}
                <UsersMetrics />

                {viewMode === USERS_VIEW_MODE.CARDS ? <UsersCardsWidget /> : <UserTableWidget />}
            </Stack>

            <ViewUserModal key="view-user-modal" />
            <CreateUserModalWidget key="create-user-widget" />
            <DetailedUserInfoDrawerWidget key="detailed-user-info-drawer" />
            <UserAccessibleNodesModalWidget key="user-accessible-nodes-modal" />
            <InternalSquadsDrawerWithStore key="internal-squads-drawer-with-store" />
            <UserTorrentBlockerReportsDrawerWidget key="user-torrent-blocker-reports-drawer" />
        </Page>
    )
}
