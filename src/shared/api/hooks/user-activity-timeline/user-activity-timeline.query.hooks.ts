import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetUserActivityTimelineCommand,
    GetUserActivityTimelineStatsCommand
} from '@kissesses/backend-contract'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const userActivityTimelineQueryKeys = createQueryKeys('userActivityTimeline', {
    getUserActivityTimeline: (filters: GetUserActivityTimelineCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getUserActivityTimelineStats: {
        queryKey: null
    }
})

const STALE_TIME = 15_000
const REFETCH_INTERVAL = 15_100

export const useGetUserActivityTimeline = createGetQueryHook({
    endpoint: GetUserActivityTimelineCommand.TSQ_url,
    responseSchema: GetUserActivityTimelineCommand.ResponseSchema,
    requestQuerySchema: GetUserActivityTimelineCommand.RequestQuerySchema,
    getQueryKey: ({ query }) =>
        userActivityTimelineQueryKeys.getUserActivityTimeline(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => errorHandler(error, 'Get User Activity Timeline')
})

export const useGetUserActivityTimelineStats = createGetQueryHook({
    endpoint: GetUserActivityTimelineStatsCommand.TSQ_url,
    responseSchema: GetUserActivityTimelineStatsCommand.ResponseSchema,
    getQueryKey: () => userActivityTimelineQueryKeys.getUserActivityTimelineStats.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    errorHandler: (error) => errorHandler(error, 'Get User Activity Timeline Stats')
})
