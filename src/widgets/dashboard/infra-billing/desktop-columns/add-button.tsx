import { ActionIcon } from '@mantine/core'
import { TbPlus } from 'react-icons/tb'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'

interface AddButtonProps {
    onClick: () => void
}

export function AddButton(props: AddButtonProps) {
    const entityAccentColor = useEntityAccentColor()
    const { onClick } = props

    return (
        <ActionIcon color={entityAccentColor} onClick={onClick} size="input-xs" variant="soft">
            <TbPlus size={18} />
        </ActionIcon>
    )
}
