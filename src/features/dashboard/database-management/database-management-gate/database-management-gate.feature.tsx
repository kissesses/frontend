import { DatabaseManagementOAuthButtonsFeature } from '@features/dashboard/database-management/database-management-oauth/database-management-oauth.feature'
import {
    Alert,
    Button,
    Center,
    Divider,
    Group,
    Paper,
    PasswordInput,
    PinInput,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { GetDatabaseManagementGateStatusCommand } from '@kissesses/backend-contract'
import {
    type PublicKeyCredentialRequestOptionsJSON,
    startAuthentication
} from '@simplewebauthn/browser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbBrandTelegram, TbFingerprint, TbLock } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import {
    useRequestDatabaseManagementCode,
    useVerifyDatabaseManagementCode,
    useVerifyDatabaseManagementPasskey,
    useVerifyDatabaseManagementPassword
} from '@shared/api/hooks/database-management/database-management.mutation.hooks'
import { useDatabaseManagementPasskeyOptions } from '@shared/api/hooks/database-management/database-management.query.hooks'

interface IProps {
    gateStatus: GetDatabaseManagementGateStatusCommand.Response['response']
    onElevated: () => void
}

export const DatabaseManagementGateFeature = (props: IProps) => {
    const { gateStatus, onElevated } = props
    const { t } = useTranslation()
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [isPasskeyLoading, setIsPasskeyLoading] = useState(false)

    const { mutate: requestCode, isPending: isRequestingCode } =
        useRequestDatabaseManagementCode()
    const { mutate: verifyCode, isPending: isVerifyingCode } =
        useVerifyDatabaseManagementCode()
    const { mutate: verifyPassword, isPending: isVerifyingPassword } =
        useVerifyDatabaseManagementPassword()
    const { mutateAsync: verifyPasskey, isPending: isVerifyingPasskey } =
        useVerifyDatabaseManagementPasskey()
    const { refetch: refetchPasskeyOptions } = useDatabaseManagementPasskeyOptions()

    const invalidateGate = () => {
        queryClient.invalidateQueries({
            queryKey: QueryKeys.databaseManagement.gateStatus.queryKey
        })
    }

    const handleElevated = () => {
        invalidateGate()
        onElevated()
    }

    const handleVerifyCode = () => {
        if (code.length < 6) return

        verifyCode(
            { variables: { code } },
            {
                onSuccess: () => {
                    setCode('')
                    handleElevated()
                }
            }
        )
    }

    const handleVerifyPassword = () => {
        verifyPassword(
            { variables: { password } },
            {
                onSuccess: () => {
                    setPassword('')
                    handleElevated()
                }
            }
        )
    }

    const handlePasskey = async () => {
        setIsPasskeyLoading(true)

        try {
            const optionsResponse = await refetchPasskeyOptions()
            if (!optionsResponse.data) {
                return
            }

            const authenticationResponse = await startAuthentication({
                optionsJSON: optionsResponse.data as PublicKeyCredentialRequestOptionsJSON
            })

            await verifyPasskey({
                variables: {
                    response: authenticationResponse
                }
            })

            handleElevated()
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'NotAllowedError') {
                notifications.show({
                    title: t('database-management.gate.passkey-cancelled'),
                    message: t('database-management.gate.passkey-cancelled-message'),
                    color: 'yellow'
                })
            }
        } finally {
            setIsPasskeyLoading(false)
        }
    }

    const { alternativeMethods, authMode } = gateStatus
    const hasOAuth2 = Object.values(alternativeMethods.oauth2).some(Boolean)
    const hasAlternativePrimary = alternativeMethods.passkey || hasOAuth2
    const isAlternativeMode = authMode === 'alternative'
    const showPasswordFallback = isAlternativeMode && alternativeMethods.password

    const authenticationForOAuth = {
        passkey: { enabled: alternativeMethods.passkey },
        oauth2: { providers: alternativeMethods.oauth2 },
        password: { enabled: alternativeMethods.password }
    }

    return (
        <Center mih="50vh" px="md">
            <Paper maw={440} p="xl" radius="md" w="100%" withBorder>
                <Stack gap="lg">
                    <Stack gap="xs">
                        <Title order={3}>{t('database-management.gate.title')}</Title>
                        <Text c="dimmed" size="sm">
                            {authMode === 'telegram'
                                ? t('database-management.gate.telegram-description')
                                : t('database-management.gate.alternative-description')}
                        </Text>
                    </Stack>

                    {authMode === 'telegram' ? (
                        <Stack gap="md">
                            <Button
                                leftSection={<TbBrandTelegram size={18} />}
                                loading={isRequestingCode}
                                onClick={() => requestCode({})}
                                variant="light"
                            >
                                {t('database-management.gate.send-code')}
                            </Button>

                            <Stack gap="xs">
                                <Text fw={500} size="sm">
                                    {t('database-management.gate.enter-code')}
                                </Text>
                                <Group justify="center">
                                    <PinInput
                                        length={6}
                                        onChange={setCode}
                                        onComplete={handleVerifyCode}
                                        oneTimeCode
                                        type="number"
                                        value={code}
                                    />
                                </Group>
                                <Button
                                    disabled={code.length < 6}
                                    loading={isVerifyingCode}
                                    onClick={handleVerifyCode}
                                >
                                    {t('database-management.gate.verify')}
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack gap="md">
                            {alternativeMethods.passkey && (
                                <Button
                                    leftSection={<TbFingerprint size={18} />}
                                    loading={isPasskeyLoading || isVerifyingPasskey}
                                    onClick={handlePasskey}
                                    variant="light"
                                >
                                    {t('database-management.gate.passkey')}
                                </Button>
                            )}

                            {hasOAuth2 && (
                                <DatabaseManagementOAuthButtonsFeature
                                    authentication={authenticationForOAuth}
                                />
                            )}

                            {!hasAlternativePrimary && !alternativeMethods.password && (
                                <Alert color="yellow" variant="light">
                                    {t('database-management.gate.no-methods')}
                                </Alert>
                            )}
                        </Stack>
                    )}

                    {showPasswordFallback && (
                        <>
                            {hasAlternativePrimary && (
                                <Divider label={t('database-management.gate.or-password')} />
                            )}
                            <Stack gap="sm">
                                <PasswordInput
                                    label={t('database-management.gate.password-label')}
                                    leftSection={<TbLock size={16} />}
                                    onChange={(event) => setPassword(event.currentTarget.value)}
                                    value={password}
                                />
                                <Button
                                    disabled={!password}
                                    loading={isVerifyingPassword}
                                    onClick={handleVerifyPassword}
                                >
                                    {t('database-management.gate.confirm-password')}
                                </Button>
                            </Stack>
                        </>
                    )}
                </Stack>
            </Paper>
        </Center>
    )
}
