import { OAuth2LoginButtonsFeature } from '@features/auth/oauth2-login-button/oauth2-login-button.feature'
import { TOAuth2ProvidersKeys } from '@kissesses/backend-contract'
import { GetStatusCommand } from '@kissesses/backend-contract'
import { useState } from 'react'

import { useOAuth2Authorize } from '@shared/api/hooks'
import { usePreparePostgresManagementOAuth } from '@shared/api/hooks/postgres-management/postgres-management.mutation.hooks'
import { setManagementOAuthPending } from '@shared/utils/management-oauth-pending.util'

interface IProps {
    authentication: NonNullable<GetStatusCommand.Response['response']['authentication']>
}

export const PostgresManagementOAuthButtonsFeature = (props: IProps) => {
    const { authentication } = props
    const [loadingProvider, setLoadingProvider] = useState<null | TOAuth2ProvidersKeys>(null)
    const { mutateAsync: prepareOAuth } = usePreparePostgresManagementOAuth()
    const { mutate: oauth2Authorize } = useOAuth2Authorize({
        mutationFns: {
            onSuccess: (data) => {
                if (data.authorizationUrl) {
                    window.location.assign(data.authorizationUrl)
                }

                setTimeout(() => {
                    setLoadingProvider(null)
                }, 1000)
            },
            onError: () => {
                setLoadingProvider(null)
            }
        }
    })

    const handleProviderClick = async (provider: TOAuth2ProvidersKeys) => {
        setLoadingProvider(provider)

        try {
            await prepareOAuth({})
            setManagementOAuthPending('postgres')
            oauth2Authorize({ variables: { provider } })
        } catch {
            setLoadingProvider(null)
        }
    }

    return (
        <OAuth2LoginButtonsFeature
            authentication={authentication}
            loadingProvider={loadingProvider}
            onProviderClick={handleProviderClick}
        />
    )
}
