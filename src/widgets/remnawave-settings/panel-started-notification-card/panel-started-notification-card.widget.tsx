import { useState } from 'react'
import {
    ActionIcon,
    Box,
    Button,
    Code,
    Divider,
    Group,
    Select,
    Stack,
    Switch,
    Text,
    TextInput,
    Textarea
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import {
    buildPanelStartedPreviewMessage,
    GetRemnawaveSettingsCommand,
    UpdateRemnawaveSettingsCommand
} from '@kissesses/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { TbAlertCircle, TbBrandTelegram, TbLink, TbTrash } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useUpdateRemnawaveSettings } from '@shared/api/hooks/remnawave-settings/remnawave-settings.mutation.hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'

interface IProps {
    panelStartedNotificationSettings: NonNullable<
        GetRemnawaveSettingsCommand.Response['response']['panelStartedNotificationSettings']
    >
}

export const PanelStartedNotificationCardWidget = (props: IProps) => {
    const entityAccentColor = useEntityAccentColor()
    const { panelStartedNotificationSettings } = props
    const { t } = useTranslation()
    const [previewSettings, setPreviewSettings] = useState(panelStartedNotificationSettings)

    const form = useForm<NonNullable<UpdateRemnawaveSettingsCommand.Request>>({
        name: 'panel-started-notification-settings',
        mode: 'uncontrolled',
        onValuesChange: (values) => {
            if (values.panelStartedNotificationSettings) {
                setPreviewSettings(values.panelStartedNotificationSettings)
            }
        },
        validate: zodResolver(
            UpdateRemnawaveSettingsCommand.RequestSchema.pick({
                panelStartedNotificationSettings: true
            })
        ),
        initialValues: {
            panelStartedNotificationSettings
        }
    })

    const { mutate: updateSettings, isPending: isUpdatePending } = useUpdateRemnawaveSettings({
        mutationFns: {
            onSuccess() {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.remnawaveSettings.getRemnawaveSettings.queryKey
                })
            },
            onError(error) {
                handleFormErrors(form, error)

                modals.open({
                    title: (
                        <BaseOverlayHeader
                            iconColor="red"
                            IconComponent={TbAlertCircle}
                            iconVariant="soft"
                            title={t('auth-settings.error-modal.title')}
                        />
                    ),
                    centered: true,
                    children: (
                        <Stack gap="md">
                            <Text c="dimmed" size="sm">
                                {t('auth-settings.error-modal.description')}
                            </Text>
                            <Code p="md">
                                <Text c="red.1" fw={500} size="sm">
                                    {error instanceof Error
                                        ? error.message
                                        : t('auth-settings.error-modal.unknown-error')}
                                </Text>
                            </Code>
                            <Button
                                color="red"
                                fullWidth
                                onClick={() => modals.closeAll()}
                                variant="light"
                            >
                                {t('common.close')}
                            </Button>
                        </Stack>
                    )
                })
            }
        }
    })

    const handleSubmit = form.onSubmit((values) => {
        updateSettings({
            variables: {
                panelStartedNotificationSettings: values.panelStartedNotificationSettings
            }
        })
    })

    const isCustomEnabled = previewSettings.enabled
    const previewMessage = buildPanelStartedPreviewMessage(previewSettings)

    const buttonStyleOptions = [
        { value: '', label: t('panel-started-notification-card.widget.button-style-default') },
        { value: 'primary', label: t('panel-started-notification-card.widget.button-style-primary') },
        { value: 'success', label: t('panel-started-notification-card.widget.button-style-success') },
        { value: 'danger', label: t('panel-started-notification-card.widget.button-style-danger') }
    ]

    const syncPreviewFromForm = () => {
        const nextSettings = form.getValues().panelStartedNotificationSettings
        if (nextSettings) {
            setPreviewSettings(nextSettings)
        }
    }

    const addButton = () => {
        const buttons = form.getValues().panelStartedNotificationSettings?.buttons ?? []
        if (buttons.length >= 3) {
            return
        }

        form.setFieldValue('panelStartedNotificationSettings.buttons', [
            ...buttons,
            {
                enabled: true,
                text: '',
                url: 'https://',
                customEmojiId: null,
                style: null
            }
        ])
        syncPreviewFromForm()
    }

    const removeButton = (index: number) => {
        const buttons = form.getValues().panelStartedNotificationSettings?.buttons ?? []
        form.setFieldValue(
            'panelStartedNotificationSettings.buttons',
            buttons.filter((_, buttonIndex) => buttonIndex !== index)
        )
        syncPreviewFromForm()
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t(
                        'panel-started-notification-card.widget.customize-panel-started-telegram-notification'
                    )}
                    icon={<TbBrandTelegram size={24} />}
                    iconColor="blue"
                    iconVariant="soft"
                    title={t('panel-started-notification-card.widget.title')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Switch
                            description={t(
                                'panel-started-notification-card.widget.enable-customization-description'
                            )}
                            key={form.key('panelStartedNotificationSettings.enabled')}
                            label={t('panel-started-notification-card.widget.enable-customization')}
                            {...form.getInputProps('panelStartedNotificationSettings.enabled', {
                                type: 'checkbox'
                            })}
                        />

                        <Divider />

                        <Group grow>
                            <TextInput
                                disabled={!isCustomEnabled}
                                key={form.key('panelStartedNotificationSettings.headerEmoji')}
                                label={t('panel-started-notification-card.widget.header-emoji')}
                                {...form.getInputProps('panelStartedNotificationSettings.headerEmoji')}
                            />
                            <TextInput
                                disabled={!isCustomEnabled}
                                key={form.key('panelStartedNotificationSettings.headerCustomEmojiId')}
                                label={t(
                                    'panel-started-notification-card.widget.header-custom-emoji-id'
                                )}
                                placeholder="5418304400152096012"
                                {...form.getInputProps(
                                    'panelStartedNotificationSettings.headerCustomEmojiId'
                                )}
                            />
                        </Group>

                        <TextInput
                            disabled={!isCustomEnabled}
                            key={form.key('panelStartedNotificationSettings.hashtag')}
                            label={t('panel-started-notification-card.widget.hashtag')}
                            {...form.getInputProps('panelStartedNotificationSettings.hashtag')}
                        />

                        <Group grow>
                            <TextInput
                                disabled={!isCustomEnabled}
                                key={form.key('panelStartedNotificationSettings.statusEmoji')}
                                label={t('panel-started-notification-card.widget.status-emoji')}
                                {...form.getInputProps('panelStartedNotificationSettings.statusEmoji')}
                            />
                            <TextInput
                                disabled={!isCustomEnabled}
                                key={form.key('panelStartedNotificationSettings.statusCustomEmojiId')}
                                label={t(
                                    'panel-started-notification-card.widget.status-custom-emoji-id'
                                )}
                                {...form.getInputProps(
                                    'panelStartedNotificationSettings.statusCustomEmojiId'
                                )}
                            />
                        </Group>

                        <Textarea
                            disabled={!isCustomEnabled}
                            key={form.key('panelStartedNotificationSettings.statusMessage')}
                            label={t('panel-started-notification-card.widget.status-message')}
                            description={t(
                                'panel-started-notification-card.widget.status-message-description'
                            )}
                            minRows={2}
                            {...form.getInputProps('panelStartedNotificationSettings.statusMessage')}
                        />

                        <Switch
                            disabled={!isCustomEnabled}
                            key={form.key('panelStartedNotificationSettings.showCommunityLine')}
                            label={t('panel-started-notification-card.widget.show-community-line')}
                            {...form.getInputProps(
                                'panelStartedNotificationSettings.showCommunityLine',
                                { type: 'checkbox' }
                            )}
                        />

                        {previewSettings.showCommunityLine && (
                            <Group grow>
                                <TextInput
                                    disabled={!isCustomEnabled}
                                    key={form.key('panelStartedNotificationSettings.communityEmoji')}
                                    label={t('panel-started-notification-card.widget.community-emoji')}
                                    {...form.getInputProps(
                                        'panelStartedNotificationSettings.communityEmoji'
                                    )}
                                />
                                <TextInput
                                    disabled={!isCustomEnabled}
                                    key={form.key(
                                        'panelStartedNotificationSettings.communityCustomEmojiId'
                                    )}
                                    label={t(
                                        'panel-started-notification-card.widget.community-custom-emoji-id'
                                    )}
                                    {...form.getInputProps(
                                        'panelStartedNotificationSettings.communityCustomEmojiId'
                                    )}
                                />
                            </Group>
                        )}

                        {previewSettings.showCommunityLine && (
                            <TextInput
                                disabled={!isCustomEnabled}
                                key={form.key('panelStartedNotificationSettings.communityText')}
                                label={t('panel-started-notification-card.widget.community-text')}
                                {...form.getInputProps(
                                    'panelStartedNotificationSettings.communityText'
                                )}
                            />
                        )}

                        <Switch
                            disabled={!isCustomEnabled}
                            key={form.key('panelStartedNotificationSettings.showDocumentationLine')}
                            label={t('panel-started-notification-card.widget.show-documentation-line')}
                            {...form.getInputProps(
                                'panelStartedNotificationSettings.showDocumentationLine',
                                { type: 'checkbox' }
                            )}
                        />

                        {previewSettings.showDocumentationLine && (
                            <>
                                <Group grow>
                                    <TextInput
                                        disabled={!isCustomEnabled}
                                        key={form.key(
                                            'panelStartedNotificationSettings.documentationEmoji'
                                        )}
                                        label={t(
                                            'panel-started-notification-card.widget.documentation-emoji'
                                        )}
                                        {...form.getInputProps(
                                            'panelStartedNotificationSettings.documentationEmoji'
                                        )}
                                    />
                                    <TextInput
                                        disabled={!isCustomEnabled}
                                        key={form.key(
                                            'panelStartedNotificationSettings.documentationCustomEmojiId'
                                        )}
                                        label={t(
                                            'panel-started-notification-card.widget.documentation-custom-emoji-id'
                                        )}
                                        {...form.getInputProps(
                                            'panelStartedNotificationSettings.documentationCustomEmojiId'
                                        )}
                                    />
                                </Group>
                                <TextInput
                                    disabled={!isCustomEnabled}
                                    key={form.key(
                                        'panelStartedNotificationSettings.documentationText'
                                    )}
                                    label={t(
                                        'panel-started-notification-card.widget.documentation-text'
                                    )}
                                    {...form.getInputProps(
                                        'panelStartedNotificationSettings.documentationText'
                                    )}
                                />
                            </>
                        )}

                        <Divider label={t('panel-started-notification-card.widget.buttons-section')} />

                        <Switch
                            disabled={!isCustomEnabled}
                            key={form.key('panelStartedNotificationSettings.showButtons')}
                            label={t('panel-started-notification-card.widget.show-buttons')}
                            {...form.getInputProps('panelStartedNotificationSettings.showButtons', {
                                type: 'checkbox'
                            })}
                        />

                        {previewSettings.showButtons &&
                            previewSettings.buttons.map((_, index) => (
                                    <Box key={index} p="sm" style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 8 }}>
                                        <Stack gap="sm">
                                            <Group justify="space-between">
                                                <Text fw={600} size="sm">
                                                    {t(
                                                        'panel-started-notification-card.widget.button-number',
                                                        { number: index + 1 }
                                                    )}
                                                </Text>
                                                <ActionIcon
                                                    color="red"
                                                    disabled={!isCustomEnabled}
                                                    onClick={() => removeButton(index)}
                                                    variant="subtle"
                                                >
                                                    <TbTrash size={16} />
                                                </ActionIcon>
                                            </Group>

                                            <Switch
                                                disabled={!isCustomEnabled}
                                                label={t(
                                                    'panel-started-notification-card.widget.button-enabled'
                                                )}
                                                {...form.getInputProps(
                                                    `panelStartedNotificationSettings.buttons.${index}.enabled`,
                                                    { type: 'checkbox' }
                                                )}
                                            />

                                            <TextInput
                                                disabled={!isCustomEnabled}
                                                label={t(
                                                    'panel-started-notification-card.widget.button-text'
                                                )}
                                                {...form.getInputProps(
                                                    `panelStartedNotificationSettings.buttons.${index}.text`
                                                )}
                                            />

                                            <TextInput
                                                disabled={!isCustomEnabled}
                                                label={t(
                                                    'panel-started-notification-card.widget.button-url'
                                                )}
                                                leftSection={<TbLink size={16} />}
                                                {...form.getInputProps(
                                                    `panelStartedNotificationSettings.buttons.${index}.url`
                                                )}
                                            />

                                            <TextInput
                                                disabled={!isCustomEnabled}
                                                label={t(
                                                    'panel-started-notification-card.widget.button-custom-emoji-id'
                                                )}
                                                {...form.getInputProps(
                                                    `panelStartedNotificationSettings.buttons.${index}.customEmojiId`
                                                )}
                                            />

                                            <Select
                                                clearable
                                                data={buttonStyleOptions}
                                                disabled={!isCustomEnabled}
                                                label={t(
                                                    'panel-started-notification-card.widget.button-style'
                                                )}
                                                value={
                                                    form.getValues()
                                                        .panelStartedNotificationSettings?.buttons?.[
                                                        index
                                                    ]?.style ?? ''
                                                }
                                                onChange={(value) => {
                                                    form.setFieldValue(
                                                        `panelStartedNotificationSettings.buttons.${index}.style`,
                                                        value === '' || value === null
                                                            ? null
                                                            : (value as
                                                                  | 'danger'
                                                                  | 'success'
                                                                  | 'primary')
                                                    )
                                                    syncPreviewFromForm()
                                                }}
                                            />
                                        </Stack>
                                    </Box>
                                )
                            )}

                        {isCustomEnabled &&
                            previewSettings.showButtons &&
                            previewSettings.buttons.length < 3 && (
                                <Button onClick={addButton} variant="light">
                                    {t('panel-started-notification-card.widget.add-button')}
                                </Button>
                            )}

                        <Divider label={t('panel-started-notification-card.widget.preview')} />

                        <Code block fz="xs" style={{ whiteSpace: 'pre-wrap' }}>
                            {previewMessage}
                        </Code>
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button color={entityAccentColor} loading={isUpdatePending} size="md" type="submit">
                            {t('common.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
