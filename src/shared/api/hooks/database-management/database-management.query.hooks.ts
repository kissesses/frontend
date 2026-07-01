import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetDatabaseManagementArchivesCommand,
    GetDatabaseManagementGateStatusCommand,
    GetDatabaseManagementPasskeyOptionsCommand
} from '@kissesses/backend-contract'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const databaseManagementQueryKeys = createQueryKeys('databaseManagement', {
    gateStatus: {
        queryKey: null
    },
    archives: {
        queryKey: null
    },
    passkeyOptions: {
        queryKey: null
    }
})

export const useGetDatabaseManagementGateStatus = createGetQueryHook({
    endpoint: GetDatabaseManagementGateStatusCommand.TSQ_url,
    responseSchema: GetDatabaseManagementGateStatusCommand.ResponseSchema,
    getQueryKey: () => databaseManagementQueryKeys.gateStatus.queryKey,
    rQueryParams: {
        refetchOnWindowFocus: false
    },
    errorHandler: (error) => errorHandler(error, 'Database management gate')
})

export const useGetDatabaseManagementArchives = createGetQueryHook({
    endpoint: GetDatabaseManagementArchivesCommand.TSQ_url,
    responseSchema: GetDatabaseManagementArchivesCommand.ResponseSchema,
    getQueryKey: () => databaseManagementQueryKeys.archives.queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'Database management archives')
})

export const useDatabaseManagementPasskeyOptions = createGetQueryHook({
    endpoint: GetDatabaseManagementPasskeyOptionsCommand.TSQ_url,
    responseSchema: GetDatabaseManagementPasskeyOptionsCommand.ResponseSchema,
    getQueryKey: () => databaseManagementQueryKeys.passkeyOptions.queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'Database management passkey')
})
