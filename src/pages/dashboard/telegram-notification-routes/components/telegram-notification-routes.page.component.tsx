import { Container } from '@mantine/core'
import { GetTelegramNotificationRoutesCommand } from '@remnawave/backend-contract'
import { TelegramRoutesSettingsWidget } from '@widgets/telegram-notification-routes/telegram-routes-settings.widget'
import { useTranslation } from 'react-i18next'
import { TbBrandTelegram } from 'react-icons/tb'

import { Page, PageHeaderShared } from '@shared/ui'

interface IProps {
    routes: GetTelegramNotificationRoutesCommand.Response['response']
}

export const TelegramNotificationRoutesPageComponent = (props: IProps) => {
    const { routes } = props
    const { t } = useTranslation()

    return (
        <Page title={t('constants.telegram-notification-routes')}>
            <PageHeaderShared
                icon={<TbBrandTelegram size={24} />}
                title={t('constants.telegram-notification-routes')}
            />
            <Container fluid p={0} size="md">
                <TelegramRoutesSettingsWidget routes={routes} />
            </Container>
        </Page>
    )
}
