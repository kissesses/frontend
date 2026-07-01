import { GetOneNodeCommand } from '@kissesses/backend-contract'

export interface IProps {
    handleClose: () => void
    node: GetOneNodeCommand.Response['response']
}
