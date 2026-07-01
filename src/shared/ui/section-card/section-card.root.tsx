import { Card, CardProps, Divider, MantineSpacing, Stack } from '@mantine/core'
import clsx from 'clsx'
import { Children, ReactNode, RefObject } from 'react'

import classes from './section-card.module.css'

interface ISectionCardRootProps extends Omit<CardProps, 'children'> {
    children: ReactNode
    dividerOpacity?: number
    gap?: MantineSpacing
    ref?: RefObject<HTMLDivElement | null>
}

export function SectionCardRoot({
    children,
    dividerOpacity,
    gap = 'md',
    p = 'md',
    radius = 'lg',
    className,
    ref,
    ...props
}: ISectionCardRootProps) {
    const childArray = Children.toArray(children).filter(Boolean)

    const childrenWithDividers = childArray.reduce<ReactNode[]>((acc, child, index) => {
        acc.push(child)

        if (index < childArray.length - 1) {
            acc.push(
                <Divider
                    key={`divider-${index}`}
                    className={classes.divider}
                    style={dividerOpacity !== undefined ? { opacity: dividerOpacity } : undefined}
                />
            )
        }

        return acc
    }, [])

    return (
        <Card className={clsx(classes.root, className)} p={p} radius={radius} ref={ref} withBorder {...props}>
            <Stack gap={gap}>{childrenWithDividers}</Stack>
        </Card>
    )
}
