import { createQueryKeys } from '@lukemorales/query-key-factory'
import { CheckHwidBlockedStatusCommand, GetBlockedHwidsCommand } from '@kissesses/backend-contract'
import { keepPreviousData, useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

import { sToMs } from '@shared/utils/time-utils'

import { instance } from '../../axios'
import { createUrl } from '../../helpers'
import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const blockedHwidsQueryKeys = createQueryKeys('blocked-hwids', {
    getBlockedHwids: (filters: GetBlockedHwidsCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    checkBlockedStatus: (hwid: string) => ({
        queryKey: ['status', hwid]
    })
})

export const useGetBlockedHwids = createGetQueryHook({
    endpoint: GetBlockedHwidsCommand.TSQ_url,
    responseSchema: GetBlockedHwidsCommand.ResponseSchema,
    requestQuerySchema: GetBlockedHwidsCommand.RequestQuerySchema,
    getQueryKey: ({ query }) => blockedHwidsQueryKeys.getBlockedHwids(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => errorHandler(error, 'Get Blocked HWIDs')
})

export const useCheckHwidBlockedStatus = createGetQueryHook({
    endpoint: CheckHwidBlockedStatusCommand.TSQ_url,
    responseSchema: CheckHwidBlockedStatusCommand.ResponseSchema,
    routeParamsSchema: CheckHwidBlockedStatusCommand.RequestSchema,
    getQueryKey: ({ route }) =>
        blockedHwidsQueryKeys.checkBlockedStatus(route!.hwid).queryKey,
    rQueryParams: {
        staleTime: sToMs(20)
    },
    errorHandler: (error) => errorHandler(error, 'Check HWID Blocked Status')
})

export function useHwidBlockedStatusMap(hwids: string[]) {
    const uniqueHwids = useMemo(() => [...new Set(hwids)], [hwids])

    const results = useQueries({
        queries: uniqueHwids.map((hwid) => ({
            queryKey: blockedHwidsQueryKeys.checkBlockedStatus(hwid).queryKey,
            queryFn: async () => {
                const url = createUrl(CheckHwidBlockedStatusCommand.TSQ_url, undefined, { hwid })
                const response = await instance.get(url)
                const parsed = await CheckHwidBlockedStatusCommand.ResponseSchema.safeParseAsync(
                    response.data
                )

                if (!parsed.success) {
                    throw parsed.error
                }

                return parsed.data.response
            },
            staleTime: sToMs(20)
        }))
    })

    return useMemo(() => {
        const map = new Map<string, boolean>()

        uniqueHwids.forEach((hwid, index) => {
            map.set(hwid, results[index]?.data?.isBlocked ?? false)
        })

        return map
    }, [uniqueHwids, results])
}
