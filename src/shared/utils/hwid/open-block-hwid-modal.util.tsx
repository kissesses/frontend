import { DateTimePicker } from '@mantine/dates'
import { TextInput } from '@mantine/core'
import { modals } from '@mantine/modals'
import type { TFunction } from 'i18next'

interface OpenBlockHwidModalParams {
    hwid: string
    isLoading?: boolean
    onConfirm: (params: { hwid: string; reason?: string; expiresAt?: Date }) => void
    t: TFunction
}

export function openBlockHwidModal(params: OpenBlockHwidModalParams) {
    const { hwid, isLoading, onConfirm, t } = params
    let reason = ''
    let expiresAt: Date | undefined

    modals.openConfirmModal({
        title: t('hwid-inspector-table.widget.block-hwid-title'),
        children: (
            <>
                <TextInput defaultValue={hwid} disabled label="HWID" mb="sm" />
                <TextInput
                    label={t('blocked-hwids-table.widget.reason')}
                    mb="sm"
                    onChange={(event) => {
                        reason = event.currentTarget.value
                    }}
                    placeholder={t('hwid-inspector-table.widget.block-reason-placeholder')}
                />
                <DateTimePicker
                    clearable
                    label={t('blocked-hwids-table.widget.expires-at')}
                    minDate={new Date()}
                    onChange={(value) => {
                        expiresAt = value ? new Date(value) : undefined
                    }}
                    placeholder={t('blocked-hwids-table.widget.permanent')}
                />
            </>
        ),
        labels: {
            confirm: t('hwid-inspector-table.widget.block-hwid'),
            cancel: t('common.cancel')
        },
        confirmProps: { color: 'red', loading: isLoading },
        centered: true,
        onConfirm: () => {
            onConfirm({
                hwid,
                reason: reason.trim() || undefined,
                expiresAt: expiresAt
            })
        }
    })
}
