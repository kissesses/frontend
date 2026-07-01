import { useUserTableColumns } from '@features/dashboard/users/users-table/model/use-table-columns'
import {
    MRT_ColumnFilterFnsState,
    MRT_ColumnFiltersState,
    MRT_SortingState
} from '@kastov/mantine-react-table-open'
import { useEffect, useMemo, useState } from 'react'

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

const DEFAULT_FILTER_MODES: Record<string, string> = {
    hwidDeviceLimit: 'equals',
    tag: 'equals',
    trafficLimitBytes: 'between'
}

function isActiveFilterValue(value: unknown): boolean {
    return Array.isArray(value)
        ? value.some((bound) => bound !== null && bound !== undefined && bound !== '')
        : value !== null && value !== undefined && value !== ''
}

function resolveFilterModes(
    filters: MRT_ColumnFiltersState,
    columnFilterFns: MRT_ColumnFilterFnsState
): Record<string, string> {
    const modes: Record<string, string> = {}

    for (const filter of filters) {
        modes[filter.id] =
            columnFilterFns[filter.id] ?? DEFAULT_FILTER_MODES[filter.id] ?? 'contains'
    }

    return modes
}

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

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(() => {
        if (!includeTableColumns) {
            return { ...DEFAULT_FILTER_MODES }
        }

        return Object.fromEntries(
            tableColumns.map(({ accessorKey }) => [
                accessorKey,
                DEFAULT_FILTER_MODES[accessorKey!] ?? 'contains'
            ])
        )
    })

    const tableColumnAccessorKeys = useMemo(
        () =>
            tableColumns
                .map(({ accessorKey }) => accessorKey)
                .filter((key): key is string => Boolean(key))
                .join('\0'),
        [tableColumns]
    )

    useEffect(() => {
        if (!includeTableColumns) {
            return
        }

        setColumnFilterFns((prev) => {
            let changed = false
            const next = { ...prev }

            for (const accessorKey of tableColumnAccessorKeys.split('\0')) {
                if (!accessorKey || accessorKey in next) {
                    continue
                }

                next[accessorKey] = DEFAULT_FILTER_MODES[accessorKey] ?? 'contains'
                changed = true
            }

            return changed ? next : prev
        })
    }, [includeTableColumns, tableColumnAccessorKeys])

    const activeFilters = persistedTableState.columnFilters.filter(({ value }) =>
        isActiveFilterValue(value)
    )

    const params = {
        start: persistedTableState.pagination.pageIndex * persistedTableState.pagination.pageSize,
        size: persistedTableState.pagination.pageSize,
        filters: activeFilters,
        filterModes: resolveFilterModes(activeFilters, columnFilterFns),
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
