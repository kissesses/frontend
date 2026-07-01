import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { IActions, IState } from './interfaces'

export const useSessionStore = create<IActions & IState>()(
    devtools(
        (set) => ({
            isAuthenticated: false,
            actions: {
                setAuthenticated: (isAuthenticated: boolean) => {
                    set({ isAuthenticated })
                },
                clearSession: () => {
                    set({ isAuthenticated: false })
                }
            }
        }),
        { name: 'sessionStore', anonymousActionType: 'sessionStore' }
    )
)

export const useIsAuthenticated = () => useSessionStore((state) => state.isAuthenticated)
export const useSessionStoreActions = () => useSessionStore((state) => state.actions)

export const setAuthenticated = (isAuthenticated: boolean) =>
    useSessionStore.setState({ isAuthenticated })
export const clearSession = () => useSessionStore.getState().actions.clearSession()

// Legacy aliases for gradual migration
export const removeToken = clearSession
export const useToken = () => useIsAuthenticated()
