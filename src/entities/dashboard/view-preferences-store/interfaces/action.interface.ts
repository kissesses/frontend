import { UI_THEME } from '@shared/constants/theme'

import { CONFIG_PROFILES_VIEW_MODE, HOSTS_VIEW_MODE, NODES_VIEW_MODE, USERS_VIEW_MODE } from './enums'

export interface IActions {
    actions: {
        resetState: () => void
        setConfigProfilesViewMode: (mode: CONFIG_PROFILES_VIEW_MODE) => void
        setHostsActiveTag: (tag: null | string) => void
        setHostsViewMode: (mode: HOSTS_VIEW_MODE) => void
        setNodesActiveTag: (tag: null | string) => void
        setNodesViewMode: (mode: NODES_VIEW_MODE) => void
        setUsersViewMode: (mode: USERS_VIEW_MODE) => void
        setUiTheme: (theme: UI_THEME) => void
        toggleLayoutStyle: () => void
    }
}
