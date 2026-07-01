export interface IActions {
    actions: {
        clearSession: () => void
        setAuthenticated: (isAuthenticated: boolean) => void
    }
}
