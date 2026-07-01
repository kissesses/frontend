import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    UnstyledButton
} from '@mantine/core'
import { useField } from '@mantine/form'
import ColorHash from 'color-hash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@shared/api'
import { QueryKeys, useCreateConfigProfile } from '@shared/api/hooks'

import { CONFIG_PROFILE_PRESETS, IConfigProfilePreset } from './config-profile-presets.constants'
import { normalizeXrayPresetConfig } from './normalize-xray-preset-config'
import { parseJsonc } from './parse-jsonc'

interface IProps {
    onClose: () => void
    onCreated: (uuid: string) => void
}

const ch = new ColorHash()

const resolvePresetConfig = async (
    preset: IConfigProfilePreset
): Promise<Record<string, unknown>> => {
    const response = await fetch(preset.url)

    if (!response.ok) {
        throw new Error('Failed to load preset')
    }

    const parsed = parseJsonc(await response.text()) as Record<string, unknown>

    return normalizeXrayPresetConfig(parsed)
}

export const ConfigProfilePresetsModalFeature = (props: IProps) => {
    const { onClose, onCreated } = props
    const { t } = useTranslation()

    const [selectedPreset, setSelectedPreset] = useState<IConfigProfilePreset | undefined>(
        CONFIG_PROFILE_PRESETS[0]
    )
    const [isLoadingPreset, setIsLoadingPreset] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    const nameField = useField({
        initialValue: CONFIG_PROFILE_PRESETS[0]?.suggestedName ?? '',
        validateOnChange: true,
        validate: (value) => {
            if (!value || value.length < 2) {
                return t('config-profile-presets.modal.name-too-short')
            }
            if (value.length > 30) {
                return t('config-profile-presets.modal.name-too-long')
            }
            if (!/^[A-Za-z0-9_\s-]+$/.test(value)) {
                return t('config-profile-presets.modal.name-invalid')
            }
            return null
        }
    })

    const { mutate: createConfigProfile, isPending } = useCreateConfigProfile({
        mutationFns: {
            onSuccess: async (data) => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.configProfiles.getConfigProfiles.queryKey
                })
                onClose()
                onCreated(data.uuid)
            },
            onError: (error) => {
                setLoadError(error.message)
            }
        }
    })

    const handleSelectPreset = (preset: IConfigProfilePreset) => {
        setSelectedPreset(preset)
        nameField.setValue(preset.suggestedName)
        setLoadError(null)
    }

    const handleCreate = async () => {
        if (!selectedPreset) return

        if (await nameField.validate()) return

        setIsLoadingPreset(true)
        setLoadError(null)

        try {
            const config = await resolvePresetConfig(selectedPreset)

            createConfigProfile({
                variables: {
                    name: nameField.getValue(),
                    config
                }
            })
        } catch {
            setLoadError(t('config-profile-presets.modal.failed-to-load-preset'))
        } finally {
            setIsLoadingPreset(false)
        }
    }

    return (
        <Stack gap="md">
            <Text c="dimmed" size="sm">
                {t('config-profile-presets.modal.description')}
            </Text>

            <ScrollArea h={320} offsetScrollbars type="hover">
                <Stack gap="xs">
                    {CONFIG_PROFILE_PRESETS.map((preset) => (
                        <UnstyledButton
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset)}
                            w="100%"
                        >
                            <Card
                                padding="sm"
                                style={{
                                    borderColor:
                                        selectedPreset?.id === preset.id
                                            ? 'var(--mantine-color-teal-5)'
                                            : undefined,
                                    transition: 'border-color 0.2s ease'
                                }}
                                withBorder
                            >
                                <Group justify="space-between" wrap="nowrap">
                                    <Box miw={0} style={{ flex: 1 }}>
                                        <Text fw={600} size="sm" truncate>
                                            {t(preset.nameKey as never)}
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            {t(preset.descriptionKey as never)}
                                        </Text>
                                    </Box>
                                    <Badge
                                        color={ch.hex(preset.protocol)}
                                        size="sm"
                                        variant="light"
                                    >
                                        {preset.protocol}
                                    </Badge>
                                </Group>
                            </Card>
                        </UnstyledButton>
                    ))}
                </Stack>
            </ScrollArea>

            <TextInput
                label={t('config-profile-presets.modal.profile-name')}
                placeholder={t('config-profile-presets.modal.enter-profile-name')}
                required
                {...nameField.getInputProps()}
            />

            {loadError && (
                <Text c="red" size="sm">
                    {loadError}
                </Text>
            )}

            <Group justify="flex-end">
                <Button color="gray" onClick={onClose} variant="light">
                    {t('common.cancel')}
                </Button>
                <Button
                    color="teal"
                    disabled={!selectedPreset}
                    loading={isPending || isLoadingPreset}
                    onClick={() => void handleCreate()}
                >
                    {t('common.create')}
                </Button>
            </Group>
        </Stack>
    )
}
