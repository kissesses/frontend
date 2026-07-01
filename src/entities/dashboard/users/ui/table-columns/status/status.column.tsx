import { Group, Stack, Text } from '@mantine/core'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { useTranslation } from 'react-i18next'

import { getExpirationTextUtil } from '@shared/utils/time-utils'

import { IProps } from './interface'

export function StatusColumnEntity(props: IProps) {
    const { t, i18n } = useTranslation()

    const { need = 'both', user, variant = 'table' } = props

    const expirationText = getExpirationTextUtil(user.expireAt, t, i18n)

    if (need === 'badge') {
        return <UserStatusBadge miw="13ch" status={user.status} />
    }

    if (need === 'date') {
        return (
            <Text c="dimmed" size="xs">
                {expirationText}
            </Text>
        )
    }

    if (variant === 'card') {
        return (
            <Group gap="xs" justify="space-between" miw={0} wrap="nowrap" w="100%">
                <UserStatusBadge miw="auto" size="sm" status={user.status} />
                <Text c="dimmed" size="xs" ta="right" truncate>
                    {expirationText}
                </Text>
            </Group>
        )
    }

    return (
        <Stack gap="xs">
            <UserStatusBadge status={user.status} />
            <Text c="dimmed" size="xs">
                {expirationText}
            </Text>
        </Stack>
    )
}
