import { notifications } from '@mantine/notifications'
import { BlockHwidCommand, UnblockHwidCommand } from '@remnawave/backend-contract'
import { useQueryClient } from '@tanstack/react-query'

import { createMutationHook } from '../../tsq-helpers'

export const useBlockHwid = createMutationHook({
    endpoint: BlockHwidCommand.TSQ_url,
    bodySchema: BlockHwidCommand.RequestSchema,
    responseSchema: BlockHwidCommand.ResponseSchema,
    requestMethod: BlockHwidCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'HWID blocked successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: 'Block HWID',
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUnblockHwid = createMutationHook({
    endpoint: UnblockHwidCommand.TSQ_url,
    routeParamsSchema: UnblockHwidCommand.RequestSchema,
    responseSchema: UnblockHwidCommand.ResponseSchema,
    requestMethod: UnblockHwidCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'HWID unblocked successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: 'Unblock HWID',
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBlockHwidWithInvalidation = () => {
    const queryClient = useQueryClient()
    return useBlockHwid({
        mutationFns: {
            onSuccess: () => {
                void queryClient.invalidateQueries({ queryKey: ['blocked-hwids'] })
                void queryClient.invalidateQueries({ queryKey: ['hwid-user-devices'] })
                void queryClient.invalidateQueries({ queryKey: ['blocked-hwids', 'status'] })
            }
        }
    })
}

export const useUnblockHwidWithInvalidation = () => {
    const queryClient = useQueryClient()
    return useUnblockHwid({
        mutationFns: {
            onSuccess: () => {
                void queryClient.invalidateQueries({ queryKey: ['blocked-hwids'] })
                void queryClient.invalidateQueries({ queryKey: ['hwid-user-devices'] })
                void queryClient.invalidateQueries({ queryKey: ['blocked-hwids', 'status'] })
            }
        }
    })
}
