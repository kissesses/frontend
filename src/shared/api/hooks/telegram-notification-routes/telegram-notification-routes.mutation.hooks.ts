import { notifications } from '@mantine/notifications'
import {
    CreateTelegramNotificationTopicsCommand,
    UpdateTelegramNotificationRoutesCommand
} from '@kissesses/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateTelegramNotificationRoutes = createMutationHook({
    endpoint: UpdateTelegramNotificationRoutesCommand.TSQ_url,
    bodySchema: UpdateTelegramNotificationRoutesCommand.RequestSchema,
    responseSchema: UpdateTelegramNotificationRoutesCommand.ResponseSchema,
    requestMethod: UpdateTelegramNotificationRoutesCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Telegram routes updated successfully',
                color: 'teal'
            })
        }
    }
})

export const useCreateTelegramNotificationTopics = createMutationHook({
    endpoint: CreateTelegramNotificationTopicsCommand.TSQ_url,
    responseSchema: CreateTelegramNotificationTopicsCommand.ResponseSchema,
    requestMethod: CreateTelegramNotificationTopicsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Telegram forum topics created successfully',
                color: 'teal'
            })
        }
    }
})
