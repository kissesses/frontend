import { GetAllNodesCommand } from '@kissesses/backend-contract'

export interface IProps {
    nodes: GetAllNodesCommand.Response['response'] | undefined
}
