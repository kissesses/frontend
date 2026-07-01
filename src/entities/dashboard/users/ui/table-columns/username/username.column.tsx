import { Box, Group, Indicator, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { getConnectionStatusColorUtil, getTimeAgoUtil } from '@shared/utils/time-utils'

import { IProps } from '@entities/dashboard/users/ui/table-columns/username/interface'

export function UsernameColumnEntity(props: IProps) {
    const { t, i18n } = useTranslation()

    const { user, variant = 'table' } = props
    const isCard = variant === 'card'

    const color = getConnectionStatusColorUtil(user.userTraffic.onlineAt)
    const timeAgo = getTimeAgoUtil(user.userTraffic.onlineAt, t, i18n.language)

    return (
        <Group align="center" gap={isCard ? 'sm' : 'md'} pl={isCard ? 0 : 10} wrap="nowrap">
            <Indicator color={color} inline size={isCard ? 10 : 12} zIndex={0} />
            <Box miw={0} w="100%">
                <Text fw={isCard ? 600 : 500} size={isCard ? 'md' : 'sm'} truncate="end">
                    {user.username}
                </Text>
                <Text c="dimmed" fw={isCard ? 500 : 600} mt={2} size="xs">
                    {timeAgo}
                </Text>
            </Box>
        </Group>
    )
}
