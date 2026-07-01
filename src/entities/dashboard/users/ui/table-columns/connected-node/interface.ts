import { GetAllNodesCommand } from '@kissesses/backend-contract'

export interface IProps {
    node: GetAllNodesCommand.Response['response'][number] | undefined
    size?: 'md' | 'sm'
}
