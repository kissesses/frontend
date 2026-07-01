import { createQueryKeys } from '@lukemorales/query-key-factory'
import { GetDatabaseBackupSettingsCommand } from '@kissesses/backend-contract'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const databaseBackupQueryKeys = createQueryKeys('databaseBackup', {
    getSettings: {
        queryKey: null
    }
})

export const useGetDatabaseBackupSettings = createGetQueryHook({
    endpoint: GetDatabaseBackupSettingsCommand.TSQ_url,
    responseSchema: GetDatabaseBackupSettingsCommand.ResponseSchema,
    getQueryKey: () => databaseBackupQueryKeys.getSettings.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5),
        refetchInterval: (query) => {
            const data = query.state.data as
                | GetDatabaseBackupSettingsCommand.Response['response']
                | undefined

            return data?.lastBackupStatus === 'running' ? sToMs(3) : false
        }
    },
    errorHandler: (error) => errorHandler(error, 'Get database backup settings')
})
