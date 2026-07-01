import { useUserTableColumns } from '@features/dashboard/users/users-table/model/use-table-columns'
import {
    MRT_ColumnFilterFnsState,
    MRT_SortingState
} from '@kastov/mantine-react-table-open'
import { useEffect, useState } from 'react'

import {
    useGetExternalSquads,
    useGetInternalSquads,
    useGetNodes,
    useGetUsersV2,
    useGetUserTags
} from '@shared/api/hooks'
import { useMrtTableBinding } from '@shared/lib/mrt-table-store'
import { sToMs } from '@shared/utils/time-utils'

import {
    useBulkUsersActionsStoreActions
} from '@entities/dashboard/users/bulk-users-actions-store'
import { useUsersTableStore } from '@entities/dashboard/users/users-table-store'

export function useUsersListQuery(options?: { includeTableColumns?: boolean }) {
    const includeTableColumns = options?.includeTableColumns ?? true
    const { data: internalSquads } = useGetInternalSquads()
    const { data: externalSquads } = useGetExternalSquads()
    const { data: nodes } = useGetNodes()
    const { data: tags } = useGetUserTags()

    const tableColumns = useUserTableColumns(
        internalSquads,
        externalSquads,
        nodes,
        includeTableColumns
    )
    const bulkUsersActionsStoreActions = useBulkUsersActionsStoreActions()

    const { state: persistedTableState, handlers: persistedTableHandlers } =
        useMrtTableBinding(useUsersTableStore)

    const [sorting, setSorting] = useState<MRT_SortingState>([])

    const defaultFilterFns: Record<string, string> = {
        hwidDeviceLimit: 'equals',
        tag: 'equals',
        trafficLimitBytes: 'between'
    }

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(() =>
        Object.fromEntries(
            tableColumns.map(({ accessorKey }) => [
                accessorKey,
                defaultFilterFns[accessorKey!] ?? 'contains'
            ])
        )
    )

    useEffect(() => {
        if (!includeTableColumns) {
            return
        }

        setColumnFilterFns((prev) => {
            const next = { ...prev }

            for (const { accessorKey } of tableColumns) {
                if (!accessorKey || accessorKey in next) {
                    continue
                }

                next[accessorKey] = defaultFilterFns[accessorKey] ?? 'contains'
            }

            return next
        })
    }, [includeTableColumns, tableColumns])

    const params = {
        start: persistedTableState.pagination.pageIndex * persistedTableState.pagination.pageSize,
        size: persistedTableState.pagination.pageSize,
        filters: persistedTableState.columnFilters.filter(({ value }) =>
            Array.isArray(value)
                ? value.some((bound) => bound !== null && bound !== undefined && bound !== '')
                : value !== null && value !== undefined && value !== ''
        ),
        filterModes: columnFilterFns,
        sorting
    }

    const query = useGetUsersV2({
        query: params,
        rQueryParams: {
            refetchInterval: bulkUsersActionsStoreActions.getUuidLength() === 0 ? sToMs(25) : false
        }
    })

    return {
        columnFilterFns,
        externalSquads,
        internalSquads,
        nodes,
        persistedTableHandlers,
        persistedTableState,
        query,
        setColumnFilterFns,
        setSorting,
        sorting,
        tableColumns,
        tags
    }
}
