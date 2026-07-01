import { useUserActivityTimelineTableColumns } from '@features/dashboard/user-activity-timeline/user-activity-timeline-table/model/use-user-activity-timeline-table-columns'
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_SortingState,
    useMantineReactTable
} from '@kastov/mantine-react-table-open'
import { ActionIcon, ActionIconGroup, Tooltip } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbExternalLink, TbRefresh, TbRestore, TbTimeline } from 'react-icons/tb'

import { useGetUserActivityTimeline } from '@shared/api/hooks'
import { usePreventTableBackScroll } from '@shared/hooks'
import { DEFAULT_PAGINATION_STATE, useMrtTableBinding } from '@shared/lib/mrt-table-store'
import { ResolveUserActionShared } from '@shared/ui/resolve-user-action-icon'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

import { useUserActivityTimelineTableStore } from '@entities/dashboard/user-activity-timeline/user-activity-timeline-table-store'

export function UserActivityTimelineTableWidget() {
    const { t } = useTranslation()

    const tableColumns = useUserActivityTimelineTableColumns()

    const { state: persistedTableState, handlers: persistedTableHandlers } = useMrtTableBinding(
        useUserActivityTimelineTableStore
    )

    const [sorting, setSorting] = useState<MRT_SortingState>([])

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(
        Object.fromEntries(
            tableColumns.map(({ accessorKey }) => [
                accessorKey,
                accessorKey === 'eventType' ? 'equals' : 'contains'
            ])
        )
    )

    usePreventTableBackScroll()

    const params = {
        start: persistedTableState.pagination.pageIndex * persistedTableState.pagination.pageSize,
        size: persistedTableState.pagination.pageSize,
        filters: persistedTableState.columnFilters,
        filterModes: columnFilterFns,
        sorting
    }

    const {
        data: timelineResponse,
        isError,
        isFetching,
        isLoading,
        refetch
    } = useGetUserActivityTimeline({
        query: params,
        rQueryParams: {
            refetchInterval: sToMs(25)
        }
    })

    const table = useMantineReactTable({
        columns: tableColumns,
        data: timelineResponse?.records ?? [],
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableClickToCopy: true,
        enableColumnOrdering: true,
        columnFilterModeOptions: ['contains', 'equals'],
        initialState: {
            density: 'xxs',
            pagination: DEFAULT_PAGINATION_STATE
        },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        enableColumnResizing: true,

        /* prettier-ignore */
        mantineToolbarAlertBannerProps: isError ? {
            color: 'red',
            children: t('user-table.widget.error-loading-data')
        } : undefined,

        ...persistedTableHandlers,
        onColumnFilterFnsChange: setColumnFilterFns,
        onSortingChange: setSorting,

        mantinePaperProps: {
            style: { '--paper-radius': 'var(--mantine-radius-xs)' },
            withBorder: false
        },
        rowCount: timelineResponse?.total ?? 0,
        enableRowSelection: false,
        enableColumnPinning: true,
        positionToolbarAlertBanner: 'top',
        selectAllMode: 'page',
        state: {
            ...persistedTableState,
            columnFilterFns,
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            sorting
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <ActionIconGroup>
                <ResolveUserActionShared userId={row.original.userId} />
                {row.original.requestIp ? (
                    <ActionIcon
                        color="grape"
                        onClick={async () => {
                            window.open(`https://ipinfo.io/${row.original.requestIp}`, '_blank')
                        }}
                        size="input-sm"
                        variant="soft"
                    >
                        <TbExternalLink size="1.5rem" />
                    </ActionIcon>
                ) : null}
            </ActionIconGroup>
        ),

        getRowId: (originalRow) => `${originalRow.id}`,
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 110 }
        }
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <ActionIconGroup>
                        <Tooltip label={t('common.update')} withArrow>
                            <ActionIcon
                                loading={isLoading}
                                onClick={() => refetch()}
                                size="input-md"
                                variant="light"
                            >
                                <TbRefresh size="24px" />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('action-group.feature.reset-table')} withArrow>
                            <ActionIcon
                                color="gray"
                                loading={isLoading}
                                onClick={() => {
                                    table.resetPageIndex(false)
                                    table.resetSorting(true)
                                    table.resetPagination(false)
                                    table.resetColumnFilters(true)
                                    table.resetGlobalFilter(true)
                                    table.resetColumnOrder(true)
                                    table.resetColumnPinning(true)
                                    table.resetColumnVisibility(true)
                                }}
                                size="input-md"
                                variant="light"
                            >
                                <TbRestore size="24px" />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIconGroup>
                }
                icon={<TbTimeline size={24} />}
                title={t('user-activity-timeline-table.widget.title')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
