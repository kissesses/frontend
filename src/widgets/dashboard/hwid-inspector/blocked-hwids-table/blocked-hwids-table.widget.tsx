import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from '@kastov/mantine-react-table-open'
import { ActionIcon, ActionIconGroup, Badge, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetBlockedHwidsCommand } from '@kissesses/backend-contract'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbLockOff, TbRefresh, TbShieldLock } from 'react-icons/tb'

import { useGetBlockedHwids, useUnblockHwidWithInvalidation } from '@shared/api/hooks'
import { DEFAULT_PAGINATION_STATE } from '@shared/lib/mrt-table-store'
import { DataTableShared } from '@shared/ui/table'
import { formatTimeUtil, sToMs } from '@shared/utils/time-utils'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'

export function BlockedHwidsTableWidget() {
    const entityAccentColor = useEntityAccentColor()
    const { t, i18n } = useTranslation()
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })

    const params = {
        start: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize
    }

    const { data, isError, isFetching, isLoading, refetch } = useGetBlockedHwids({
        query: params,
        rQueryParams: {
            refetchInterval: sToMs(25)
        }
    })

    const { mutate: unblockHwid, isPending: isUnblocking } = useUnblockHwidWithInvalidation()

    const columns = useMemo<
        MRT_ColumnDef<GetBlockedHwidsCommand.Response['response']['blocked'][number]>[]
    >(
        () => [
            {
                accessorKey: 'hwid',
                header: 'HWID',
                size: 220
            },
            {
                accessorKey: 'reason',
                header: t('blocked-hwids-table.widget.reason'),
                accessorFn: (row) => row.reason || '–'
            },
            {
                accessorKey: 'expiresAt',
                header: t('blocked-hwids-table.widget.expires-at'),
                accessorFn: (row) =>
                    row.expiresAt
                        ? formatTimeUtil({
                              time: row.expiresAt,
                              template: 'TIME_FIRST_DATETIME',
                              language: i18n.language
                          })
                        : t('blocked-hwids-table.widget.permanent'),
                enableColumnFilter: false
            },
            {
                accessorKey: 'createdAt',
                header: t('use-hwid-inspector-table-columns.created-at'),
                accessorFn: (row) =>
                    formatTimeUtil({
                        time: row.createdAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    }),
                enableColumnFilter: false
            }
        ],
        [t, i18n.language]
    )

    const table = useMantineReactTable({
        columns,
        data: data?.blocked ?? [],
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableColumnOrdering: true,
        initialState: {
            density: 'xxs',
            pagination: DEFAULT_PAGINATION_STATE
        },
        manualPagination: true,
        enableColumnResizing: true,
        onPaginationChange: setPagination,
        mantinePaperProps: {
            style: { '--paper-radius': 'var(--mantine-radius-xs)' },
            withBorder: false
        },
        rowCount: data?.total ?? 0,
        enableRowSelection: false,
        state: {
            pagination,
            isLoading: isLoading || isUnblocking,
            showAlertBanner: isError,
            showProgressBars: isFetching
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Tooltip label={t('blocked-hwids-table.widget.unblock')} withArrow>
                <ActionIcon
                    color={entityAccentColor}
                    loading={isUnblocking}
                    onClick={() => {
                        modals.openConfirmModal({
                            title: t('blocked-hwids-table.widget.unblock-title'),
                            children: t('blocked-hwids-table.widget.unblock-confirm', {
                                hwid: row.original.hwid
                            }),
                            labels: {
                                confirm: t('blocked-hwids-table.widget.unblock'),
                                cancel: t('common.cancel')
                            },
                            confirmProps: { color: 'teal' },
                            onConfirm: () => {
                                unblockHwid({ route: { hwid: row.original.hwid } })
                            }
                        })
                    }}
                    size="input-sm"
                    variant="soft"
                >
                    <TbLockOff size="1.5rem" />
                </ActionIcon>
            </Tooltip>
        ),
        getRowId: (row) => row.hwid,
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 80 }
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
                                variant="soft"
                            >
                                <TbRefresh size="24px" />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIconGroup>
                }
                icon={<TbShieldLock size={24} />}
                iconProps={{
                    color: 'red',
                    variant: 'soft'
                }}
                title={
                    <>
                        {t('blocked-hwids-table.widget.title')}{' '}
                        <Badge color="red" size="sm" variant="light">
                            {data?.total ?? 0}
                        </Badge>
                    </>
                }
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
