import { Group, NativeSelect, NumberInput, Stack, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { MRT_ColumnFiltersState } from '@kastov/mantine-react-table-open'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    bestFitIecUnitUtil,
    bytesToUnitUtil,
    IEC_UNITS,
    TIecUnit,
    unitToBytesUtil
} from '@shared/utils/bytes'

type TRange = [null | string, null | string]
type TValues = [number | string, number | string]

interface IProps {
    columnFilters: MRT_ColumnFiltersState
    onChange: (filters: MRT_ColumnFiltersState) => void
}

const FILTER_DEBOUNCE_MS = 400

const toBytes = (bound: null | string): null | number => {
    if (bound === null || bound === '') return null
    const num = Number(bound)
    return Number.isFinite(num) ? num : null
}

function getRangeFilterValue(
    filters: MRT_ColumnFiltersState,
    id: string
): TRange | undefined {
    const filter = filters.find((item) => item.id === id)

    if (!Array.isArray(filter?.value) || filter.value.length !== 2) {
        return undefined
    }

    return [filter.value[0] ?? null, filter.value[1] ?? null]
}

function upsertRangeFilter(
    filters: MRT_ColumnFiltersState,
    id: string,
    value: TRange | undefined
): MRT_ColumnFiltersState {
    const next = filters.filter((filter) => filter.id !== id)

    if (value && (value[0] !== null || value[1] !== null)) {
        next.push({ id, value })
    }

    return next
}

export const TrafficLimitCardsFilterFeature = (props: IProps) => {
    const { columnFilters, onChange } = props
    const { t } = useTranslation()

    const filterValue = getRangeFilterValue(columnFilters, 'trafficLimitBytes')
    const columnFiltersRef = useRef(columnFilters)
    columnFiltersRef.current = columnFilters

    const [unit, setUnit] = useState<TIecUnit>(() => {
        const [min, max] = filterValue ?? [null, null]
        return bestFitIecUnitUtil(toBytes(min) ?? toBytes(max))
    })

    const [values, setValues] = useState<TValues>(() => {
        const [min, max] = filterValue ?? [null, null]
        const fitUnit = bestFitIecUnitUtil(toBytes(min) ?? toBytes(max))
        return [
            bytesToUnitUtil(toBytes(min), fitUnit) ?? '',
            bytesToUnitUtil(toBytes(max), fitUnit) ?? ''
        ]
    })

    const [prevFilterValue, setPrevFilterValue] = useState(filterValue)
    if (filterValue !== prevFilterValue) {
        setPrevFilterValue(filterValue)
        if (filterValue === undefined && (values[0] !== '' || values[1] !== '')) {
            setValues(['', ''])
        }
        if (filterValue) {
            const fitUnit = bestFitIecUnitUtil(
                toBytes(filterValue[0]) ?? toBytes(filterValue[1])
            )
            setUnit(fitUnit)
            setValues([
                bytesToUnitUtil(toBytes(filterValue[0]), fitUnit) ?? '',
                bytesToUnitUtil(toBytes(filterValue[1]), fitUnit) ?? ''
            ])
        }
    }

    const [debouncedValues] = useDebouncedValue(values, FILTER_DEBOUNCE_MS)
    const [debouncedUnit] = useDebouncedValue(unit, FILTER_DEBOUNCE_MS)
    const isMounted = useRef(false)

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }

        const toBound = (value: number | string): null | string => {
            const bytes = unitToBytesUtil(value, debouncedUnit)
            return bytes === undefined ? null : String(bytes)
        }

        const next: TRange = [toBound(debouncedValues[0]), toBound(debouncedValues[1])]
        const normalized =
            next[0] === null && next[1] === null ? undefined : next

        const current = getRangeFilterValue(columnFiltersRef.current, 'trafficLimitBytes')
        const unchanged =
            (current === undefined && normalized === undefined) ||
            (Array.isArray(current) &&
                Array.isArray(normalized) &&
                current[0] === normalized[0] &&
                current[1] === normalized[1])

        if (!unchanged) {
            onChange(
                upsertRangeFilter(columnFiltersRef.current, 'trafficLimitBytes', normalized)
            )
        }
    }, [debouncedValues, debouncedUnit, onChange])

    return (
        <Stack gap={4}>
            <Text fw={500} size="sm">
                {t('traffic-limits-card.traffic-limit')}
            </Text>
            <Group align="flex-end" gap="sm" wrap="wrap">
                <NumberInput
                    allowNegative={false}
                    flex={1}
                    hideControls
                    label={t('users-cards.widget.traffic-limit-min')}
                    miw={120}
                    onChange={(value) => setValues(([, currentMax]) => [value, currentMax])}
                    placeholder={t('users-cards.widget.traffic-limit-min')}
                    thousandSeparator=","
                    value={values[0]}
                />
                <NumberInput
                    allowNegative={false}
                    flex={1}
                    hideControls
                    label={t('users-cards.widget.traffic-limit-max')}
                    miw={120}
                    onChange={(value) => setValues(([currentMin]) => [currentMin, value])}
                    placeholder={t('users-cards.widget.traffic-limit-max')}
                    thousandSeparator=","
                    value={values[1]}
                />
                <NativeSelect
                    aria-label={t('users-cards.widget.traffic-limit-unit')}
                    data={IEC_UNITS}
                    label={t('users-cards.widget.traffic-limit-unit')}
                    onChange={(event) => setUnit(event.currentTarget.value as TIecUnit)}
                    styles={{ input: { fontWeight: 600 } }}
                    value={unit}
                    w={90}
                />
            </Group>
        </Stack>
    )
}
