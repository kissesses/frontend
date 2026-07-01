import { Box, Divider, Group, Stack, Text, ThemeIcon, ThemeIconProps, Title } from '@mantine/core'
import { ReactNode } from 'react'

import { usePrimaryColorName } from '@shared/hocs/theme-applier'

import classes from './settings-card.module.css'

interface SettingsCardHeaderProps {
    description: ReactNode | string
    icon: ReactNode
    iconColor?: ThemeIconProps['color']
    iconVariant: ThemeIconProps['variant']
    title: string
}

export function SettingsCardHeader({
    description,
    icon,
    iconColor: iconColorProp,
    iconVariant,
    title
}: SettingsCardHeaderProps) {
    const primaryColor = usePrimaryColorName()
    const iconColor = iconColorProp ?? primaryColor
    return (
        <Box>
            <Group align="flex-start" justify="space-between">
                <Group align="flex-start" gap="md" wrap="nowrap">
                    <ThemeIcon color={iconColor} size="xl" variant={iconVariant}>
                        {icon}
                    </ThemeIcon>

                    <Stack gap={0}>
                        <Title order={4}>{title}</Title>
                        <Text c="dimmed" size="sm">
                            {description}
                        </Text>
                    </Stack>
                </Group>
            </Group>

            <Divider className={classes.divider} my="md" />
        </Box>
    )
}
