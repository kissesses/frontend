import { GetConfigProfilesCommand } from '@kissesses/backend-contract'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
}
