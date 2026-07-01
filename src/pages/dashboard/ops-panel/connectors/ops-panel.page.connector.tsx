import { OpsPanelPageComponent } from '@pages/dashboard/ops-panel/components/ops-panel.page.component'
import { useTranslation } from 'react-i18next'

import { useGetRemnawaveHealth, useGetSystemStats } from '@shared/api/hooks'
import { LoadingScreen, Page } from '@shared/ui'

export const OpsPanelPageConnector = () => {
    const { t } = useTranslation()
    const { data: systemInfo } = useGetSystemStats()
    const { data: remnawaveHealth } = useGetRemnawaveHealth()

    if (!systemInfo || !remnawaveHealth) {
        return <LoadingScreen />
    }

    return (
        <Page title={t('ops-panel.title')}>
            <OpsPanelPageComponent remnawaveHealth={remnawaveHealth} systemInfo={systemInfo} />
        </Page>
    )
}
