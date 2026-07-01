import { useGetTelegramNotificationRoutes } from '@shared/api/hooks/telegram-notification-routes/telegram-notification-routes.query.hooks'
import { LoadingScreen } from '@shared/ui/loading-screen'

import { TelegramNotificationRoutesPageComponent } from '../components/telegram-notification-routes.page.component'

export const TelegramNotificationRoutesConnector = () => {
    const { data: routes } = useGetTelegramNotificationRoutes()

    if (!routes) {
        return <LoadingScreen />
    }

    return <TelegramNotificationRoutesPageComponent routes={routes} />
}
