import { Center, Loader, Stack, Text, Title, Transition } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { TOAuth2ProvidersKeys } from '@kissesses/backend-contract'
import { IconCheck } from '@tabler/icons-react'
import { CSSProperties, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import { useOauth2Callback } from '@shared/api/hooks'
import { useConfirmDatabaseManagementOAuth } from '@shared/api/hooks/database-management/database-management.mutation.hooks'
import { useConfirmPostgresManagementOAuth } from '@shared/api/hooks/postgres-management/postgres-management.mutation.hooks'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@shared/hooks/use-auth'
import { Page } from '@shared/ui/page'
import { consumeManagementOAuthPending } from '@shared/utils/management-oauth-pending.util'
import { consumeReturnTo } from '@shared/utils/return-to.util'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'

export const Oauth2CallbackPage = () => {
    const entityAccentColor = useEntityAccentColor()
    const { provider } = useParams()
    const { setIsAuthenticated } = useAuth()
    const { t } = useTranslation()

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    const { mutate: confirmDatabaseManagementOAuth } = useConfirmDatabaseManagementOAuth()
    const { mutate: confirmPostgresManagementOAuth } = useConfirmPostgresManagementOAuth()

    const { mutate: oauth2Callback, isPending } = useOauth2Callback({
        mutationFns: {
            onSuccess: () => {
                setIsAuthenticated(true)

                const pendingTarget = consumeManagementOAuthPending()

                if (pendingTarget === 'database') {
                    confirmDatabaseManagementOAuth(
                        {},
                        {
                            onSuccess: () => {
                                navigate(ROUTES.DASHBOARD.MANAGEMENT.DATABASE_MANAGEMENT)
                            },
                            onError: (error) => {
                                notifications.show({
                                    title: t('auth.oauth-callback.database-management-title'),
                                    message: error.message,
                                    color: 'red'
                                })
                                navigate(ROUTES.DASHBOARD.MANAGEMENT.DATABASE_MANAGEMENT)
                            }
                        }
                    )
                    return
                }

                if (pendingTarget === 'postgres') {
                    confirmPostgresManagementOAuth(
                        {},
                        {
                            onSuccess: () => {
                                navigate(ROUTES.DASHBOARD.MANAGEMENT.POSTGRES_MANAGEMENT)
                            },
                            onError: (error) => {
                                notifications.show({
                                    title: t('auth.oauth-callback.postgres-management-title'),
                                    message: error.message,
                                    color: 'red'
                                })
                                navigate(ROUTES.DASHBOARD.MANAGEMENT.POSTGRES_MANAGEMENT)
                            }
                        }
                    )
                    return
                }

                navigate(consumeReturnTo() ?? ROUTES.DASHBOARD.HOME)
            },
            onError: (error) => {
                notifications.show({
                    title: t('auth.oauth-callback.title'),
                    message: error.message,
                    color: 'red'
                })
                setIsAuthenticated(false)

                navigate(ROUTES.AUTH.LOGIN)
            }
        }
    })

    useEffect(() => {
        if (code && state && provider) {
            oauth2Callback({
                variables: {
                    provider: provider as TOAuth2ProvidersKeys,
                    code,
                    state
                }
            })
        }
    }, [code, state, provider])

    return (
        <Page title={t('auth.oauth-callback.page-title')}>
            <Center style={{ minHeight: '60vh' }}>
                <Stack align="center" gap="xl">
                    <Transition
                        duration={300}
                        mounted={true}
                        timingFunction="ease"
                        transition="fade"
                    >
                        {(styles: CSSProperties) => (
                            <div style={styles}>
                                {isPending ? (
                                    <Loader size="xl" variant="dots" />
                                ) : (
                                    <IconCheck color={entityAccentColor} size={48} />
                                )}
                            </div>
                        )}
                    </Transition>
                    <div>
                        <Title mb="md" order={2} ta="center">
                            {t('auth.oauth-callback.authenticating')}
                        </Title>
                        <Text c="dimmed" ta="center">
                            {t('auth.oauth-callback.verifying')}
                        </Text>
                    </div>
                </Stack>
            </Center>
        </Page>
    )
}

export default Oauth2CallbackPage
