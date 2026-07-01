import { Box, Group, Progress, Text } from '@mantine/core'
import { RESET_PERIODS } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'

import { prettifyBytesUtil } from '@shared/utils/bytes'

import { IProps } from '@entities/dashboard/users/ui/table-columns/username/interface'

export function DataUsageColumnEntity(props: IProps) {
    const { compact = false, user, variant = compact ? 'compact' : 'table' } = props
    const { t } = useTranslation()

    const usedBytes = user.userTraffic.usedTrafficBytes
    const limitBytes = user.trafficLimitBytes
    const lifetimeBytes = user.userTraffic.lifetimeUsedTrafficBytes
    const isUnlimited = limitBytes === 0
    const percentage = isUnlimited ? 0 : (usedBytes * 100) / limitBytes

    const strategy = {
        [RESET_PERIODS.MONTH]: t('data-usage.column.monthly'),
        [RESET_PERIODS.WEEK]: t('data-usage.column.weekly'),
        [RESET_PERIODS.DAY]: t('data-usage.column.daily'),
        [RESET_PERIODS.MONTH_ROLLING]: `${t('data-usage.column.monthly')} ↻`,
        [RESET_PERIODS.NO_RESET]: '∞'
    }[user.trafficLimitStrategy]

    const prettyUsedData = prettifyBytesUtil(usedBytes) || '0 B'
    const prettyLifetimeData = prettifyBytesUtil(lifetimeBytes) || '0 B'
    const maxData = isUnlimited ? '∞' : prettifyBytesUtil(limitBytes) || '∞'

    const getProgressColor = () => {
        if (isUnlimited) return 'teal'
        if (percentage > 95) return 'red'
        if (percentage > 80) return 'yellow.4'
        return 'teal'
    }

    if (variant === 'card') {
        return (
            <Box style={{ minWidth: 0 }}>
                <Group gap="xs" justify="space-between" wrap="nowrap">
                    <Text fw={600} fz="xs" lh={1.4} truncate>
                        {prettyUsedData}
                        <Text c="dimmed" component="span" fw={500}>
                            {' / '}
                            {maxData}
                        </Text>
                    </Text>
                    <Text c="dimmed" fz="xs" lh={1.4} truncate>
                        Σ {prettyLifetimeData}
                    </Text>
                </Group>
                <Progress
                    color={isUnlimited ? 'gray' : getProgressColor()}
                    mt={6}
                    radius="xl"
                    size="sm"
                    styles={
                        isUnlimited
                            ? { section: { opacity: 0.2 } }
                            : undefined
                    }
                    value={isUnlimited ? 100 : percentage}
                />
                {!isUnlimited && (
                    <Text c="dimmed" fz={10} lh={1.3} mt={4} size="xs">
                        {percentage.toFixed(0)}% · {strategy}
                    </Text>
                )}
            </Box>
        )
    }

    if (variant === 'compact') {
        return (
            <Box style={{ minWidth: 0 }}>
                <Group gap="xs" justify="space-between" wrap="nowrap">
                    <Text fw={600} fz="xs" lh={1.4}>
                        {isUnlimited ? '∞' : `${percentage.toFixed(1)}%`}
                        <Text c="dimmed" component="span" fz="xs">
                            {' '}
                            {strategy}
                        </Text>
                    </Text>
                    <Text c="dimmed" fz="xs" lh={1.4} truncate>
                        Σ {prettyLifetimeData}
                    </Text>
                </Group>
                <Progress
                    color={getProgressColor()}
                    mt={4}
                    radius="sm"
                    size="sm"
                    value={isUnlimited ? 100 : percentage}
                />
                <Group gap="xs" justify="space-between" mt={4} wrap="nowrap">
                    <Text c="dimmed" fw={550} lh={1.4} size="xs" truncate>
                        {prettyUsedData}
                    </Text>
                    <Text c="dimmed" fw={550} lh={1.4} size="xs" truncate>
                        {maxData}
                    </Text>
                </Group>
            </Box>
        )
    }

    return (
        <Box miw={300}>
            <Group justify="space-between">
                <Text c="red.5" fw={700} fz="xs">
                    {percentage.toFixed(2)}%
                    <Text c="dimmed" component="span" fz="xs">
                        {' '}
                        {strategy}
                    </Text>
                </Text>
                <Text c="teal.5" fw={700} fz="xs">
                    <Text c="dimmed" component="span" fw={550} fz="xs" size="xs">
                        Σ {prettyLifetimeData}
                    </Text>{' '}
                    {(100 - percentage).toFixed(2)}%
                </Text>
            </Group>
            <Progress
                color={getProgressColor()}
                radius="xs"
                size="md"
                value={isUnlimited ? 100 : percentage}
            />

            <Group gap="xs" justify="space-between" mt={2}>
                <Text c="dimmed" fw={550} size="xs">
                    {prettyUsedData}
                </Text>

                <Text c="dimmed" fw={550} size="xs">
                    {maxData}
                </Text>
            </Group>
        </Box>
    )
}
