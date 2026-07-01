import { ActionIcon, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { UserSubscriptionRequestsContentWidget } from '@widgets/dashboard/users/user-subscription-requests-drawer/user-subscription-requests.content.widget'
import { useTranslation } from 'react-i18next'
import { TbTimeline } from 'react-icons/tb'

import { useIsMobile } from '@shared/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useEntityAccentColor } from '@shared/hocs/theme-applier/theme-applier'

interface IProps {
    userUuid: string
}

export function GetUserSubscriptionRequestHistoryFeature(props: IProps) {
    const entityAccentColor = useEntityAccentColor()
    const { userUuid } = props
    const { t } = useTranslation()
    const isMobile = useIsMobile()

    return (
        <Tooltip label={t('get-user-subscription-request-history.feature.request-history')}>
            <ActionIcon
                color="indigo"
                onClick={() =>
                    modals.open({
                        title: (
                            <BaseOverlayHeader
                                iconColor={entityAccentColor}
                                IconComponent={TbTimeline}
                                iconVariant="soft"
                                title={t(
                                    'get-user-subscription-request-history.feature.subscription-request-history'
                                )}
                            />
                        ),
                        centered: true,
                        size: 'min(800pxs, 70vw)',
                        fullScreen: isMobile,
                        styles: {
                            body: {
                                height: 'calc(100% - 60px)',
                                display: 'flex',
                                flexDirection: 'column'
                            }
                        },
                        children: (
                            <UserSubscriptionRequestsContentWidget
                                mobile={isMobile}
                                userUuid={userUuid}
                            />
                        )
                    })
                }
                size="lg"
                variant="soft"
            >
                <TbTimeline size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}
