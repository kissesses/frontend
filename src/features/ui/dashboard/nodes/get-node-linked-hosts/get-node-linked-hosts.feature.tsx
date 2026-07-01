import { ActionIcon, Tooltip } from '@mantine/core'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbServerCog } from 'react-icons/tb'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'
import { usePrimaryColorName } from '@shared/hocs/theme-applier'

const GetNodeLinkedHostsFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()
    const primaryColor = usePrimaryColorName()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Tooltip label={t('get-node-linked-hosts.feature.linked-hosts')}>
            <ActionIcon
                color={primaryColor}
                onClick={() => {
                    openModalWithData(MODALS.SHOW_NODE_LINKED_HOSTS_DRAWER, {
                        nodeUuid
                    })
                }}
                size="lg"
                variant="soft"
            >
                <TbServerCog size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}

export const GetNodeLinkedHostsFeature = memo(GetNodeLinkedHostsFeatureComponent)
