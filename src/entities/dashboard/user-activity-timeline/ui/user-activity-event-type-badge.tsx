import { Badge } from '@mantine/core'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TUserActivityEventType } from '@entities/dashboard/user-activity-timeline/constants'

const EVENT_COLOR_MAP: Partial<Record<TUserActivityEventType, string>> = {
    'user.created': 'green',
    'user.deleted': 'red',
    'user.disabled': 'orange',
    'user.enabled': 'teal',
    'user.expired': 'red',
    'user.first_connected': 'blue',
    'user.subscription_request': 'grape',
    'user_hwid_devices.added': 'cyan',
    'user_hwid_devices.deleted': 'pink'
}

export const useUserActivityEventTypeLabel = () => {
    const { t } = useTranslation()

    return useMemo(() => {
        return (eventType: string) =>
            t(`user-activity-timeline.event-types.${eventType}`, { defaultValue: eventType })
    }, [t])
}

export function UserActivityEventTypeBadge({ eventType }: { eventType: string }) {
    const getLabel = useUserActivityEventTypeLabel()
    const color = EVENT_COLOR_MAP[eventType as TUserActivityEventType] ?? 'gray'

    return (
        <Badge color={color} size="sm" variant="light">
            {getLabel(eventType)}
        </Badge>
    )
}
