import {
    Alert,
    Badge,
    Box,
    Button,
    Group,
    NumberInput,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
    Stack,
    Switch,
    Text,
    TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import {
    GetRemnawaveSettingsCommand,
    StealthLoginSettingsSchema,
    TStealthDecoyId,
    TStealthLoginSettings,
    UpdateRemnawaveSettingsCommand,
    parseStealthHotkey,
    stealthHasUnlockMethod
} from '@kissesses/backend-contract';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbDeviceFloppy, TbEyeOff, TbRefresh } from 'react-icons/tb';

import { queryClient } from '@shared/api';
import { QueryKeys } from '@shared/api/hooks/keys-factory';
import { useUpdateRemnawaveSettings } from '@shared/api/hooks/remnawave-settings/remnawave-settings.mutation.hooks';
import { useEntityAccentColor } from '@shared/hocs/theme-applier';
import { SettingsCardShared } from '@shared/ui/settings-card';
import { handleFormErrors } from '@shared/utils/misc';

import {
    STEALTH_DECOY_BY_ID,
    STEALTH_DECOY_GROUP_LABEL_KEYS,
    STEALTH_DECOY_GROUP_ORDER,
    STEALTH_DECOY_REGISTRY,
    StealthDecoyRenderer
} from '@features/auth/stealth-login';

interface IProps {
    stealthLoginSettings: NonNullable<
        GetRemnawaveSettingsCommand.Response['response']['stealthLoginSettings']
    >;
}

function generateSecretValue() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function withPersistedSecret(
    values: TStealthLoginSettings,
    hadConfiguredSecret: boolean
): TStealthLoginSettings {
    if (values.secretValue || !hadConfiguredSecret) {
        return values;
    }

    return { ...values, secretValue: 'configured' };
}

