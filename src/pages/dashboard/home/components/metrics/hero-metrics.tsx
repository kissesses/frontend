import { GetAllNodesCommand, GetStatsCommand } from '@kissesses/backend-contract'
import { TFunction } from 'i18next'
import { PiPulseDuotone, PiUsersThreeDuotone } from 'react-icons/pi'
import { TbServer2 } from 'react-icons/tb'

import { IMetricCardProps } from '@shared/ui/metrics/metric-card'
import { formatInt } from '@shared/utils/misc'

export const getHeroMetrics = (
    systemInfo: GetStatsCommand.Response['response'],
    nodes: GetAllNodesCommand.Response['response'] | undefined,
    t: TFunction
): IMetricCardProps[] => {
    const nodesOnline = nodes?.filter((node) => node.isConnected).length ?? 0
    const nodesTotal = nodes?.length ?? 0

    return [
        {
            value: formatInt(systemInfo.onlineStats.onlineNow) ?? 0,
            IconComponent: PiPulseDuotone,
            title: t('online-metrics.online-now'),
            subtitle: t('online-metrics.online-today', {
                defaultValue: 'Online today'
            }),
            iconVariant: 'soft',
            iconColor: 'teal'
        },
        {
            value: formatInt(systemInfo.users.statusCounts.ACTIVE) ?? 0,
            IconComponent: PiUsersThreeDuotone,
            title: t('home.page.active-users', { defaultValue: 'Active users' }),
            subtitle: `${formatInt(systemInfo.users.totalUsers)} ${t('users-metrics.widget.total').toLowerCase()}`,
            iconVariant: 'soft',
            iconColor: 'blue'
        },
        {
            value: `${nodesOnline} / ${nodesTotal}`,
            IconComponent: TbServer2,
            title: t('nodes-quick-stats.widget.online-nodes'),
            iconVariant: 'soft',
            iconColor: 'cyan'
        }
    ]
}
