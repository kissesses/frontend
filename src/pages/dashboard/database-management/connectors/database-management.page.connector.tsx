import { useTranslation } from 'react-i18next'

import { Page } from '@shared/ui/page'

import { DatabaseManagementPageComponent } from '../components/database-management.page.component'

export const DatabaseManagementConnector = () => {
    const { t } = useTranslation()

    return (
        <Page title={t('constants.database-management')}>
            <DatabaseManagementPageComponent />
        </Page>
    )
}
