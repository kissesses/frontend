import {
    Badge,
    Button,
    Group,
    SimpleGrid,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { OpsPanelLinkCard } from '@features/ops-panel'
import { UsersMetrics } from '@widgets/dashboard/users/users-metrics/users-metrics.widget'
import { GetRemnawaveHealthCommand, GetStatsCommand } from '@kissesses/backend-contract'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
    PiAirTrafficControlDuotone
} from 'react-icons/pi'
import {
    TbBrandTelegram,
    TbDatabase,
    TbDatabaseExport,
    TbDeviceAnalytics,
    TbFlame,
    TbLock,
    TbRadar2,
    TbReportAnalytics,
    TbSettings,
    TbTimeline,
    TbTools
} from 'react-icons/tb'

import { ROUTES } from '@shared/constants'
import {
    useGetDatabaseManagementGateStatus,
    useGetPostgresManagementGateStatus
} from '@shared/api/hooks'
import { PageHeaderShared } from '@shared/ui'
import { Logo } from '@shared/ui/logo'

import { useOpsPanelActions } from '@entities/ops-panel'

interface OpsPanelPageComponentProps {
    remnawaveHealth: GetRemnawaveHealthCommand.Response['response']
    systemInfo: GetStatsCommand.Response['response']
}

export function OpsPanelPageComponent(props: OpsPanelPageComponentProps) {
    const { remnawaveHealth, systemInfo } = props
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { lock } = useOpsPanelActions()

    const { data: dbGateStatus } = useGetDatabaseManagementGateStatus({
        rQueryParams: { retry: false }
    })
    const { data: postgresGateStatus } = useGetPostgresManagementGateStatus({
        rQueryParams: { retry: false }
    })

    const handleLock = () => {
        lock()
        navigate(ROUTES.DASHBOARD.HOME)
    }

    const elevatedBadge = (isElevated?: boolean) =>
        isElevated ? t('ops-panel.elevated') : t('ops-panel.locked')

  return (
        <Stack gap="md">
            <Group justify="space-between" wrap="wrap">
                <PageHeaderShared icon={<Logo size={24} />} title={t('ops-panel.title')} />
                <Button
                    color="gray"
                    leftSection={<TbLock size={16} />}
                    onClick={handleLock}
                    variant="light"
                >
                    {t('ops-panel.lock-console')}
                </Button>
            </Group>

            <Text c="dimmed" size="sm">
                {t('ops-panel.description')}
            </Text>

            <Group gap="xs" wrap="wrap">
                <Badge color="teal" variant="light">
                    {t('ops-panel.users-online')}: {systemInfo.onlineStats.onlineNow}
                </Badge>
                <Badge color="blue" variant="light">
                    {t('ops-panel.nodes-online')}: {systemInfo.nodes.totalOnline}
                </Badge>
                <Badge color="grape" variant="light">
                    {t('ops-panel.api-instances')}: {remnawaveHealth.runtimeMetrics.length}
                </Badge>
            </Group>

            <Stack gap="xs">
                <Title order={5}>{t('ops-panel.users-overview')}</Title>
                <UsersMetrics />
            </Stack>

            <Stack gap="xs">
                <Title order={5}>{t('ops-panel.management-section')}</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="sm">
                    <OpsPanelLinkCard
                        badge={elevatedBadge(dbGateStatus?.isElevated)}
                        badgeColor={dbGateStatus?.isElevated ? 'teal' : 'orange'}
                        description={t('ops-panel.database-management-description')}
                        href={ROUTES.DASHBOARD.MANAGEMENT.DATABASE_MANAGEMENT}
                        icon={<TbDatabaseExport size={18} />}
                        title={t('constants.database-management')}
                    />
                    <OpsPanelLinkCard
                        badge={elevatedBadge(postgresGateStatus?.isElevated)}
                        badgeColor={postgresGateStatus?.isElevated ? 'teal' : 'orange'}
                        description={t('ops-panel.postgres-management-description')}
                        href={ROUTES.DASHBOARD.MANAGEMENT.POSTGRES_MANAGEMENT}
                        icon={<TbDatabase size={18} />}
                        title={t('constants.postgres-management')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.settings-description')}
                        href={ROUTES.DASHBOARD.MANAGEMENT.REMNAWAVE_SETTINGS}
                        icon={<TbSettings size={18} />}
                        title={t('constants.remnawave-settings')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.telegram-routes-description')}
                        href={ROUTES.DASHBOARD.MANAGEMENT.TELEGRAM_NOTIFICATION_ROUTES}
                        icon={<TbBrandTelegram size={18} />}
                        title={t('constants.telegram-notification-routes')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.queues-description')}
                        href="/api/queues"
                        icon={<PiAirTrafficControlDuotone size={18} />}
                        newTab
                        title={t('ops-panel.queues-viewer')}
                    />
                </SimpleGrid>
            </Stack>

            <Stack gap="xs">
                <Title order={5}>{t('ops-panel.tools-section')}</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="sm">
                    <OpsPanelLinkCard
                        description={t('ops-panel.sessions-explorer-description')}
                        href={ROUTES.DASHBOARD.TOOLS.SESSIONS_EXPLORER}
                        icon={<TbRadar2 size={18} />}
                        title={t('constants.sessions-explorer')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.hwid-inspector-description')}
                        href={ROUTES.DASHBOARD.TOOLS.HWID_INSPECTOR}
                        icon={<TbDeviceAnalytics size={18} />}
                        title={t('constants.hwid-inspector')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.srh-inspector-description')}
                        href={ROUTES.DASHBOARD.TOOLS.SRH_INSPECTOR}
                        icon={<TbReportAnalytics size={18} />}
                        title={t('constants.srh-inspector')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.activity-timeline-description')}
                        href={ROUTES.DASHBOARD.TOOLS.USER_ACTIVITY_TIMELINE}
                        icon={<TbTimeline size={18} />}
                        title={t('constants.user-activity-timeline')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.tb-reports-description')}
                        href={ROUTES.DASHBOARD.TOOLS.TORRENT_BLOCKER_REPORTS}
                        icon={<TbFlame size={18} />}
                        title={t('constants.tb-reports')}
                    />
                    <OpsPanelLinkCard
                        description={t('ops-panel.infra-billing-description')}
                        href={ROUTES.DASHBOARD.CRM.INFRA_BILLING}
                        icon={<TbTools size={18} />}
                        title={t('constants.infra-billing')}
                    />
                </SimpleGrid>
            </Stack>
        </Stack>
    )
}
