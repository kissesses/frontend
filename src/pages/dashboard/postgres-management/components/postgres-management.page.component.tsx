import { Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { PostgresManagementConsoleFeature } from '@features/dashboard/postgres-management/postgres-management-console/postgres-management-console.feature'
import { PostgresManagementGateFeature } from '@features/dashboard/postgres-management/postgres-management-gate'
import { ManagementElevatedSessionActionsFeature } from '@features/dashboard/management-elevated-session'
import { useTranslation } from 'react-i18next'
import { TbDatabase } from 'react-icons/tb'

import {
    useGetPostgresManagementGateStatus,
    useGetPostgresTables
} from '@shared/api/hooks/postgres-management/postgres-management.query.hooks'
import { useRevokePostgresManagementGate } from '@shared/api/hooks/postgres-management/postgres-management.mutation.hooks'
import { LoadingScreen, PageHeaderShared } from '@shared/ui'

export const PostgresManagementPageComponent = () => {
    const { t } = useTranslation()

    const { data: gateStatus, refetch: refetchGateStatus } = useGetPostgresManagementGateStatus()

    const { data: tablesData, refetch: refetchTables } = useGetPostgresTables({
        rQueryParams: {
            enabled: Boolean(gateStatus?.isElevated)
        }
    })

    const { mutate: revokeGate, isPending: isRevokingGate } = useRevokePostgresManagementGate({
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
                    title={t('constants.postgres-management')}
                />
                <PostgresManagementGateFeature
                    gateStatus={gateStatus}
                    onElevated={() => {
                        refetchGateStatus()
                        refetchTables()
                    }}
                />
            </Stack>
        )
    }

    if (!tablesData) {
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
                title={t('constants.postgres-management')}
            />

            <PostgresManagementConsoleFeature
                tables={tablesData.tables}
                telegramConfigured={gateStatus.telegramConfigured}
            />
        </Stack>
    )
}
