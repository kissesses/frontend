import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetPostgresManagementGateStatusCommand,
    GetPostgresManagementPasskeyOptionsCommand,
    GetPostgresTablesCommand
} from '@kissesses/backend-contract'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const postgresManagementQueryKeys = createQueryKeys('postgresManagement', {
    gateStatus: {
        queryKey: null
    },
    tables: {
        queryKey: null
    },
    passkeyOptions: {
        queryKey: null
    }
})

export const useGetPostgresManagementGateStatus = createGetQueryHook({
    endpoint: GetPostgresManagementGateStatusCommand.TSQ_url,
    responseSchema: GetPostgresManagementGateStatusCommand.ResponseSchema,
    getQueryKey: () => postgresManagementQueryKeys.gateStatus.queryKey,
    rQueryParams: {
        refetchOnWindowFocus: false
    },
    errorHandler: (error) => errorHandler(error, 'PostgreSQL management gate')
})

export const useGetPostgresTables = createGetQueryHook({
    endpoint: GetPostgresTablesCommand.TSQ_url,
    responseSchema: GetPostgresTablesCommand.ResponseSchema,
    getQueryKey: () => postgresManagementQueryKeys.tables.queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'PostgreSQL tables')
})

export const usePostgresManagementPasskeyOptions = createGetQueryHook({
    endpoint: GetPostgresManagementPasskeyOptionsCommand.TSQ_url,
    responseSchema: GetPostgresManagementPasskeyOptionsCommand.ResponseSchema,
    getQueryKey: () => postgresManagementQueryKeys.passkeyOptions.queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'PostgreSQL management passkey')
})
