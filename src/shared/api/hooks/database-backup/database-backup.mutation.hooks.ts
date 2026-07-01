import { notifications } from '@mantine/notifications'
import {
    RunDatabaseBackupNowCommand,
    UpdateDatabaseBackupSettingsCommand
} from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateDatabaseBackupSettings = createMutationHook({
    endpoint: UpdateDatabaseBackupSettingsCommand.TSQ_url,
    bodySchema: UpdateDatabaseBackupSettingsCommand.RequestSchema,
    responseSchema: UpdateDatabaseBackupSettingsCommand.ResponseSchema,
    requestMethod: UpdateDatabaseBackupSettingsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Database backup settings updated',
                color: 'teal'
            })
        }
    }
})

export const useRunDatabaseBackupNow = createMutationHook({
    endpoint: RunDatabaseBackupNowCommand.TSQ_url,
    responseSchema: RunDatabaseBackupNowCommand.ResponseSchema,
    requestMethod: RunDatabaseBackupNowCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Backup queued',
                message: 'Database backup started. Check Telegram when it completes.',
                color: 'teal'
            })
        }
    }
})
