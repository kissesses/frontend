import { Group, SegmentedControl, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbLayoutNavbar, TbLayoutSidebar, TbPalette } from 'react-icons/tb'

import { UI_THEME } from '@shared/constants/theme'
import { usePrimaryColorName } from '@shared/hocs/theme-applier'
import { useIsMobile } from '@shared/hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'

import {
    LAYOUT_STYLE,
    useLayoutStyle,
    useSetUiThemeAction,
    useToggleLayoutStyleAction,
    useUiTheme
} from '@entities/dashboard/view-preferences-store'

export const VisualSettingsCardWidget = () => {
    const { t } = useTranslation()

    const isMobile = useIsMobile()
    const primaryColor = usePrimaryColorName()

    const layoutStyle = useLayoutStyle()
    const uiTheme = useUiTheme()
    const toggleLayoutStyle = useToggleLayoutStyleAction()
    const setUiTheme = useSetUiThemeAction()

    if (isMobile) {
        return null
    }

    return (
        <SettingsCardShared.Container>
            <SettingsCardShared.Header
                description={t(
                    'visual-settings-card.widget.choose-how-the-desktop-navigation-is-displayed'
                )}
                icon={<TbLayoutSidebar size={24} />}
                iconColor={primaryColor}
                iconVariant="soft"
                title={t('visual-settings-card.widget.layout-style')}
            />

            <SettingsCardShared.Content>
                <Stack gap="md">
                    <SegmentedControl
                        data={[
                            {
                                label: (
                                    <Group gap="xs" justify="center" wrap="nowrap">
                                        <TbLayoutNavbar size={18} />
                                        <span>{t('visual-settings-card.widget.compact')}</span>
                                    </Group>
                                ),
                                value: LAYOUT_STYLE.COMPACT
                            },
                            {
                                label: (
                                    <Group gap="xs" justify="center" wrap="nowrap">
                                        <TbLayoutSidebar size={18} />
                                        <span>{t('visual-settings-card.widget.sidebar')}</span>
                                    </Group>
                                ),
                                value: LAYOUT_STYLE.SIDEBAR
                            }
                        ]}
                        fullWidth
                        onChange={() => toggleLayoutStyle()}
                        value={layoutStyle}
                    />

                    <Stack gap="xs">
                        <Group gap="xs">
                            <TbPalette size={18} />
                            <Text fw={500} size="sm">
                                {t('visual-settings-card.widget.theme-style')}
                            </Text>
                        </Group>
                        <Text c="dimmed" size="xs">
                            {uiTheme === UI_THEME.NOCTIS
                                ? t('visual-settings-card.widget.theme-noctis-description')
                                : t('visual-settings-card.widget.theme-default-description')}
                        </Text>
                        <SegmentedControl
                            data={[
                                {
                                    label: t('visual-settings-card.widget.theme-default'),
                                    value: UI_THEME.DEFAULT
                                },
                                {
                                    label: t('visual-settings-card.widget.theme-noctis'),
                                    value: UI_THEME.NOCTIS
                                }
                            ]}
                            fullWidth
                            onChange={(value) => setUiTheme(value as UI_THEME)}
                            value={uiTheme}
                        />
                    </Stack>
                </Stack>
            </SettingsCardShared.Content>
        </SettingsCardShared.Container>
    )
}
