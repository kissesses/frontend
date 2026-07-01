import { MRT_TableInstance } from '@kastov/mantine-react-table-open'
/* eslint-disable camelcase */
import { GetAllUsersCommand } from '@kissesses/backend-contract'

import { USERS_VIEW_MODE } from '@entities/dashboard/view-preferences-store'

export interface IProps {
    isLoading: boolean
    refetch: () => void
    setViewMode?: (viewMode: USERS_VIEW_MODE) => void
    table?: MRT_TableInstance<GetAllUsersCommand.Response['response']['users'][0]>
    viewMode?: USERS_VIEW_MODE
}
