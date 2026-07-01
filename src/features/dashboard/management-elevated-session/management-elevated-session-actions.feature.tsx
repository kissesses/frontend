import { Button, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { TbLock } from 'react-icons/tb'

interface IProps {
    elevatedUntil: string | null
    isRevoking: boolean
    onRevoke: () => void
}

export const ManagementElevatedSessionActionsFeature = (props: IProps) => {
    const { elevatedUntil, isRevoking, onRevoke } = props
    const { t } = useTranslation()

    return (
        <>
            {elevatedUntil && (
                <Text c="dimmed" fz="sm">
                    {t('management-elevated-session.elevated-until', {
                        until: dayjs(elevatedUntil).format('DD.MM.YYYY, HH:mm')
                    })}
                </Text>
            )}
            <Button
                color="red"
                leftSection={<TbLock size={18} />}
                loading={isRevoking}
                onClick={onRevoke}
                variant="light"
            >
                {t('management-elevated-session.lock-access')}
            </Button>
        </>
    )
}
