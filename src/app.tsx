import '@mantine/carousel/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/code-highlight/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/nprogress/styles.css'
import '@mantine/spotlight/styles.css'
import '@kastov/mantine-react-table-open/styles.css'
import '@gfazioli/mantine-list-view-table/styles.css'
import '@kastov/mantine-datatable/styles.css'
import '@shared/constants/theme/app-tokens.css'
import '@shared/constants/theme/themes/noctis/tokens.css'
import './global.css'
import { Center, DirectionProvider, MantineProvider, v8CssVariablesResolver } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { NavigationProgress } from '@mantine/nprogress'
import { QueryClientProvider } from '@tanstack/react-query'
// import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Suspense, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'

import { getMantineTheme } from '@shared/constants/theme'
import { AuthProvider } from '@shared/hocs/auth-provider'
import { ThemeApplier } from '@shared/hocs/theme-applier'
// import { StrictMode } from 'react'
import { IsMobileProvider } from '@shared/hocs/is-mobile-provider'
import { LoadingScreen } from '@shared/ui'

import { useUiTheme } from '@entities/dashboard/view-preferences-store'

import i18n from './app/i18n/i18n'
import { Router } from './app/router/router'
import { queryClient } from './shared/api'

dayjs.extend(customParseFormat)

polyfillCountryFlagEmojis()

function AppProviders() {
    const uiTheme = useUiTheme()
    const mantineTheme = getMantineTheme(uiTheme)

    return (
        <ThemeApplier>
            <MantineProvider
                cssVariablesResolver={v8CssVariablesResolver}
                defaultColorScheme="dark"
                deduplicateInlineStyles
                theme={mantineTheme}
            >
                <ModalsProvider>
                    <Notifications position="top-right" />
                    <NavigationProgress />
                    <Suspense
                        fallback={
                            <Center h="100%">
                                <LoadingScreen height="60vh" />
                            </Center>
                        }
                    >
                        <Router />
                    </Suspense>
                </ModalsProvider>
            </MantineProvider>
        </ThemeApplier>
    )
}

export function App() {
    const isDev = __NODE_ENV__ === 'development'

    useEffect(() => {
        const root = document.getElementById('root')
        if (root) {
            const bottomBar = document.createElement('div')
            bottomBar.className = 'safe-area-bottom'
            root.appendChild(bottomBar)
        }
    }, [])

    // useEffect(() => {
    //     hideSplashScreen()
    // }, [])

    return (
        // <StrictMode>
        <I18nextProvider defaultNS="" i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                {isDev && <ReactQueryDevtools initialIsOpen={false} />}
                <AuthProvider>
                    <IsMobileProvider>
                        <DirectionProvider>
                            <AppProviders />
                        </DirectionProvider>
                    </IsMobileProvider>
                </AuthProvider>
            </QueryClientProvider>
        </I18nextProvider>
        // </StrictMode>
    )
}
