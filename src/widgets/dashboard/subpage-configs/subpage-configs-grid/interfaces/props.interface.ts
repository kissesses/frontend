import { GetSubscriptionPageConfigsCommand } from '@kissesses/backend-contract'

export interface IProps {
    configs: GetSubscriptionPageConfigsCommand.Response['response']['configs']
}
