import { ActionIcon, ActionIconProps, Box, PolymorphicComponentProps } from '@mantine/core'

import { useEntityAccentColor } from '@shared/hocs/theme-applier'

import classes from './entity-card.module.css'

interface EntityCardIconProps extends PolymorphicComponentProps<'button', ActionIconProps> {
    highlight?: boolean
}

export function EntityCardIcon({ children, highlight = true, ...props }: EntityCardIconProps) {
    const accentColor = useEntityAccentColor()

    return (
        <Box className={classes.iconWrapper}>
            <ActionIcon
                className={classes.icon}
                color={highlight ? accentColor : 'gray'}
                size="xl"
                variant="soft"
                {...props}
            >
                {children}
            </ActionIcon>
        </Box>
    )
}
