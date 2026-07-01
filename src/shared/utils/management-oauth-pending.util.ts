const MGMT_OAUTH_PENDING_KEY = 'mgmtOAuthElevation'

export type ManagementOAuthTarget = 'database' | 'postgres'

export const setManagementOAuthPending = (target: ManagementOAuthTarget) => {
    sessionStorage.setItem(MGMT_OAUTH_PENDING_KEY, target)
}

export const consumeManagementOAuthPending = (): ManagementOAuthTarget | null => {
    const value = sessionStorage.getItem(MGMT_OAUTH_PENDING_KEY)

    sessionStorage.removeItem(MGMT_OAUTH_PENDING_KEY)

    if (value === 'database' || value === 'postgres') {
        return value
    }

    return null
}
