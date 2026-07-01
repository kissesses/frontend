import { useMediaQuery } from '@mantine/hooks'
import { OpsPanelUnlockBridge } from '@features/ops-panel'

import { useIsMobile } from '@shared/hooks'
import { HeaderControls } from '@shared/ui/header-buttons'

import { useIsLoadingRemnawaveUpdates, useRemnawaveInfo } from '@entities/dashboard/updates-store'
import { LAYOUT_STYLE, useLayoutStyle } from '@entities/dashboard/view-preferences-store'

import { DASHBOARD_LINKS } from './layout-shared'
import { CompactLayout } from './layout-variants/compact.layout'
import { MobileLayout } from './layout-variants/mobile.layout'
import { SidebarLayout } from './layout-variants/sidebar.layout'

export function MainLayout() {
    const layoutStyle = useLayoutStyle()

    const isMobile = useIsMobile()

    const isHiResDesktop = useMediaQuery(`(min-width: 2048px)`, undefined, {
        getInitialValueInEffect: false
    })

    const remnawaveInfo = useRemnawaveInfo()
    const isLoadingUpdates = useIsLoadingRemnawaveUpdates()

    const headerControls = (
        <HeaderControls
            {...DASHBOARD_LINKS}
            isGithubLoading={isLoadingUpdates}
            stars={remnawaveInfo.starsCount || undefined}
            withGithub={!isMobile}
            withPrime
            withRecap={false}
            withSupport={false}
            withTelegram={false}
        />
    )

    if (isMobile) {
        return (
            <>
                <OpsPanelUnlockBridge />
                <MobileLayout
                headerControls={headerControls}
                isSocialButtons={isMobile}
                isLoadingUpdates={isLoadingUpdates}
                remnawaveInfo={remnawaveInfo}
                />
            </>
        )
    }

    if (layoutStyle === LAYOUT_STYLE.SIDEBAR) {
        return (
            <>
                <OpsPanelUnlockBridge />
                <SidebarLayout headerControls={headerControls} />
            </>
        )
    }

    return (
        <>
            <OpsPanelUnlockBridge />
            <CompactLayout headerControls={headerControls} isHiResDesktop={isHiResDesktop} />
        </>
    )
}
