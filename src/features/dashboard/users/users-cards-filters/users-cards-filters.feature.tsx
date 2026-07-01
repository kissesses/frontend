import { ActionIcon, Badge, Card, Group, Select, Stack, TextInput, Tooltip } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { MRT_ColumnFiltersState } from '@kastov/mantine-react-table-open'
import {
    GetAllNodesCommand,
    GetExternalSquadsCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbFilterOff, TbSearch } from 'react-icons/tb'

import { TrafficLimitCardsFilterFeature } from './traffic-limit-cards-filter.feature'

const CARD_FILTER_IDS = [
    'username',
    'status',
    'tag',
    'nodeName',
    'description',
    'activeInternalSquads',
    'externalSquadUuid',
    'trafficLimitBytes'
] as const

interface IProps {
    columnFilters: MRT_ColumnFiltersState
    externalSquads?: GetExternalSquadsCommand.Response['response']['externalSquads']
    internalSquads?: GetInternalSquadsCommand.Response['response']['internalSquads']
    nodes?: GetAllNodesCommand.Response['response']
    onClearFilters: () => void
    onFiltersChange: (filters: MRT_ColumnFiltersState) => void
    tags?: string[]
}

function upsertFilter(
    filters: MRT_ColumnFiltersState,
    id: string,
    value: string | undefined
): MRT_ColumnFiltersState {
    const next = filters.filter((filter) => filter.id !== id)

    if (value !== undefined && value !== '') {
        next.push({ id, value })
    }

    return next
}

function getFilterValue(filters: MRT_ColumnFiltersState, id: string): string {
    const filter = filters.find((item) => item.id === id)
    if (typeof filter?.value === 'string') {
        return filter.value
    }

    if (Array.isArray(filter?.value) && filter.value.length > 0) {
        return String(filter.value[0])
    }

    return ''
}

function useDebouncedTextFilter(
    columnFilters: MRT_ColumnFiltersState,
    filterId: string,
    onFiltersChange: (filters: MRT_ColumnFiltersState) => void
) {
    const [draft, setDraft] = useState(() => getFilterValue(columnFilters, filterId))
    const columnFiltersRef = useRef(columnFilters)
    columnFiltersRef.current = columnFilters

    useEffect(() => {
        setDraft(getFilterValue(columnFilters, filterId))
    }, [columnFilters, filterId])

    const debouncedApply = useDebouncedCallback((value: string) => {
        onFiltersChange(upsertFilter(columnFiltersRef.current, filterId, value || undefined))
    }, 300)

    return {
        draft,
        onChange: (value: string) => {
            setDraft(value)
            debouncedApply(value)
        }
    }
}

export const UsersCardsFiltersFeature = (props: IProps) => {
    const {
        columnFilters,
        externalSquads,
        internalSquads,
        nodes,
        onClearFilters,
        onFiltersChange,
        tags
    } = props
    const { t } = useTranslation()

    const usernameFilter = useDebouncedTextFilter(columnFilters, 'username', onFiltersChange)
    const descriptionFilter = useDebouncedTextFilter(columnFilters, 'description', onFiltersChange)

    const updateFilter = (id: string, value: string | null) => {
        onFiltersChange(upsertFilter(columnFilters, id, value ?? undefined))
    }

    const hiddenFiltersCount = columnFilters.filter(
        (filter) => !CARD_FILTER_IDS.includes(filter.id as (typeof CARD_FILTER_IDS)[number])
    ).length

    return (
        <Card p="md" radius="sm" withBorder>
            <Stack gap="sm">
                {hiddenFiltersCount > 0 && (
                    <Badge color="yellow" variant="light" w="fit-content">
                        {t('users-cards.widget.hidden-filters-active', { count: hiddenFiltersCount })}
                    </Badge>
                )}

                <Group align="flex-end" grow preventGrowOverflow={false} wrap="wrap">
                <TextInput
                    leftSection={<TbSearch size={16} />}
                    label={t('use-table-columns.username')}
                    onChange={(event) => usernameFilter.onChange(event.currentTarget.value)}
                    placeholder={t('users-cards.widget.search-by-username')}
                    value={usernameFilter.draft}
                />

                <Select
                    clearable
                    data={['ACTIVE', 'DISABLED', 'LIMITED', 'EXPIRED']}
                    label={t('use-table-columns.status')}
                    onChange={(value) => updateFilter('status', value)}
                    placeholder={t('users-cards.widget.filter-by-status')}
                    value={getFilterValue(columnFilters, 'status') || null}
                />

                <Select
                    clearable
                    data={tags ?? []}
                    label={t('use-table-columns.tag')}
                    onChange={(value) => updateFilter('tag', value)}
                    placeholder={t('users-cards.widget.filter-by-tag')}
                    searchable
                    value={getFilterValue(columnFilters, 'tag') || null}
                />

                <Select
                    clearable
                    data={
                        nodes?.map((node) => ({
                            label: node.name,
                            value: node.uuid
                        })) ?? []
                    }
                    label={t('use-table-columns.last-connected-node')}
                    onChange={(value) => updateFilter('nodeName', value)}
                    placeholder={t('users-cards.widget.filter-by-node')}
                    searchable
                    value={getFilterValue(columnFilters, 'nodeName') || null}
                />
            </Group>

            <Group align="flex-end" grow preventGrowOverflow={false} wrap="wrap">
                <TextInput
                    leftSection={<TbSearch size={16} />}
                    label={t('use-table-columns.description')}
                    onChange={(event) => descriptionFilter.onChange(event.currentTarget.value)}
                    placeholder={t('users-cards.widget.search-by-description')}
                    value={descriptionFilter.draft}
                />

                <Select
                    clearable
                    data={
                        internalSquads?.map((squad) => ({
                            label: squad.name,
                            value: squad.uuid
                        })) ?? []
                    }
                    label={t('use-table-columns.internal-squads')}
                    onChange={(value) => updateFilter('activeInternalSquads', value)}
                    placeholder={t('users-cards.widget.filter-by-internal-squad')}
                    searchable
                    value={getFilterValue(columnFilters, 'activeInternalSquads') || null}
                />

                <Select
                    clearable
                    data={
                        externalSquads?.map((squad) => ({
                            label: squad.name,
                            value: squad.uuid
                        })) ?? []
                    }
                    label={t('constants.external-squads')}
                    onChange={(value) => updateFilter('externalSquadUuid', value)}
                    placeholder={t('users-cards.widget.filter-by-external-squad')}
                    searchable
                    value={getFilterValue(columnFilters, 'externalSquadUuid') || null}
                />

                <Tooltip label={t('action-group.feature.clear-filters')} withArrow>
                    <ActionIcon
                        color="gray"
                        onClick={onClearFilters}
                        size="input-md"
                        variant="soft"
                    >
                        <TbFilterOff size="24px" />
                    </ActionIcon>
                </Tooltip>
            </Group>

            <TrafficLimitCardsFilterFeature
                columnFilters={columnFilters}
                onChange={onFiltersChange}
            />
            </Stack>
        </Card>
    )
}
