import { ActionIcon, SimpleGrid, Stack } from '@mantine/core'
import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { NodesStatisticBarchartWidget } from '@widgets/dashboard/nodes-statistic/statistic-barchart'
import { NodesStatisticSparklineCardWidget } from '@widgets/dashboard/nodes-statistic/statistic-sparkline-card'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbCalendar, TbRefresh } from 'react-icons/tb'

import { useGetStatsNodesUsage } from '@shared/api/hooks'
import { CountryFlag } from '@shared/ui/get-country-flag'
import { TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { getDefaultDateRange } from '@shared/utils/time-utils'

const HOME_TOP_NODES_LIMIT = 10

export const HomeTrafficWidget = () => {
    const { t, i18n } = useTranslation()
    const defaultRange = getDefaultDateRange()

    const [rawRange, setRawRange] = useState<[null | string, null | string]>([
        defaultRange.start,
        defaultRange.end
    ])
    const [queryRange, setQueryRange] = useState<{ end: string; start: string }>(defaultRange)

    const {
        data: nodesStats,
        isLoading,
        refetch,
        isRefetching
    } = useGetStatsNodesUsage({
        query: {
            start: queryRange.start,
            end: queryRange.end,
            topNodesLimit: HOME_TOP_NODES_LIMIT
        },
        rQueryParams: {
            enabled: Boolean(queryRange.start && queryRange.end)
        }
    })

    const handleDateRangeChange = (value: DatesRangeValue<string>) => {
        if (value[0] === null && value[1] === null) {
            setRawRange([defaultRange.start, defaultRange.end])
            setQueryRange(defaultRange)
            return
        }

        setRawRange(value)
        if (!value[0] || !value[1]) return

        if (!dayjs(value[0]).isValid() || !dayjs(value[1]).isValid()) return

        setQueryRange({
            start: dayjs(value[0]).format('YYYY-MM-DD'),
            end: dayjs(value[1]).format('YYYY-MM-DD')
        })
    }

    return (
        <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DatePickerInput
                    allowSingleDateInRange
                    dropdownType="modal"
                    headerControlsOrder={['previous', 'next', 'level']}
                    leftSection={<TbCalendar size="20px" />}
                    locale={i18n.language}
                    maxDate={new Date()}
                    onChange={handleDateRangeChange}
                    presets={[
                        {
                            label: t('statistic-nodes.component.7-days'),
                            value: [
                                dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
                                dayjs().format('YYYY-MM-DD')
                            ]
                        },
                        {
                            label: t('statistic-nodes.component.14-days'),
                            value: [
                                dayjs().subtract(13, 'day').format('YYYY-MM-DD'),
                                dayjs().format('YYYY-MM-DD')
                            ]
                        },
                        {
                            label: t('statistic-nodes.component.30-days'),
                            value: [
                                dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
                                dayjs().format('YYYY-MM-DD')
                            ]
                        }
                    ]}
                    rightSection={
                        <ActionIcon
                            loading={isRefetching}
                            onClick={() => refetch()}
                            variant="subtle"
                        >
                            <TbRefresh size="18px" />
                        </ActionIcon>
                    }
                    size="sm"
                    type="range"
                    value={rawRange}
                    valueFormat="DD MMM, YYYY"
                    w={{ base: '100%', sm: 320 }}
                />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <NodesStatisticSparklineCardWidget
                    isLoading={isLoading}
                    sparklineData={nodesStats?.sparklineData}
                />

                <TopLeaderboardCardShared
                    emptyText={t('statistic-nodes.component.no-data-available')}
                    isLoading={isLoading}
                    items={nodesStats?.topNodes?.map((node) => ({
                        color: node.color,
                        countryCode: node.countryCode,
                        name: node.name,
                        total: node.total
                    }))}
                    maxHeight={230}
                    renderCountryFlag={(item) => <CountryFlag countryCode={item.countryCode} />}
                />
            </SimpleGrid>

            <NodesStatisticBarchartWidget
                categories={nodesStats?.categories}
                isLoading={isLoading}
                series={nodesStats?.series}
            />
        </Stack>
    )
}
