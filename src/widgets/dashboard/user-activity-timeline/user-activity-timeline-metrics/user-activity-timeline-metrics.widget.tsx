import { Chart } from '@highcharts/react'
import { Box, Card, Center, Group, Loader, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PiChartBar, PiPulseDuotone } from 'react-icons/pi'

import { useGetUserActivityTimelineStats } from '@shared/api/hooks'
import { getHighchartsColumnDefaults, highchartsTheme } from '@shared/constants/theme/chart-tokens'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'
import { TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { formatInt } from '@shared/utils/misc'

import { useUserActivityEventTypeLabel } from '@entities/dashboard/user-activity-timeline/ui'

export function UserActivityTimelineMetricsWidget() {
    const entityAccentColor = useEntityAccentColor()
    const { t } = useTranslation()
    const getEventTypeLabel = useUserActivityEventTypeLabel()

    const { data: stats, isLoading } = useGetUserActivityTimelineStats()

    const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

    const getBarChartConfig = () => {
        return {
            chart: {
                type: 'column',
                backgroundColor: 'transparent',
                height: 300,
                style: {
                    fontFamily: 'inherit'
                }
            },
            time: {
                useUTC: false
            },
            accessibility: {
                enabled: false
            },
            title: {
                text: undefined
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    hour: '%H:00'
                },
                units: [['hour', [1, 2, 3, 4, 6, 8, 12]]],
                labels: {
                    style: highchartsTheme.axisLabelStyle
                },
                gridLineColor: highchartsTheme.gridLineColor,
                lineColor: highchartsTheme.axisLineColor
            },
            yAxis: {
                title: {
                    text: t('user-activity-timeline-metrics.widget.events'),
                    style: highchartsTheme.axisLabelStyle
                },
                labels: {
                    style: highchartsTheme.axisLabelStyle
                },
                gridLineColor: highchartsTheme.gridLineColor,
                lineColor: highchartsTheme.axisLineColor
            },
            tooltip: {
                shared: true,
                backgroundColor: highchartsTheme.tooltip.backgroundColor,
                borderColor: highchartsTheme.tooltip.borderColor,
                headerFormat: '',
                style: highchartsTheme.tooltip.style,
                pointFormatter(this: { x: number; y: number }): string {
                    return `<b>${dayjs(this.x).format('DD.MM.YYYY, HH:mm')}</b> </br> Events: <b>${this.y}<b>`
                }
            },
            plotOptions: {
                column: getHighchartsColumnDefaults()
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            }
        }
    }

    const hourlyChartOptions = useMemo(() => {
        if (!stats?.hourlyEventStats || stats.hourlyEventStats.length === 0) return {}

        const data = stats.hourlyEventStats.map(
            (item: { dateTime: Date; eventCount: number }) => {
            const utcDate = new Date(item.dateTime)
            return [utcDate.getTime(), item.eventCount]
            }
        )

        return {
            ...getBarChartConfig(),
            series: [
                {
                    type: 'column',
                    name: t('user-activity-timeline-metrics.widget.events'),
                    data
                }
            ]
        }
    }, [stats?.hourlyEventStats, t])

    const loaderCard = (
        <Center h={300}>
            <Loader size="lg" />
        </Center>
    )

    return (
        <Stack gap="xl">
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                <Card p="lg" className="app-chart-surface">
                    <Group align="center" gap="sm" mb="lg" wrap="nowrap">
                        <ThemeIcon color={entityAccentColor} size="lg" variant="outline">
                            <PiPulseDuotone size="20px" />
                        </ThemeIcon>

                        <Text fw={600} size="lg">
                            {t('user-activity-timeline-metrics.widget.by-event-type')}
                        </Text>
                    </Group>
                    <TopLeaderboardCardShared
                        emptyText={t('user-activity-timeline-metrics.widget.no-event-data')}
                        formatValue={(value) => formatInt(value, { thousandSeparator: ' ' })}
                        isLoading={isLoading}
                        items={stats?.byEventType?.map((item: { eventType: string; count: number }) => ({
                            color: ch.hex(item.eventType),
                            name: getEventTypeLabel(item.eventType),
                            total: item.count
                        }))}
                        maxHeight={300}
                        wrapper={(children) => children}
                    />
                </Card>

                <Card p="lg" className="app-chart-surface">
                    <Group align="center" gap="sm" mb="lg" wrap="nowrap">
                        <ThemeIcon color="blue" size="lg" variant="outline">
                            <PiChartBar size="20px" />
                        </ThemeIcon>

                        <Text fw={600} size="lg">
                            {t('user-activity-timeline-metrics.widget.hourly-statistics')}
                        </Text>
                    </Group>
                    {isLoading ? (
                        loaderCard
                    ) : stats?.hourlyEventStats && stats.hourlyEventStats.length > 0 ? (
                        <Box h={300}>
                            <Chart options={hourlyChartOptions} />
                        </Box>
                    ) : (
                        <Center h={300}>
                            <Stack align="center" gap="sm">
                                <PiChartBar color="var(--mantine-color-gray-4)" size="48px" />
                                <Text c="dimmed" size="sm">
                                    {t('user-activity-timeline-metrics.widget.no-hourly-data')}
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Card>
            </SimpleGrid>
        </Stack>
    )
}
