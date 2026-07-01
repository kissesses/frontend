import { GetInternalSquadsCommand } from '@kissesses/backend-contract'

export interface Props {
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
}
