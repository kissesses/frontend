import { Button, Group, Pagination, Select, SimpleGrid, Stack, Text } from '@mantine/core'
import { UserActionGroupFeature } from '@features/dashboard/users/users-action-group'
import { UsersCardsFiltersFeature } from '@features/dashboard/users/users-cards-filters'
import { useUsersListQuery } from '@features/dashboard/users/users-list'
import { UsersCardsSelectionFeature } from '@features/ui/dashboard/users/users-cards-selection/users-cards-selection.feature'
import { GetAllUsersCommand } from '@kissesses/backend-contract'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PiUsersDuotone } from 'react-icons/pi'
import { useSearchParams } from 'react-router'

import { SEARCH_PARAMS } from '@shared/constants/search-params'
import { DEFAULT_PAGINATION_STATE } from '@shared/lib/mrt-table-store'
import { DataTableShared } from '@shared/ui/table'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoadingScreen } from '@shared/ui'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import {
    useBulkUsersActionsStoreActions,
    useBulkUsersActionsStoreTableSelection
} from '@entities/dashboard/users/bulk-users-actions-store'
import { useUsersTableStoreActions } from '@entities/dashboard/users/users-table-store'
import {
    useUsersViewMode,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { UserCardWidget } from '../user-card'

export const UsersCardsWidget = memo(function UsersCardsWidget() {
    const { t } = useTranslation()
    const userModalActions = useUserModalStoreActions()
    const [searchParams, setSearchParams] = useSearchParams()
    const tableSelection = useBulkUsersActionsStoreTableSelection()
    const bulkUsersActionsStoreActions = useBulkUsersActionsStoreActions()
    const usersTableStoreActions = useUsersTableStoreActions()
    const viewMode = useUsersViewMode()
    const { setUsersViewMode } = useViewPreferencesStoreActions()

    const {
        externalSquads,
        internalSquads,
        nodes,
        persistedTableHandlers,
        persistedTableState,
        query,
        tags
    } = useUsersListQuery({ includeTableColumns: false })

    const { data: usersResponse, isError, isLoading, refetch } = query
    const users: GetAllUsersCommand.Response['response']['users'] = usersResponse?.users ?? []
    const total = usersResponse?.total ?? 0
    const pageSize = persistedTableState.pagination.pageSize
    const pageIndex = persistedTableState.pagination.pageIndex
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    useEffect(() => {
        if (!isLoading && searchParams.get(SEARCH_PARAMS.USER)) {
            userModalActions.setUserUuid(searchParams.get(SEARCH_PARAMS.USER)!)
            userModalActions.changeModalState(true)

            searchParams.delete(SEARCH_PARAMS.USER)
            setSearchParams(searchParams)
        }
    }, [searchParams, isLoading])

    const handleOpenUser = useCallback(
        async (uuid: string) => {
            await userModalActions.setUserUuid(uuid)
            userModalActions.changeModalState(true)
        },
        [userModalActions]
    )

    const toggleUserSelection = useCallback((uuid: string) => {
        bulkUsersActionsStoreActions.setTableSelection((prev) => {
            const next = { ...prev }
            if (next[uuid]) {
                delete next[uuid]
            } else {
                next[uuid] = true
            }
            return next
        })
    }, [bulkUsersActionsStoreActions])

    const nodesByUuid = useMemo(() => {
        const map = new Map<string, NonNullable<typeof nodes>[number]>()

        nodes?.forEach((node) => {
            map.set(node.uuid, node)
        })

        return map
    }, [nodes])

    const handleClearFilters = () => {
        usersTableStoreActions.setColumnFilter([])
        usersTableStoreActions.setPaginationState(DEFAULT_PAGINATION_STATE)
        refetch()
    }

    const handleFiltersChange = (filters: typeof persistedTableState.columnFilters) => {
        persistedTableHandlers.onColumnFiltersChange(filters)
        persistedTableHandlers.onPaginationChange({
            pageIndex: 0,
            pageSize
        })
    }

    const handlePageChange = (page: number) => {
        persistedTableHandlers.onPaginationChange({
            pageIndex: page - 1,
            pageSize
        })
    }

    const handlePageSizeChange = (value: string | null) => {
        if (!value) return

        persistedTableHandlers.onPaginationChange({
            pageIndex: 0,
            pageSize: Number(value)
        })
    }

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <UserActionGroupFeature
                        isLoading={isLoading}
                        refetch={refetch}
                        setViewMode={setUsersViewMode}
                        viewMode={viewMode}
                    />
                }
                icon={<PiUsersDuotone size={24} />}
                title={t('user-table.widget.table-title')}
            />

            <DataTableShared.Content>
                <Stack gap="md" p="md">
                    <UsersCardsSelectionFeature users={users} />

                    <UsersCardsFiltersFeature
                        columnFilters={persistedTableState.columnFilters}
                        externalSquads={externalSquads?.externalSquads}
                        internalSquads={internalSquads?.internalSquads}
                        nodes={nodes}
                        onClearFilters={handleClearFilters}
                        onFiltersChange={handleFiltersChange}
                        tags={tags?.tags}
                    />

                    {isError && (
                        <Text c="red" size="sm">
                            {t('user-table.widget.error-loading-data')}
                        </Text>
                    )}

                    {isLoading ? (
                        <LoadingScreen height="40vh" />
                    ) : users.length === 0 ? (
                        <EmptyPageLayout />
                    ) : (
                        <SimpleGrid
                            cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                            spacing="md"
                            verticalSpacing="md"
                        >
                            {users.map((user) => (
                                <UserCardWidget
                                    isSelected={Boolean(tableSelection[user.uuid])}
                                    key={user.uuid}
                                    node={
                                        user.userTraffic.lastConnectedNodeUuid
                                            ? nodesByUuid.get(user.userTraffic.lastConnectedNodeUuid)
                                            : undefined
                                    }
                                    onOpen={handleOpenUser}
                                    onSelect={toggleUserSelection}
                                    user={user}
                                />
                            ))}
                        </SimpleGrid>
                    )}

                    <Group justify="space-between" wrap="wrap">
                        <Text c="dimmed" size="sm">
                            {t('users-cards.widget.total-users', { count: total })}
                        </Text>

                        <Group gap="md" wrap="wrap">
                            <Select
                                data={['25', '50', '100']}
                                onChange={handlePageSizeChange}
                                value={String(pageSize)}
                                w={90}
                            />
                            <Pagination
                                onChange={handlePageChange}
                                total={totalPages}
                                value={pageIndex + 1}
                            />
                        </Group>
                    </Group>
                </Stack>
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
})