export const StealthLoginSettingsCardWidget = (props: IProps) => {
    const entityAccentColor = useEntityAccentColor();
    const { stealthLoginSettings } = props;
    const { t } = useTranslation();
    const [groupFilter, setGroupFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [, setFormRevision] = useState(0);
    const hadConfiguredSecret = stealthLoginSettings.secretValue === '';

    const form = useForm<TStealthLoginSettings>({
        name: 'stealth-login-settings',
        mode: 'uncontrolled',
        validate: zodResolver(StealthLoginSettingsSchema),
        initialValues: stealthLoginSettings,
        onValuesChange: () => {
            setFormRevision((value) => value + 1);
        }
    });

    const values = form.getValues();
    const selectedDecoy = (values.decoy ?? '502_nginx') as TStealthDecoyId;
    const previewMeta = STEALTH_DECOY_BY_ID[selectedDecoy];
    const hotkeyDisplay = parseStealthHotkey(values.hotkey ?? 'ctrl+b').display;
    const hasConfiguredSecret = Boolean(
        values.secretParam && (values.secretValue || hadConfiguredSecret)
    );

    const unlockSummary = useMemo(() => {
        const parts: string[] = [];
        if (values.hotkeyEnabled) parts.push(t('stealth-login-settings.widget.hotkey'));
        if (values.clicksEnabled) parts.push(t('stealth-login-settings.widget.clicks'));
        if (hasConfiguredSecret) parts.push(t('stealth-login-settings.widget.secret-url'));
        return parts.length ? parts.join(', ') : t('stealth-login-settings.widget.no-unlock');
    }, [hasConfiguredSecret, values.clicksEnabled, values.hotkeyEnabled, t]);

    const filteredDecoys = useMemo(() => {
        return STEALTH_DECOY_REGISTRY.filter((item) => {
            if (groupFilter !== 'all' && item.group !== groupFilter) return false;
            if (!search.trim()) return true;
            const label = String(t(item.labelKey as never)).toLowerCase();
            return label.includes(search.toLowerCase()) || item.id.includes(search.toLowerCase());
        });
    }, [groupFilter, search, t]);

    const { mutate: updateSettings, isPending } = useUpdateRemnawaveSettings({
        mutationFns: {
            onSuccess() {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.remnawaveSettings.getRemnawaveSettings.queryKey
                });
                queryClient.refetchQueries({
                    queryKey: QueryKeys.auth.getAuthStatus.queryKey
                });
            },
            onError(error) {
                handleFormErrors(form, error);
                modals.open({
                    title: t('stealth-login-settings.widget.save-error-title'),
                    children: <Text size="sm">{t('stealth-login-settings.widget.save-error-body')}</Text>
                });
            }
        }
    });

    const handleSubmit = form.onSubmit((payload) => {
        const normalized = StealthLoginSettingsSchema.parse(payload);
        const forUnlockCheck = withPersistedSecret(normalized, hadConfiguredSecret);

        if (normalized.enabled && !stealthHasUnlockMethod(forUnlockCheck)) {
            modals.open({
                title: t('stealth-login-settings.widget.validation-title'),
                children: <Text size="sm">{t('stealth-login-settings.widget.validation-body')}</Text>
            });
            return;
        }

        updateSettings({
            variables: {
                stealthLoginSettings: {
                    ...normalized,
                    secretValue: payload.secretValue || undefined
                }
            }
        });
    });

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t('stealth-login-settings.widget.mask-login-description')}
                    icon={<TbEyeOff size={24} />}
                    iconColor={entityAccentColor}
                    iconVariant="soft"
                    title={t('stealth-login-settings.widget.title')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="lg">
                        {values.enabled &&
                            !stealthHasUnlockMethod(
                                withPersistedSecret(values, hadConfiguredSecret)
                            ) && (
                                <Alert
                                    color="yellow"
                                    title={t('stealth-login-settings.widget.warning-title')}
                                >
                                    {t('stealth-login-settings.widget.warning-body')}
                                </Alert>
                            )}

                        <Group justify="space-between" wrap="wrap">
                            <Stack gap={2}>
                                <Text fw={600}>{t('stealth-login-settings.widget.mask-login')}</Text>
                                <Text c="dimmed" size="sm">
                                    {t('stealth-login-settings.widget.mask-login-description')}
                                </Text>
                            </Stack>
                            <Switch {...form.getInputProps('enabled', { type: 'checkbox' })} />
                        </Group>

                        <Group gap="xs" wrap="wrap">
                            <Badge color={values.enabled ? 'green' : 'gray'} variant="light">
                                {values.enabled
                                    ? t('stealth-login-settings.widget.status-active')
                                    : t('stealth-login-settings.widget.status-inactive')}
                            </Badge>
                            <Badge variant="light">{unlockSummary}</Badge>
                            <Badge variant="outline">{STEALTH_DECOY_REGISTRY.length} decoys</Badge>
                        </Group>

                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text fw={600}>{t('stealth-login-settings.widget.preview')}</Text>
                                <Group gap="xs">
                                    <Badge variant="light">
                                        {previewMeta ? t(previewMeta.labelKey as never) : selectedDecoy}
                                    </Badge>
                                    <Button
                                        leftSection={<TbRefresh size={16} />}
                                        onClick={() => form.setFieldValue('decoy', selectedDecoy)}
                                        size="xs"
                                        type="button"
                                        variant="light"
                                    >
                                        {t('stealth-login-settings.widget.refresh-preview')}
                                    </Button>
                                </Group>
                            </Group>
                            <Box
                                h={280}
                                style={{
                                    border: '1px solid var(--app-border)',
                                    borderRadius: 12,
                                    overflow: 'hidden'
                                }}
                            >
                                <StealthDecoyRenderer decoyId={selectedDecoy} />
                            </Box>
                        </Stack>

                        <TextInput
                            label={t('stealth-login-settings.widget.search-decoys')}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                            value={search}
                        />

                        <SegmentedControl
                            data={[
                                {
                                    label: t('stealth-login-settings.widget.all-groups'),
                                    value: 'all'
                                },
                                ...STEALTH_DECOY_GROUP_ORDER.map((group) => ({
                                    label: t(STEALTH_DECOY_GROUP_LABEL_KEYS[group] as never),
                                    value: group
                                }))
                            ]}
                            onChange={setGroupFilter}
                            value={groupFilter}
                        />

                        <ScrollArea h={220}>
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                                {filteredDecoys.map((item) => (
                                    <Button
                                        key={item.id}
                                        onClick={() => form.setFieldValue('decoy', item.id)}
                                        type="button"
                                        variant={selectedDecoy === item.id ? 'filled' : 'light'}
                                    >
                                        <Stack gap={2}>
                                            <Text size="sm">{t(item.labelKey as never)}</Text>
                                            <Group gap={6}>
                                                {item.status && (
                                                    <Badge size="xs">{item.status}</Badge>
                                                )}
                                                <Badge size="xs" variant="outline">
                                                    {item.kind}
                                                </Badge>
                                            </Group>
                                        </Stack>
                                    </Button>
                                ))}
                            </SimpleGrid>
                        </ScrollArea>

                        <TextInput
                            description={t('stealth-login-settings.widget.history-path-description')}
                            label={t('stealth-login-settings.widget.history-path')}
                            {...form.getInputProps('historyPath')}
                        />

                        <Stack gap="sm">
                            <Text fw={600}>{t('stealth-login-settings.widget.unlock-methods')}</Text>
                            <Group justify="space-between">
                                <Text size="sm">{t('stealth-login-settings.widget.hotkey')}</Text>
                                <Switch
                                    {...form.getInputProps('hotkeyEnabled', { type: 'checkbox' })}
                                />
                            </Group>
                            <TextInput
                                label={t('stealth-login-settings.widget.hotkey-combo')}
                                {...form.getInputProps('hotkey')}
                            />
                            <Badge variant="light">{hotkeyDisplay}</Badge>

                            <Group justify="space-between">
                                <Text size="sm">{t('stealth-login-settings.widget.clicks')}</Text>
                                <Switch
                                    {...form.getInputProps('clicksEnabled', { type: 'checkbox' })}
                                />
                            </Group>
                            <Group grow>
                                <NumberInput
                                    label={t('stealth-login-settings.widget.clicks-count')}
                                    max={12}
                                    min={2}
                                    {...form.getInputProps('clicksCount')}
                                />
                                <NumberInput
                                    label={t('stealth-login-settings.widget.clicks-window')}
                                    max={10000}
                                    min={500}
                                    step={100}
                                    {...form.getInputProps('clicksWindowMs')}
                                />
                            </Group>

                            <TextInput
                                description={t(
                                    'stealth-login-settings.widget.secret-param-description'
                                )}
                                label={t('stealth-login-settings.widget.secret-param')}
                                {...form.getInputProps('secretParam')}
                            />
                            <Group align="flex-end" grow>
                                <TextInput
                                    description={t(
                                        'stealth-login-settings.widget.secret-value-description'
                                    )}
                                    label={t('stealth-login-settings.widget.secret-value')}
                                    {...form.getInputProps('secretValue')}
                                />
                                <Button
                                    onClick={() =>
                                        form.setFieldValue('secretValue', generateSecretValue())
                                    }
                                    type="button"
                                    variant="light"
                                >
                                    {t('stealth-login-settings.widget.generate-secret')}
                                </Button>
                            </Group>
                        </Stack>
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button
                            color={entityAccentColor}
                            leftSection={<TbDeviceFloppy size={16} />}
                            loading={isPending}
                            size="md"
                            type="submit"
                        >
                            {t('common.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    );
};
