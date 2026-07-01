import { Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { DatabaseManagementArchivesFeature } from '@features/dashboard/database-management/database-management-archives/database-management-archives.feature'
import { DatabaseManagementGateFeature } from '@features/dashboard/database-management/database-management-gate'
import { ManagementElevatedSessionActionsFeature } from '@features/dashboard/management-elevated-session'
import { DatabaseBackupSettingsWidget } from '@widgets/database-backup/database-backup-settings.widget'
import { useTranslation } from 'react-i18next'
import { TbDatabase } from 'react-icons/tb'

import {
    useGetDatabaseManagementArchives,
    useGetDatabaseManagementGateStatus
} from '@shared/api/hooks/database-management/database-management.query.hooks'
import { useRevokeDatabaseManagementGate } from '@shared/api/hooks/database-management/database-management.mutation.hooks'
import { useGetDatabaseBackupSettings } from '@shared/api/hooks/database-backup/database-backup.query.hooks'
import { LoadingScreen, PageHeaderShared } from '@shared/ui'

export const DatabaseManagementPageComponent = () => {
    const { t } = useTranslation()

    const { data: gateStatus, refetch: refetchGateStatus } = useGetDatabaseManagementGateStatus()

    const { data: backupSettings } = useGetDatabaseBackupSettings({
        rQueryParams: {
            enabled: Boolean(gateStatus?.isElevated),
            retry: false
        }
    })

    const { data: archives, refetch: refetchArchives } = useGetDatabaseManagementArchives({
        rQueryParams: {
            enabled: Boolean(gateStatus?.isElevated)
        }
    })

    const { mutate: revokeGate, isPending: isRevokingGate } = useRevokeDatabaseManagementGate({
        mutationFns: {
            onSuccess: () => {
                notifications.show({
                    title: t('management-elevated-session.revoked-title'),
                    message: t('management-elevated-session.revoked-message'),
                    color: 'teal'
                })
                refetchGateStatus()
            }
        }
    })

    const handleRevoke = () => {
        revokeGate({})
    }

    if (!gateStatus) {
        return <LoadingScreen />
    }

    if (!gateStatus.isElevated) {
        return (
            <Stack gap="md">
                <PageHeaderShared
                    icon={<TbDatabase size={24} />}
                    title={t('constants.database-management')}
                />
                <DatabaseManagementGateFeature
                    gateStatus={gateStatus}
                    onElevated={() => {
                        refetchGateStatus()
                        refetchArchives()
                    }}
                />
            </Stack>
        )
    }

    if (!backupSettings) {
        return <LoadingScreen />
    }

    return (
        <Stack gap="md">
            <PageHeaderShared
                actions={
                    <ManagementElevatedSessionActionsFeature
                        elevatedUntil={gateStatus.elevatedUntil}
                        isRevoking={isRevokingGate}
                        onRevoke={handleRevoke}
                    />
                }
                icon={<TbDatabase size={24} />}
                title={t('constants.database-management')}
            />

            <DatabaseBackupSettingsWidget settings={backupSettings} />

            {archives && <DatabaseManagementArchivesFeature archives={archives} />}
        </Stack>
    )
}
