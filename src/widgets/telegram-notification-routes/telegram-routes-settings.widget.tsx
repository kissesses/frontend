import {
    Alert,
    Box,
    Button,
    Group,
    NumberInput,
    Paper,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'
import { useForm } from '@mantine/form'
import {
    GetTelegramNotificationRoutesCommand,
    TelegramNotificationSettingsSchema,
    UpdateTelegramNotificationRoutesCommand
} from '@kissesses/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { TbBrandTelegram, TbDeviceFloppy, TbFolderPlus } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import {
    useCreateTelegramNotificationTopics,
    useUpdateTelegramNotificationRoutes
} from '@shared/api/hooks/telegram-notification-routes/telegram-notification-routes.mutation.hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'

import {
    TELEGRAM_NOTIFICATION_ROUTE_CATEGORIES,
    TELEGRAM_ROUTE_CATEGORY_DESCRIPTIONS,
    TELEGRAM_ROUTE_CATEGORY_LABELS,
    TELEGRAM_ROUTE_TOPIC_FIELD
} from './telegram-routes.constants'

interface IProps {
    routes: GetTelegramNotificationRoutesCommand.Response['response']
}

export const TelegramRoutesSettingsWidget = (props: IProps) => {
    const entityAccentColor = useEntityAccentColor()
    const { routes } = props
    const { t } = useTranslation()

    const form = useForm<UpdateTelegramNotificationRoutesCommand.Request>({
        name: 'telegram-routes-settings',
        mode: 'uncontrolled',
        validate: zodResolver(TelegramNotificationSettingsSchema),
        initialValues: routes
    })

    const { mutate: updateRoutes, isPending: isUpdating } = useUpdateTelegramNotificationRoutes({
        mutationFns: {
            onSuccess() {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.telegramNotificationRoutes.getRoutes.queryKey
                })
            },
            onError(error) {
                handleFormErrors(form, error)
            }
        }
    })

    const { mutate: createTopics, isPending: isCreatingTopics } =
        useCreateTelegramNotificationTopics({
            mutationFns: {
                onSuccess(data) {
                    form.setValues(data)
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.telegramNotificationRoutes.getRoutes.queryKey
                    })
                }
            }
        })

    const handleSubmit = form.onSubmit((values) => {
        updateRoutes({
            variables: {
                chatId: values.chatId?.trim() ? values.chatId.trim() : null,
                usersTopicId: values.usersTopicId ?? null,
                nodesTopicId: values.nodesTopicId ?? null,
                crmTopicId: values.crmTopicId ?? null,
                serviceTopicId: values.serviceTopicId ?? null,
                tblockerTopicId: values.tblockerTopicId ?? null,
                backupTopicId: values.backupTopicId ?? null,
                backupSecretsTopicId: values.backupSecretsTopicId ?? null
            }
        })
    })

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t('telegram-routes.widget.description')}
                    icon={<TbBrandTelegram size={24} />}
                    iconColor="blue"
                    iconVariant="soft"
                    title={t('telegram-routes.widget.title')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="sm">
                        <Alert color="blue" variant="light">
                            {t('telegram-routes.widget.env-hint')}
                        </Alert>

                        <TextInput
                            description={t('telegram-routes.widget.chat-id-description')}
                            key={form.key('chatId')}
                            label={t('telegram-routes.widget.chat-id')}
                            placeholder="-1001234567890"
                            size="sm"
                            {...form.getInputProps('chatId')}
                        />

                        <Paper className="app-raised-surface" p="sm" withBorder>
                            <Stack gap="xs">
                                {TELEGRAM_NOTIFICATION_ROUTE_CATEGORIES.map((category) => {
                                    const topicField = TELEGRAM_ROUTE_TOPIC_FIELD[category]
                                    const labelKey = TELEGRAM_ROUTE_CATEGORY_LABELS[category]
                                    const descriptionKey =
                                        TELEGRAM_ROUTE_CATEGORY_DESCRIPTIONS[category]
                                    const categoryLabel = t(labelKey as never)

                                    return (
                                        <Group
                                            align="flex-end"
                                            gap="sm"
                                            key={category}
                                            wrap="nowrap"
                                        >
                                            <Box flex={1} miw={0}>
                                                <Text fw={500} lh={1.3} size="sm">
                                                    {categoryLabel}
                                                </Text>
                                                <Text c="dimmed" lh={1.3} size="xs">
                                                    {t(descriptionKey as never)}
                                                </Text>
                                            </Box>
                                            <NumberInput
                                                allowDecimal={false}
                                                allowNegative={false}
                                                aria-label={categoryLabel}
                                                key={form.key(topicField)}
                                                min={1}
                                                placeholder={t(
                                                    'telegram-routes.widget.topic-id-placeholder'
                                                )}
                                                size="xs"
                                                w={112}
                                                {...form.getInputProps(topicField)}
                                            />
                                        </Group>
                                    )
                                })}
                            </Stack>
                        </Paper>
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group grow>
                        <Button
                            leftSection={<TbFolderPlus size="1.1rem" />}
                            loading={isCreatingTopics}
                            onClick={() => createTopics({})}
                            type="button"
                            variant="light"
                        >
                            {t('telegram-routes.widget.create-topics')}
                        </Button>
                        <Button
                            color={entityAccentColor}
                            leftSection={<TbDeviceFloppy size="1.1rem" />}
                            loading={isUpdating}
                            type="submit"
                            variant="light"
                        >
                            {t('common.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
