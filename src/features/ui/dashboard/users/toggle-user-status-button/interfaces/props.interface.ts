import { GetUserByUuidCommand } from '@kissesses/backend-contract'

export interface IProps {
    user: GetUserByUuidCommand.Response['response']
}
