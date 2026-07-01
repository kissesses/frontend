import { MRT_ColumnDef } from '@kastov/mantine-react-table-open'
import { Text } from '@mantine/core'
/* eslint-disable camelcase */
import { GetUserActivityTimelineCommand } from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { formatTimeUtil } from '@shared/utils/time-utils'

import {
    UserActivityEventTypeBadge,
    useUserActivityEventTypeLabel
} from '@entities/dashboard/user-activity-timeline/ui'

export const useUserActivityTimelineTableColumns = () => {
    const { t, i18n } = useTranslation()
    const getEventTypeLabel = useUserActivityEventTypeLabel()

    return useMemo<
        MRT_ColumnDef<
            GetUserActivityTimelineCommand.Response['response']['records'][number]
        >[]
    >(
        () => [
            {
                accessorKey: 'occurredAt',
                header: t('use-user-activity-timeline-table-columns.occurred-at'),
                accessorFn: (originalRow) =>
                    formatTimeUtil({
                        time: originalRow.occurredAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    }),
                minSize: 200,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },
            {
                accessorKey: 'eventType',
                header: t('use-user-activity-timeline-table-columns.event-type'),
                accessorFn: (originalRow) => getEventTypeLabel(originalRow.eventType),
                Cell: ({ row }) => <UserActivityEventTypeBadge eventType={row.original.eventType} />,
                size: 200,
                filterVariant: 'select',
                mantineFilterSelectProps: {
                    data: []
                }
            },
            {
                accessorKey: 'username',
                header: t('use-user-activity-timeline-table-columns.username'),
                accessorFn: (originalRow) => originalRow.username,
                size: 160
            },
            {
                accessorKey: 'userId',
                header: 'User ID',
                accessorFn: (originalRow) => originalRow.userId,
                size: 110
            },
            {
                accessorKey: 'requestIp',
                header: t('use-user-activity-timeline-table-columns.request-ip'),
                accessorFn: (originalRow) => originalRow.requestIp || '–'
            },
            {
                accessorKey: 'userAgent',
                header: t('use-user-activity-timeline-table-columns.user-agent'),
                accessorFn: (originalRow) => originalRow.userAgent || '–',
                size: 280
            },
            {
                accessorKey: 'nodeUuid',
                header: t('use-user-activity-timeline-table-columns.node'),
                accessorFn: (originalRow) => originalRow.nodeUuid || '–',
                size: 120
            },
            {
                accessorKey: 'metadata',
                header: t('use-user-activity-timeline-table-columns.details'),
                accessorFn: (originalRow) =>
                    originalRow.metadata ? JSON.stringify(originalRow.metadata) : '–',
                Cell: ({ row }) => (
                    <Text c="dimmed" ff="monospace" fz="xs" lineClamp={2}>
                        {row.original.metadata ? JSON.stringify(row.original.metadata) : '–'}
                    </Text>
                ),
                size: 220,
                enableColumnFilter: false
            },
            {
                accessorKey: 'uuid',
                header: 'UUID',
                accessorFn: (originalRow) => originalRow.uuid,
                size: 100
            }
        ],
        [t, i18n.language, getEventTypeLabel]
    )
}
