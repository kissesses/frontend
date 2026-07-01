import { useGetDatabaseBackupSettings } from '@shared/api/hooks/database-backup/database-backup.query.hooks'

import { LoadingScreen } from '@shared/ui/loading-screen'

import { DatabaseBackupPageComponent } from '../components/database-backup.page.component'

export const DatabaseBackupConnector = () => {
    const { data: settings } = useGetDatabaseBackupSettings()

    if (!settings) {
        return <LoadingScreen />
    }

    return <DatabaseBackupPageComponent settings={settings} />
}
