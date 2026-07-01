import { ActionIcon, Badge, Box, Divider, Group, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'
import { GetUserHwidDevicesCommand } from '@kissesses/backend-contract'
import { useTranslation } from 'react-i18next'
import {
    PiAndroidLogo,
    PiAppleLogo,
    PiDeviceMobile,
    PiLinuxLogo,
    PiTrash,
    PiWindowsLogo
} from 'react-icons/pi'
import { TbExternalLink, TbLockOff, TbShieldLock } from 'react-icons/tb'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { formatTimeUtil } from '@shared/utils/time-utils'
import { usePrimaryColorName } from '@shared/hocs/theme-applier'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'

interface IProps {
    device: GetUserHwidDevicesCommand.Response['response']['devices'][number]
    index: number
    isBlocked: boolean
    isBlocking: boolean
    onBlock: (hwid: string) => void
    onDelete: (hwid: string) => void
    onUnblock: (hwid: string) => void
}

export const UserHwidDeviceItem = (props: IProps) => {
    const entityAccentColor = useEntityAccentColor()
    const primaryColor = usePrimaryColorName()
    const { index, device, isBlocked, isBlocking, onBlock, onDelete, onUnblock } = props
    const { t, i18n } = useTranslation()

    const resolvePlatform = (platform: null | string) => {
        if (!platform) return <PiDeviceMobile size={24} />
        switch (platform.toLowerCase()) {
            case 'android':
                return <PiAndroidLogo size={24} />
            case 'ios':
                return <PiAppleLogo size={24} />
            case 'linux':
                return <PiLinuxLogo size={24} />
            case 'macos':
                return <PiAppleLogo size={24} />
            case 'unknown':
                return <PiDeviceMobile size={24} />
            case 'windows':
                return <PiWindowsLogo size={24} />
            default:
                return <PiDeviceMobile size={24} />
        }
    }

    return (
        <SettingsCardShared.Container>
            <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs" wrap="nowrap">
                    <ThemeIcon color="indigo" size="lg" variant="soft">
                        {resolvePlatform(device.platform)}
                    </ThemeIcon>
                    <Text fw={600} size="md">
                        #{index + 1}
                    </Text>
                    {isBlocked && (
                        <Badge color="red" size="sm" variant="light">
                            {t('get-hwid-user-devices.feature.blocked')}
                        </Badge>
                    )}
                </Group>

                <Group gap="xs" wrap="nowrap">
                    {isBlocked ? (
                        <Tooltip label={t('blocked-hwids-table.widget.unblock')} withArrow>
                            <ActionIcon
                                aria-label={t('blocked-hwids-table.widget.unblock')}
                                color={entityAccentColor}
                                loading={isBlocking}
                                onClick={() => onUnblock(device.hwid)}
                                size="lg"
                                variant="soft"
                            >
                                <TbLockOff size="20px" />
                            </ActionIcon>
                        </Tooltip>
                    ) : (
                        <Tooltip label={t('hwid-inspector-table.widget.block-hwid')} withArrow>
                            <ActionIcon
                                aria-label={t('hwid-inspector-table.widget.block-hwid')}
                                color="red"
                                loading={isBlocking}
                                onClick={() => onBlock(device.hwid)}
                                size="lg"
                                variant="soft"
                            >
                                <TbShieldLock size="20px" />
                            </ActionIcon>
                        </Tooltip>
                    )}
                    <ActionIcon
                        aria-label={t('get-hwid-user-devices.feature.delete-device')}
                        color="red"
                        onClick={() => onDelete(device.hwid)}
                        size="lg"
                        variant="soft"
                    >
                        <PiTrash size="20px" />
                    </ActionIcon>
                </Group>
            </Group>
            <Divider />
            <SettingsCardShared.Content>
                <Stack gap="xs">
                    <CopyableFieldShared label="HWID" size="sm" value={device.hwid} />

                    <Group align="flex-end" gap="xs" wrap="nowrap">
                        <Box style={{ flex: 1 }}>
                            <CopyableFieldShared
                                label={t(
                                    'get-user-subscription-request-history.feature.ip-address'
                                )}
                                size="sm"
                                value={device.requestIp || '-'}
                            />
                        </Box>

                        {device.requestIp && (
                            <ActionIcon
                                color={primaryColor}
                                component="a"
                                href={`https://ipinfo.io/${device.requestIp}`}
                                rel="noopener noreferrer"
                                size="input-sm"
                                target="_blank"
                                variant="soft"
                            >
                                <TbExternalLink size={18} />
                            </ActionIcon>
                        )}
                    </Group>

                    <Group gap="xs" grow>
                        <CopyableFieldShared
                            label={t('get-hwid-user-devices.feature.platform')}
                            size="sm"
                            value={device.platform || t('get-hwid-user-devices.feature.unknown')}
                        />

                        <CopyableFieldShared
                            label={t('get-hwid-user-devices.feature.os-version')}
                            size="sm"
                            value={device.osVersion || t('get-hwid-user-devices.feature.unknown')}
                        />
                    </Group>

                    <CopyableFieldShared
                        label={t('get-hwid-user-devices.feature.model')}
                        size="sm"
                        value={device.deviceModel || t('get-hwid-user-devices.feature.unknown')}
                    />

                    <CopyableFieldShared
                        label={t('get-hwid-user-devices.feature.user-agent')}
                        size="sm"
                        value={device.userAgent || t('get-hwid-user-devices.feature.unknown')}
                    />

                    <CopyableFieldShared
                        label={t('get-hwid-user-devices.feature.added')}
                        size="sm"
                        value={formatTimeUtil({
                            time: device.createdAt,
                            template: 'TIME_FIRST_DATETIME',
                            language: i18n.language
                        })}
                    />

                    <CopyableFieldShared
                        label="Updated"
                        size="sm"
                        value={formatTimeUtil({
                            time: device.updatedAt,
                            template: 'TIME_FIRST_DATETIME',
                            language: i18n.language
                        })}
                    />
                </Stack>
            </SettingsCardShared.Content>
        </SettingsCardShared.Container>
    )
}
