import { createQueryKeys } from '@lukemorales/query-key-factory'
import { GetTelegramNotificationRoutesCommand } from '@remnawave/backend-contract'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const telegramNotificationRoutesQueryKeys = createQueryKeys('telegramNotificationRoutes', {
    getRoutes: {
        queryKey: null
    }
})

export const useGetTelegramNotificationRoutes = createGetQueryHook({
    endpoint: GetTelegramNotificationRoutesCommand.TSQ_url,
    responseSchema: GetTelegramNotificationRoutesCommand.ResponseSchema,
    getQueryKey: () => telegramNotificationRoutesQueryKeys.getRoutes.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Telegram notification routes')
})
