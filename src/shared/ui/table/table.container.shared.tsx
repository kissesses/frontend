import { Card, CardProps } from '@mantine/core'
import clsx from 'clsx'

type TableContainerSharedProps = CardProps

export function TableContainerShared({ children, className, withBorder = true, ...props }: TableContainerSharedProps) {
    return (
        <Card className={clsx('app-table-card', className)} withBorder={withBorder} {...props}>
            {children}
        </Card>
    )
}
