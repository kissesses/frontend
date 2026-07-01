import { GetExternalSquadsCommand } from '@kissesses/backend-contract'

export interface Props {
    externalSquads: GetExternalSquadsCommand.Response['response']['externalSquads']
}
