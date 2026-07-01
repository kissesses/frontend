import { GetDatabaseBackupSettingsCommand } from '@kissesses/backend-contract'
import { DatabaseBackupSettingsWidget } from '@widgets/database-backup/database-backup-settings.widget'

import { Page } from '@shared/ui/page'

interface IProps {
    settings: GetDatabaseBackupSettingsCommand.Response['response']
}

export const DatabaseBackupPageComponent = (props: IProps) => {
    const { settings } = props

    return (
        <Page title="database-backup.page.title">
            <DatabaseBackupSettingsWidget settings={settings} />
        </Page>
    )
}
