import { GetInternalSquadsCommand } from '@kissesses/backend-contract'

export interface IProps {
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
}
