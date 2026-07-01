import { GetConfigProfilesCommand } from '@kissesses/backend-contract'

export interface Props {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
}
