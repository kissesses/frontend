import { Box, Card, Stack } from '@mantine/core'
import clsx from 'clsx'
import { useState } from 'react'

import { EntityCardContext } from './entity-card.context'
import classes from './entity-card.module.css'

interface EntityCardProps {
    children: React.ReactNode
    withTopAccent?: boolean
}

export function EntityCardRoot({ children, withTopAccent = true }: EntityCardProps) {
    const [menuOpened, setMenuOpened] = useState(false)

    return (
        <EntityCardContext.Provider value={{ menuOpened, setMenuOpened }}>
            <Box
                className={clsx(classes.cardWrapper, {
                    [classes.inactive]: !withTopAccent
                })}
            >
                <Card className={classes.card} h="100%" p="xl" shadow="sm" withBorder>
                    <Box
                        className={clsx({
                            [classes.topAccent]: withTopAccent,
                            [classes.inactiveTopAccent]: !withTopAccent
                        })}
                    />

                    <Box className={classes.glowEffect} />

                    <Stack gap="lg" justify="space-between" style={{ flex: 1 }}>
                        {children}
                    </Stack>
                </Card>
            </Box>
        </EntityCardContext.Provider>
    )
}
