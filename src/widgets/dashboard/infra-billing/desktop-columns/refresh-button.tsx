import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbRefresh } from 'react-icons/tb'
import { usePrimaryColorName } from '@shared/hocs/theme-applier'

interface RefreshButtonProps {
    loading: boolean
    onClick: () => void
}

export function RefreshButton(props: RefreshButtonProps) {
    const primaryColor = usePrimaryColorName()
    const { loading, onClick } = props
    const { t } = useTranslation()

    return (
        <Tooltip label={t('common.refresh')} withArrow>
            <ActionIcon
                color={primaryColor}
                loading={loading}
                onClick={onClick}
                size="input-xs"
                variant="soft"
            >
                <TbRefresh size={18} />
            </ActionIcon>
        </Tooltip>
    )
}
