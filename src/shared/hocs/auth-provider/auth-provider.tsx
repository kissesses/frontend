import { GetSessionCommand } from '@remnawave/backend-contract'
import consola from 'consola/browser'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

import { instance } from '@shared/api/axios'
import { logoutEvents } from '@shared/emitters'
import { resetAllStores } from '@shared/hocs/store-wrapper'

import { clearSession, setAuthenticated, useIsAuthenticated } from '@entities/auth'

interface AuthContextValues {
    isAuthenticated: boolean
    isInitialized: boolean
    setIsAuthenticated: (isAuthenticated: boolean) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValues | null>(null)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false)
    const [isLoggedOut, setIsLoggedOut] = useState(false)
    const isAuthenticated = useIsAuthenticated()

    const logoutUser = () => {
        if (isLoggedOut) {
            return
        }

        try {
            setIsLoggedOut(true)
            clearSession()
            resetAllStores()
        } finally {
            setIsLoggedOut(false)
        }
    }

    useEffect(() => {
        const unsubscribe = logoutEvents.subscribe(() => {
            logoutUser()
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        ;(async () => {
            try {
                await instance.request({
                    method: GetSessionCommand.endpointDetails.REQUEST_METHOD,
                    url: GetSessionCommand.url
                })
                setAuthenticated(true)
            } catch (error) {
                consola.debug(error)
                clearSession()
            } finally {
                setIsInitialized(true)
            }
        })()
    }, [])

    const value = useMemo(
        () => ({
            isAuthenticated,
            isInitialized,
            setIsAuthenticated: setAuthenticated
        }),
        [isAuthenticated, isInitialized]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
