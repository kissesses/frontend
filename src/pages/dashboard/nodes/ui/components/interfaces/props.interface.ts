import { GetAllNodesCommand } from '@kissesses/backend-contract'

export interface IProps {
    isLoading: boolean
    nodes: GetAllNodesCommand.Response['response'] | undefined
}
