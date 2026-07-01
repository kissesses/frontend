import {
    Alert,
    Badge,
    Button,
    Group,
    Paper,
    Select,
    Stack,
    Switch,
    Text,
    TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
    GetDatabaseBackupSettingsCommand,
    UpdateDatabaseBackupSettingsCommand
} from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { TbDatabaseExport, TbDeviceFloppy, TbPlayerPlay } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import {
    useRunDatabaseBackupNow,
    useUpdateDatabaseBackupSettings
} from '@shared/api/hooks/database-backup/database-backup.mutation.hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'

import {
    DATABASE_BACKUP_SCHEDULE_CRON,
    DATABASE_BACKUP_SCHEDULE_LABELS,
    DATABASE_BACKUP_SCHEDULE_PRESETS
} from './database-backup.constants'

interface IProps {
    settings: GetDatabaseBackupSettingsCommand.Response['response']
}

const statusColor = {
    success: 'teal',
    failed: 'red',
    running: 'blue'
} as const

export const DatabaseBackupSettingsWidget = (props: IProps) => {
    const { settings } = props
    const { t } = useTranslation()

    const form = useForm<UpdateDatabaseBackupSettingsCommand.Request>({
        name: 'database-backup-settings',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateDatabaseBackupSettingsCommand.RequestSchema),
        initialValues: {
            enabled: settings.enabled,
            schedulePreset: settings.schedulePreset,
            customCronExpression: settings.customCronExpression,
            notifyOnSuccess: settings.notifyOnSuccess,
            notifyOnFailure: settings.notifyOnFailure
        }
    })

    const { mutate: updateSettings, isPending: isUpdating } = useUpdateDatabaseBackupSettings({
        mutationFns: {
            onSuccess() {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.databaseBackup.getSettings.queryKey
                })
            },
            onError(error) {
                handleFormErrors(form, error)
            }
        }
    })

    const { mutate: runBackup, isPending: isRunning } = useRunDatabaseBackupNow({
        mutationFns: {
            onSuccess() {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.databaseBackup.getSettings.queryKey
                })
            }
        }
    })

    const handleSubmit = form.onSubmit((values) => {
        updateSettings({
            variables: values
        })
    })

    const schedulePreset = form.getValues().schedulePreset ?? settings.schedulePreset
    const presetCron =
        schedulePreset !== 'custom'
            ? DATABASE_BACKUP_SCHEDULE_CRON[schedulePreset]
            : form.getValues().customCronExpression

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t('database-backup.widget.description')}
                    icon={<TbDatabaseExport size={24} />}
                    iconColor="grape"
                    iconVariant="soft"
                    title={t('database-backup.widget.title')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Alert color="blue" variant="light">
                            {t('database-backup.widget.hint')}
                        </Alert>

                        <Alert color="gray" variant="light">
                            {t('database-backup.widget.volume-hint')}
                        </Alert>

                        <Switch
                            key={form.key('enabled')}
                            label={t('database-backup.widget.enabled')}
                            description={t('database-backup.widget.enabled-description')}
                            {...form.getInputProps('enabled', { type: 'checkbox' })}
                        />

                        <Select
                            data={DATABASE_BACKUP_SCHEDULE_PRESETS.map((preset) => ({
                                value: preset,
                                label: t(
                                    DATABASE_BACKUP_SCHEDULE_LABELS[
                                        preset
                                    ] as 'database-backup.widget.schedule.every-6h'
                                )
                            }))}
                            key={form.key('schedulePreset')}
                            label={t('database-backup.widget.schedule.label')}
                            description={t('database-backup.widget.schedule.description')}
                            {...form.getInputProps('schedulePreset')}
                        />

                        {schedulePreset === 'custom' && (
                            <TextInput
                                key={form.key('customCronExpression')}
                                label={t('database-backup.widget.custom-cron')}
                                description={t('database-backup.widget.custom-cron-description')}
                                placeholder="0 3 * * *"
                                {...form.getInputProps('customCronExpression')}
                            />
                        )}

                        {presetCron && (
                            <Text c="dimmed" size="sm">
                                {t('database-backup.widget.cron-preview')}:{' '}
                                <code>{presetCron}</code> (UTC)
                            </Text>
                        )}

                        <Switch
                            key={form.key('notifyOnSuccess')}
                            label={t('database-backup.widget.notify-success')}
                            {...form.getInputProps('notifyOnSuccess', { type: 'checkbox' })}
                        />

                        <Switch
                            key={form.key('notifyOnFailure')}
                            label={t('database-backup.widget.notify-failure')}
                            {...form.getInputProps('notifyOnFailure', { type: 'checkbox' })}
                        />

                        <Paper p="md" radius="md" withBorder>
                            <Stack gap="xs">
                                <Text fw={600}>{t('database-backup.widget.status.title')}</Text>
                                {settings.lastBackupStatus ? (
                                    <Group gap="sm">
                                        <Badge color={statusColor[settings.lastBackupStatus]}>
                                            {t(
                                                `database-backup.widget.status.${settings.lastBackupStatus}`
                                            )}
                                        </Badge>
                                        {settings.lastBackupAt && (
                                            <Text c="dimmed" size="sm">
                                                {t(
                                                    settings.lastBackupStatus === 'running'
                                                        ? 'database-backup.widget.status.started-at'
                                                        : 'database-backup.widget.status.completed-at'
                                                )}
                                                :{' '}
                                                {new Date(settings.lastBackupAt).toLocaleString()}
                                            </Text>
                                        )}
                                    </Group>
                                ) : (
                                    <Text c="dimmed" size="sm">
                                        {t('database-backup.widget.status.empty')}
                                    </Text>
                                )}
                                {settings.lastBackupFileName && (
                                    <Text size="sm">
                                        {t('database-backup.widget.status.file')}:{' '}
                                        <code>{settings.lastBackupFileName}</code>
                                    </Text>
                                )}
                                {settings.lastBackupSizeBytes != null && (
                                    <Text size="sm">
                                        {t('database-backup.widget.status.size')}:{' '}
                                        {(settings.lastBackupSizeBytes / (1024 * 1024)).toFixed(2)}{' '}
                                        MB
                                    </Text>
                                )}
                                {settings.nextScheduledBackupAt && (
                                    <Text size="sm">
                                        {t('database-backup.widget.status.next')}:{' '}
                                        {new Date(settings.nextScheduledBackupAt).toLocaleString()}{' '}
                                        (UTC)
                                    </Text>
                                )}
                                {settings.lastBackupError && (
                                    <Text c="red" size="sm">
                                        {settings.lastBackupError}
                                    </Text>
                                )}
                            </Stack>
                        </Paper>
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button
                            leftSection={<TbPlayerPlay size={16} />}
                            loading={isRunning}
                            onClick={() => runBackup({ variables: undefined })}
                            variant="light"
                        >
                            {t('database-backup.widget.run-now')}
                        </Button>
                        <Button
                            leftSection={<TbDeviceFloppy size={16} />}
                            loading={isUpdating}
                            type="submit"
                        >
                            {t('database-backup.widget.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
