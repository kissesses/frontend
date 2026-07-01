import { Card, Group, Select, TextInput } from '@mantine/core'
import { MRT_ColumnFiltersState } from '@kastov/mantine-react-table-open'
import { useTranslation } from 'react-i18next'
import { TbFilter, TbSearch, TbUser } from 'react-icons/tb'

import { USER_ACTIVITY_EVENT_TYPES } from '@entities/dashboard/user-activity-timeline/constants'
import {
    UserActivityEventTypeBadge,
    useUserActivityEventTypeLabel
} from '@entities/dashboard/user-activity-timeline/ui'
import {
    useUserActivityTimelineTableStore,
    useUserActivityTimelineTableStoreActions
} from '@entities/dashboard/user-activity-timeline/user-activity-timeline-table-store'

function upsertFilter(
    filters: MRT_ColumnFiltersState,
    id: string,
    value: string | null
): MRT_ColumnFiltersState {
    const next = filters.filter((filter) => filter.id !== id)

    if (value) {
        next.push({ id, value })
    }

    return next
}

function getFilterValue(filters: MRT_ColumnFiltersState, id: string): string {
    const filter = filters.find((item) => item.id === id)
    return typeof filter?.value === 'string' ? filter.value : ''
}

export function UserActivityTimelineFiltersFeature() {
    const { t } = useTranslation()
    const getEventTypeLabel = useUserActivityEventTypeLabel()
    const columnFilters = useUserActivityTimelineTableStore((s) => s.columnFilter)
    const { setColumnFilter } = useUserActivityTimelineTableStoreActions()

    const updateFilter = (id: string, value: string | null) => {
        setColumnFilter(upsertFilter(columnFilters, id, value))
    }

    return (
        <Card p="md" radius="sm" withBorder>
            <Group align="flex-end" gap="md" wrap="wrap">
                <TextInput
                    label={t('user-activity-timeline-filters.username')}
                    leftSection={<TbUser size={16} />}
                    onChange={(e) => updateFilter('username', e.currentTarget.value || null)}
                    placeholder={t('user-activity-timeline-filters.username-placeholder')}
                    value={getFilterValue(columnFilters, 'username')}
                    w={220}
                />
                <TextInput
                    label={t('user-activity-timeline-filters.user-id')}
                    leftSection={<TbSearch size={16} />}
                    onChange={(e) => updateFilter('userId', e.currentTarget.value || null)}
                    placeholder="12345"
                    value={getFilterValue(columnFilters, 'userId')}
                    w={160}
                />
                <Select
                    clearable
                    comboboxProps={{ withinPortal: true }}
                    data={USER_ACTIVITY_EVENT_TYPES.map((eventType) => ({
                        value: eventType,
                        label: getEventTypeLabel(eventType)
                    }))}
                    label={t('user-activity-timeline-filters.event-type')}
                    leftSection={<TbFilter size={16} />}
                    onChange={(value) => updateFilter('eventType', value)}
                    placeholder={t('user-activity-timeline-filters.event-type-placeholder')}
                    renderOption={({ option }) => (
                        <UserActivityEventTypeBadge eventType={option.value} />
                    )}
                    value={getFilterValue(columnFilters, 'eventType') || null}
                    w={280}
                />
            </Group>
        </Card>
    )
}
