import { notifications } from '@mantine/notifications'
import {
    LoginCommand,
    LogoutCommand,
    OAuth2AuthorizeCommand,
    OAuth2CallbackCommand,
    RegisterCommand,
    VerifyPasskeyAuthenticationCommand
} from '@kissesses/backend-contract'

import { setAuthenticated } from '@entities/auth/session-store'

import { createMutationHook } from '../../tsq-helpers'

export const AUTH_QUERY_KEY = 'auth'

export const useLogin = createMutationHook({
    endpoint: LoginCommand.TSQ_url,
    bodySchema: LoginCommand.RequestSchema,
    responseSchema: LoginCommand.ResponseSchema,
    requestMethod: LoginCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            setAuthenticated(true)
        },
        onError: (error) => {
            notifications.show({
                title: 'Login',
                message: error.message,
                color: 'red'
            })
        }
    }
})

export const useRegister = createMutationHook({
    endpoint: RegisterCommand.TSQ_url,
    bodySchema: RegisterCommand.RequestSchema,
    responseSchema: RegisterCommand.ResponseSchema,
    requestMethod: RegisterCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Register',
                message: 'User registered successfully',
                color: 'teal'
            })
            setAuthenticated(true)
        },
        onError: (error) => {
            notifications.show({
                title: 'Register',
                message: error.message,
                color: 'red'
            })
        }
    }
})

export const useOauth2Callback = createMutationHook({
    endpoint: OAuth2CallbackCommand.TSQ_url,
    bodySchema: OAuth2CallbackCommand.RequestSchema,
    responseSchema: OAuth2CallbackCommand.ResponseSchema,
    requestMethod: OAuth2CallbackCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            setAuthenticated(true)
        }
    }
})

export const useOAuth2Authorize = createMutationHook({
    endpoint: OAuth2AuthorizeCommand.TSQ_url,
    bodySchema: OAuth2AuthorizeCommand.RequestSchema,
    responseSchema: OAuth2AuthorizeCommand.ResponseSchema,
    requestMethod: OAuth2AuthorizeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: 'OAuth2 Authorize',
                message: error.message,
                color: 'red'
            })
        }
    }
})

export const usePasskeyAuthenticationVerify = createMutationHook({
    endpoint: VerifyPasskeyAuthenticationCommand.TSQ_url,
    bodySchema: VerifyPasskeyAuthenticationCommand.RequestSchema,
    responseSchema: VerifyPasskeyAuthenticationCommand.ResponseSchema,
    requestMethod: VerifyPasskeyAuthenticationCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Passkey Verified',
                message: 'Passkey authenticated successfully',
                color: 'teal'
            })

            setAuthenticated(true)
        }
    }
})

export const useLogout = createMutationHook({
    endpoint: LogoutCommand.TSQ_url,
    responseSchema: LogoutCommand.ResponseSchema,
    requestMethod: LogoutCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSettled: () => {
            setAuthenticated(false)
        }
    }
})
