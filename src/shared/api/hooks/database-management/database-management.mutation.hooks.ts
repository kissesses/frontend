import { notifications } from '@mantine/notifications'
import { t } from 'i18next'
import {
    PrepareDatabaseManagementOAuthCommand,
    RequestDatabaseManagementCodeCommand,
    ConfirmDatabaseManagementOAuthCommand,
    VerifyDatabaseManagementCodeCommand,
    VerifyDatabaseManagementPasskeyCommand,
    VerifyDatabaseManagementPasswordCommand,
    RevokeDatabaseManagementGateCommand
} from '@kissesses/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useRequestDatabaseManagementCode = createMutationHook({
    endpoint: RequestDatabaseManagementCodeCommand.TSQ_url,
    responseSchema: RequestDatabaseManagementCodeCommand.ResponseSchema,
    requestMethod: RequestDatabaseManagementCodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: t('database-management.gate.code-sent-title'),
                message: t('database-management.gate.code-sent-message'),
                color: 'teal'
            })
        }
    }
})

export const useVerifyDatabaseManagementCode = createMutationHook({
    endpoint: VerifyDatabaseManagementCodeCommand.TSQ_url,
    bodySchema: VerifyDatabaseManagementCodeCommand.RequestSchema,
    responseSchema: VerifyDatabaseManagementCodeCommand.ResponseSchema,
    requestMethod: VerifyDatabaseManagementCodeCommand.endpointDetails.REQUEST_METHOD
})

export const useVerifyDatabaseManagementPassword = createMutationHook({
    endpoint: VerifyDatabaseManagementPasswordCommand.TSQ_url,
    bodySchema: VerifyDatabaseManagementPasswordCommand.RequestSchema,
    responseSchema: VerifyDatabaseManagementPasswordCommand.ResponseSchema,
    requestMethod: VerifyDatabaseManagementPasswordCommand.endpointDetails.REQUEST_METHOD
})

export const useVerifyDatabaseManagementPasskey = createMutationHook({
    endpoint: VerifyDatabaseManagementPasskeyCommand.TSQ_url,
    bodySchema: VerifyDatabaseManagementPasskeyCommand.RequestSchema,
    responseSchema: VerifyDatabaseManagementPasskeyCommand.ResponseSchema,
    requestMethod: VerifyDatabaseManagementPasskeyCommand.endpointDetails.REQUEST_METHOD
})

export const usePrepareDatabaseManagementOAuth = createMutationHook({
    endpoint: PrepareDatabaseManagementOAuthCommand.TSQ_url,
    responseSchema: PrepareDatabaseManagementOAuthCommand.ResponseSchema,
    requestMethod: PrepareDatabaseManagementOAuthCommand.endpointDetails.REQUEST_METHOD
})

export const useConfirmDatabaseManagementOAuth = createMutationHook({
    endpoint: ConfirmDatabaseManagementOAuthCommand.TSQ_url,
    responseSchema: ConfirmDatabaseManagementOAuthCommand.ResponseSchema,
    requestMethod: ConfirmDatabaseManagementOAuthCommand.endpointDetails.REQUEST_METHOD
})

export const useRevokeDatabaseManagementGate = createMutationHook({
    endpoint: RevokeDatabaseManagementGateCommand.TSQ_url,
    responseSchema: RevokeDatabaseManagementGateCommand.ResponseSchema,
    requestMethod: RevokeDatabaseManagementGateCommand.endpointDetails.REQUEST_METHOD
})
