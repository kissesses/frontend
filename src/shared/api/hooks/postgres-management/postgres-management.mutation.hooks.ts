import { notifications } from '@mantine/notifications'
import { t } from 'i18next'
import {
    AnalyzePostgresQueryCommand,
    ConfirmPostgresManagementOAuthCommand,
    ExecutePostgresQueryCommand,
    PreparePostgresManagementOAuthCommand,
    RequestPostgresManagementCodeCommand,
    RequestPostgresQueryConfirmationCommand,
    RevokePostgresManagementGateCommand,
    VerifyPostgresManagementCodeCommand,
    VerifyPostgresManagementPasskeyCommand,
    VerifyPostgresManagementPasswordCommand,
    VerifyPostgresQueryConfirmationCommand
} from '@kissesses/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useRequestPostgresManagementCode = createMutationHook({
    endpoint: RequestPostgresManagementCodeCommand.TSQ_url,
    responseSchema: RequestPostgresManagementCodeCommand.ResponseSchema,
    requestMethod: RequestPostgresManagementCodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: t('postgres-management.gate.code-sent-title'),
                message: t('postgres-management.gate.code-sent-message'),
                color: 'teal'
            })
        }
    }
})

export const useVerifyPostgresManagementCode = createMutationHook({
    endpoint: VerifyPostgresManagementCodeCommand.TSQ_url,
    bodySchema: VerifyPostgresManagementCodeCommand.RequestSchema,
    responseSchema: VerifyPostgresManagementCodeCommand.ResponseSchema,
    requestMethod: VerifyPostgresManagementCodeCommand.endpointDetails.REQUEST_METHOD
})

export const useVerifyPostgresManagementPassword = createMutationHook({
    endpoint: VerifyPostgresManagementPasswordCommand.TSQ_url,
    bodySchema: VerifyPostgresManagementPasswordCommand.RequestSchema,
    responseSchema: VerifyPostgresManagementPasswordCommand.ResponseSchema,
    requestMethod: VerifyPostgresManagementPasswordCommand.endpointDetails.REQUEST_METHOD
})

export const useVerifyPostgresManagementPasskey = createMutationHook({
    endpoint: VerifyPostgresManagementPasskeyCommand.TSQ_url,
    bodySchema: VerifyPostgresManagementPasskeyCommand.RequestSchema,
    responseSchema: VerifyPostgresManagementPasskeyCommand.ResponseSchema,
    requestMethod: VerifyPostgresManagementPasskeyCommand.endpointDetails.REQUEST_METHOD
})

export const usePreparePostgresManagementOAuth = createMutationHook({
    endpoint: PreparePostgresManagementOAuthCommand.TSQ_url,
    responseSchema: PreparePostgresManagementOAuthCommand.ResponseSchema,
    requestMethod: PreparePostgresManagementOAuthCommand.endpointDetails.REQUEST_METHOD
})

export const useConfirmPostgresManagementOAuth = createMutationHook({
    endpoint: ConfirmPostgresManagementOAuthCommand.TSQ_url,
    responseSchema: ConfirmPostgresManagementOAuthCommand.ResponseSchema,
    requestMethod: ConfirmPostgresManagementOAuthCommand.endpointDetails.REQUEST_METHOD
})

export const useAnalyzePostgresQuery = createMutationHook({
    endpoint: AnalyzePostgresQueryCommand.TSQ_url,
    bodySchema: AnalyzePostgresQueryCommand.RequestSchema,
    responseSchema: AnalyzePostgresQueryCommand.ResponseSchema,
    requestMethod: AnalyzePostgresQueryCommand.endpointDetails.REQUEST_METHOD
})

export const useRequestPostgresQueryConfirmation = createMutationHook({
    endpoint: RequestPostgresQueryConfirmationCommand.TSQ_url,
    bodySchema: RequestPostgresQueryConfirmationCommand.RequestSchema,
    responseSchema: RequestPostgresQueryConfirmationCommand.ResponseSchema,
    requestMethod: RequestPostgresQueryConfirmationCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: t('postgres-management.console.confirmation-sent-title'),
                message: t('postgres-management.console.confirmation-sent-message'),
                color: 'teal'
            })
        }
    }
})

export const useVerifyPostgresQueryConfirmation = createMutationHook({
    endpoint: VerifyPostgresQueryConfirmationCommand.TSQ_url,
    bodySchema: VerifyPostgresQueryConfirmationCommand.RequestSchema,
    responseSchema: VerifyPostgresQueryConfirmationCommand.ResponseSchema,
    requestMethod: VerifyPostgresQueryConfirmationCommand.endpointDetails.REQUEST_METHOD
})

export const useExecutePostgresQuery = createMutationHook({
    endpoint: ExecutePostgresQueryCommand.TSQ_url,
    bodySchema: ExecutePostgresQueryCommand.RequestSchema,
    responseSchema: ExecutePostgresQueryCommand.ResponseSchema,
    requestMethod: ExecutePostgresQueryCommand.endpointDetails.REQUEST_METHOD
})

export const useRevokePostgresManagementGate = createMutationHook({
    endpoint: RevokePostgresManagementGateCommand.TSQ_url,
    responseSchema: RevokePostgresManagementGateCommand.ResponseSchema,
    requestMethod: RevokePostgresManagementGateCommand.endpointDetails.REQUEST_METHOD
})
