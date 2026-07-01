import { GetExternalSquadsCommand } from '@kissesses/backend-contract'

export interface IProps {
    externalSquads: GetExternalSquadsCommand.Response['response']['externalSquads']
}
