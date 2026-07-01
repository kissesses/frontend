import { GetSubscriptionSettingsCommand } from '@kissesses/backend-contract'

export interface IProps {
    subscriptionSettings: GetSubscriptionSettingsCommand.Response['response']
}
