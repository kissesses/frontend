import { GetOneNodeCommand } from '@kissesses/backend-contract'

export interface IProps {
    node: GetOneNodeCommand.Response['response']
}
