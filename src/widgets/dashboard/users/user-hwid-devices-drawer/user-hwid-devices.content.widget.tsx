import {
    ActionIcon,
    Box,
    Card,
    Group,
    Loader,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDevices, TbRefresh, TbTrash } from 'react-icons/tb'
import { Virtuoso } from 'react-virtuoso'

import {
    QueryKeys,
    useBlockHwidWithInvalidation,
    useDeleteAllUserHwidDevices,
    useDeleteUserHwidDevice,
    useGetUserHwidDevices,
    useHwidBlockedStatusMap,
    useUnblockHwidWithInvalidation
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { openBlockHwidModal } from '@shared/utils/hwid/open-block-hwid-modal.util'

import { UserHwidDeviceItem } from './user-hwid-device-item'
import classes from './user-hwid-devices.module.css'
import { UserHwidDevicesTable } from './user-hwid-devices.table'

interface IProps {
    mobile: boolean
    userUuid: string
}

export const UserHwidDevicesContentWidget = (props: IProps) => {
    const { userUuid, mobile } = props
    const { t } = useTranslation()

    const {
        data: devices,
        isLoading,
        isFetching,
        refetch
    } = useGetUserHwidDevices({
        route: {
            userUuid
        }
    })

    const deviceHwids = useMemo(
        () => devices?.devices.map((device) => device.hwid) ?? [],
        [devices?.devices]
    )
    const blockedHwidMap = useHwidBlockedStatusMap(deviceHwids)

    const { mutate: blockHwid, isPending: isBlocking } = useBlockHwidWithInvalidation()
    const { mutate: unblockHwid, isPending: isUnblocking } = useUnblockHwidWithInvalidation()

    const { mutate: deleteDevice } = useDeleteUserHwidDevice({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys['hwid-user-devices'].getUserHwidDevices({
                        userUuid
                    }).queryKey,
                    data
                )
            }
        }
    })

    const { mutate: deleteAllDevices } = useDeleteAllUserHwidDevices({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys['hwid-user-devices'].getUserHwidDevices({
                        userUuid
                    }).queryKey,
                    data
                )
            }
        }
    })

    const handleDeleteDevice = (hwid: string) => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteDevice({
                    variables: {
                        hwid,
                        userUuid
                    }
                })
            }
        })
    }

    const handleDeleteAllDevices = () => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteAllDevices({
                    variables: { userUuid }
                })
            }
        })
    }

    const handleBlockDevice = (hwid: string) => {
        openBlockHwidModal({
            hwid,
            isLoading: isBlocking,
            t,
            onConfirm: ({ hwid: normalizedHwid, reason, expiresAt }) => {
                blockHwid({
                    variables: {
                        hwid: normalizedHwid,
                        reason,
                        expiresAt
                    }
                })
            }
        })
    }

    const handleUnblockDevice = (hwid: string) => {
        modals.openConfirmModal({
            title: t('blocked-hwids-table.widget.unblock-title'),
            children: t('blocked-hwids-table.widget.unblock-confirm', { hwid }),
            labels: {
                confirm: t('blocked-hwids-table.widget.unblock'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'teal' },
            centered: true,
            onConfirm: () => {
                unblockHwid({
                    route: { hwid }
                })
            }
        })
    }

    const renderListContent = () => {
        if (!devices || devices.devices.length === 0) return null
        return (
            <Box className={classes.listContainer}>
                <Virtuoso
                    data={devices.devices}
                    itemContent={(index, device) => {
                        return (
                            <Box className={classes.itemWrapper}>
                                <UserHwidDeviceItem
                                    device={device}
                                    index={index}
                                    isBlocked={blockedHwidMap.get(device.hwid) ?? false}
                                    isBlocking={isBlocking || isUnblocking}
                                    onBlock={handleBlockDevice}
                                    onDelete={handleDeleteDevice}
                                    onUnblock={handleUnblockDevice}
                                />
                            </Box>
                        )
                    }}
                    style={{
                        height: '100%'
                    }}
                    totalCount={devices.devices.length}
                    useWindowScroll={false}
                />
            </Box>
        )
    }

    return (
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack className={classes.drawerContent}>
                <Card withBorder>
                    <Stack gap="md">
                        <Group gap="sm" justify="space-between">
                            <Group>
                                <ThemeIcon color="indigo" radius="md" size="xl" variant="soft">
                                    <TbDevices size={24} />
                                </ThemeIcon>
                                <Stack gap={0}>
                                    <Box
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: 'calc(var(--mantine-font-size-xl) * var(--mantine-line-height))'
                                        }}
                                    >
                                        {isLoading ? (
                                            <Loader color="cyan" size="sm" type="oval" />
                                        ) : (
                                            <Text c="white" fw={700} size="xl">
                                                {devices?.devices.length ?? 0}
                                            </Text>
                                        )}
                                    </Box>
                                    <Text c="dimmed" size="xs">
                                        {t('get-hwid-user-devices.feature.devices')}
                                    </Text>
                                </Stack>
                            </Group>
                            <Group gap="xs">
                                <Tooltip label={t('common.refresh')}>
                                    <ActionIcon
                                        color="indigo"
                                        loading={isFetching}
                                        onClick={() => refetch()}
                                        size="lg"
                                        variant="soft"
                                    >
                                        <TbRefresh size={20} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip
                                    label={t('get-hwid-user-devices.feature.delete-all-devices')}
                                >
                                    <ActionIcon
                                        color="red"
                                        onClick={handleDeleteAllDevices}
                                        size="lg"
                                        variant="soft"
                                    >
                                        <TbTrash size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>
                    </Stack>
                </Card>

                {mobile && !isLoading && devices?.devices.length === 0 && <EmptyPageLayout />}

                {mobile && isLoading && <LoaderModalShared h="80vh" text="Loading..." w="100%" />}
                {mobile && !isLoading && renderListContent()}

                {!mobile && (
                    <Box className={classes.tableContainer}>
                        <UserHwidDevicesTable
                            blockedHwidMap={blockedHwidMap}
                            devices={devices?.devices}
                            isBlocking={isBlocking || isUnblocking}
                            isLoading={isLoading}
                            onBlock={handleBlockDevice}
                            onDelete={handleDeleteDevice}
                            onUnblock={handleUnblockDevice}
                        />
                    </Box>
                )}
            </Stack>
        </Box>
    )
}
