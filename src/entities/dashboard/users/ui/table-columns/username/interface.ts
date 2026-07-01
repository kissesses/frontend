import { User } from '@entities/dashboard/users/models'

export interface IProps {
    compact?: boolean
    user: User
    variant?: 'card' | 'compact' | 'table'
}
