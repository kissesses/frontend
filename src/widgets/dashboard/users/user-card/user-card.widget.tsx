import { Badge, Box, Checkbox, Paper, Text } from '@mantine/core'
import { GetAllNodesCommand, GetAllUsersCommand } from '@kissesses/backend-contract'
import ColorHash from 'color-hash'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbStar } from 'react-icons/tb'

import { DataUsageColumnEntity } from '@entities/dashboard/users/ui'
import { ConnectedNodeColumnEntity } from '@entities/dashboard/users/ui/table-columns/connected-node'
import { StatusColumnEntity } from '@entities/dashboard/users/ui/table-columns/status'
import { UsernameColumnEntity } from '@entities/dashboard/users/ui/table-columns/username'

import classes from './user-card.module.css'

const tagColorHash = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

export interface IProps {
    isSelected?: boolean
    node?: GetAllNodesCommand.Response['response'][number]
    onOpen: (uuid: string) => void
    onSelect?: (uuid: string) => void
    user: GetAllUsersCommand.Response['response']['users'][number]
}

export const UserCardWidget = memo(function UserCardWidget(props: IProps) {
    const { isSelected, node, onOpen, onSelect, user } = props
    const { t } = useTranslation()
    const tagColor = useMemo(() => (user.tag ? tagColorHash.hex(user.tag) : undefined), [user.tag])

    return (
        <Paper
            className={classes.card}
            data-selected={isSelected || undefined}
            onClick={() => onOpen(user.uuid)}
            p="md"
            radius="md"
            withBorder={false}
        >
            <Box className={classes.inner}>
                <Box className={classes.header}>
                    <Box className={classes.contentArea}>
                        <UsernameColumnEntity user={user} variant="card" />
                        {user.tag && tagColor && (
                            <Badge
                                autoContrast
                                className={classes.tag}
                                color={tagColor}
                                leftSection={<TbStar size={11} />}
                                size="xs"
                                variant="light"
                            >
                                {user.tag}
                            </Badge>
                        )}
                    </Box>
                    <Checkbox
                        checked={isSelected}
                        className={classes.checkbox}
                        color="cyan"
                        onChange={(event) => {
                            event.stopPropagation()
                            onSelect?.(user.uuid)
                        }}
                        onClick={(event) => event.stopPropagation()}
                        size="sm"
                        variant="filled"
                    />
                </Box>

                <Box className={classes.metaRow}>
                    <StatusColumnEntity user={user} variant="card" />
                </Box>

                <Box className={classes.trafficSection}>
                    <DataUsageColumnEntity user={user} variant="card" />
                </Box>

                <Box className={classes.footer}>
                    <Text c="dimmed" className={classes.footerLabel}>
                        {t('user-card.widget.last-connected-node')}
                    </Text>
                    <Box className={classes.footerValue}>
                        <ConnectedNodeColumnEntity node={node} size="sm" />
                    </Box>
                </Box>

                {user.description && (
                    <Box className={classes.descriptionSlot}>
                        <Text c="dimmed" className={classes.description} lineClamp={2} size="xs">
                            {user.description}
                        </Text>
                    </Box>
                )}
            </Box>
        </Paper>
    )
})
