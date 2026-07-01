import { Badge, BadgeProps } from '@mantine/core'
import { TUsersStatus, USERS_STATUS } from '@remnawave/backend-contract'
import { PiClockCountdown, PiClockUser, PiProhibit, PiPulse } from 'react-icons/pi'

interface IProps extends Omit<BadgeProps, 'children' | 'color'> {
    status: TUsersStatus
}

const ICON_SIZE: Record<NonNullable<BadgeProps['size']>, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
}

export function UserStatusBadge({ size = 'lg', status, ...props }: IProps) {
    let icon: React.ReactNode
    let color: BadgeProps['color'] = 'gray'
    const iconSize = ICON_SIZE[size] ?? 18

    switch (status) {
        case USERS_STATUS.ACTIVE:
            icon = <PiPulse size={iconSize} />
            color = 'teal'
            break
        case USERS_STATUS.DISABLED:
            icon = <PiProhibit size={iconSize} />
            color = 'shaded-gray'
            break
        case USERS_STATUS.EXPIRED:
            icon = <PiClockUser size={iconSize} />
            color = 'red'
            break
        case USERS_STATUS.LIMITED:
            icon = <PiClockCountdown size={iconSize} />
            color = 'orange'
            break
        default:
            break
    }

    return (
        <Badge color={color} leftSection={icon} size={size} variant="soft" {...props}>
            {status}
        </Badge>
    )
}
