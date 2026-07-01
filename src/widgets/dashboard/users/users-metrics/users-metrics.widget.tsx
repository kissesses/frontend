import { SimpleGrid } from '@mantine/core'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'

import { useGetSystemStats } from '@shared/api/hooks'
import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'

export const UsersMetrics = memo(function UsersMetrics() {
    const { t } = useTranslation()

    const { data: systemInfo, isLoading } = useGetSystemStats()

    const users = systemInfo?.users

    const cards: IMetricCardProps[] = useMemo(
        () => [
            {
                IconComponent: PiUsersDuotone,
                iconColor: 'blue',
                title: t('users-metrics.widget.total'),
                value: users?.totalUsers ?? 0,
                iconVariant: 'soft'
            },
            {
                IconComponent: PiPulseDuotone,
                iconColor: 'teal',
                title: 'Active',
                value: users?.statusCounts.ACTIVE ?? 0,
                iconVariant: 'soft'
            },
            {
                IconComponent: PiClockUserDuotone,
                iconColor: 'red',
                title: 'Expired',
                value: users?.statusCounts.EXPIRED ?? 0,
                iconVariant: 'soft'
            },
            {
                IconComponent: PiClockCountdownDuotone,
                iconColor: 'orange',
                title: 'Limited',
                value: users?.statusCounts.LIMITED ?? 0,
                iconVariant: 'soft'
            },
            {
                IconComponent: PiProhibitDuotone,
                iconColor: 'gray',
                title: 'Disabled',
                value: users?.statusCounts.DISABLED ?? 0,
                iconVariant: 'soft'
            }
        ],
        [t, users]
    )

    return (
        <SimpleGrid cols={{ base: 1, xs: 2, xl: 5 }} spacing="xs">
            {cards.map((card) => (
                <MetricCardShared
                    iconColor={card.iconColor}
                    isLoading={isLoading}
                    key={card.title}
                    {...card}
                />
            ))}
        </SimpleGrid>
    )
})
