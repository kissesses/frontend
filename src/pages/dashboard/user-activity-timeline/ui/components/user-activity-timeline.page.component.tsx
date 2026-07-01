import { Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { UserActivityTimelineFiltersFeature } from '@features/dashboard/user-activity-timeline/user-activity-timeline-filters/user-activity-timeline-filters.feature'
import { UserActivityTimelineMetricsWidget } from '@widgets/dashboard/user-activity-timeline/user-activity-timeline-metrics'
import { UserActivityTimelineTableWidget } from '@widgets/dashboard/user-activity-timeline/user-activity-timeline-table'
import { DetailedUserInfoDrawerWidget } from '@widgets/dashboard/users/detailed-user-info-drawer/detailed-user-info-drawer.widget'
import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { UserAccessibleNodesModalWidget } from '@widgets/dashboard/users/user-accessible-nodes-modal/user-accessible-nodes.modal.widget'
import { UserTorrentBlockerReportsDrawerWidget } from '@widgets/dashboard/users/user-torrent-blocker-reports/user-torrent-blocker-reports.drawer.widget'
import { ViewUserModal } from '@widgets/dashboard/users/view-user-modal'
import { useTranslation } from 'react-i18next'

import { Page } from '@shared/ui'
import { MobileWarningOverlay } from '@shared/ui/mobile-warning-overlay/mobile-warning-overlay'

export default function UserActivityTimelinePageComponent() {
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 500px)')

    return (
        <Page title={t('constants.user-activity-timeline')}>
            <Stack>
                {isMobile && <MobileWarningOverlay />}
                <UserActivityTimelineMetricsWidget />
                <UserActivityTimelineFiltersFeature />
                <UserActivityTimelineTableWidget />
            </Stack>

            <ViewUserModal key="view-user-modal" />
            <DetailedUserInfoDrawerWidget key="detailed-user-info-drawer" />
            <UserAccessibleNodesModalWidget key="user-accessible-nodes-modal" />
            <InternalSquadsDrawerWithStore key="internal-squads-drawer-with-store" />
            <UserTorrentBlockerReportsDrawerWidget key="user-torrent-blocker-reports-drawer" />
        </Page>
    )
}
