import { TOAuth2ProvidersKeys } from '@kissesses/backend-contract'
import { GetStatusCommand } from '@kissesses/backend-contract'

export interface IProps {
    authentication: NonNullable<GetStatusCommand.Response['response']['authentication']>
    loadingProvider?: null | TOAuth2ProvidersKeys
    onProviderClick?: (provider: TOAuth2ProvidersKeys) => void | Promise<void>
}
