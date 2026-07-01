import { createMrtTableStore } from '@shared/lib/mrt-table-store'

export const useUserActivityTimelineTableStore = createMrtTableStore({
    name: 'x-rmnw-user-activity-timeline-table',
    version: 1
})

export const useUserActivityTimelineTableStoreActions = () =>
    useUserActivityTimelineTableStore((store) => store.actions)
