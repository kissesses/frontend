export enum UI_THEME {
    DEFAULT = 'default',
    NOCTIS = 'noctis'
}

export type ThemeId = UI_THEME

export interface ThemeMeta {
    id: ThemeId
    labelKey: string
    descriptionKey: string
}

export const THEME_OPTIONS: ThemeMeta[] = [
    {
        id: UI_THEME.DEFAULT,
        labelKey: 'visual-settings-card.widget.theme-default',
        descriptionKey: 'visual-settings-card.widget.theme-default-description'
    },
    {
        id: UI_THEME.NOCTIS,
        labelKey: 'visual-settings-card.widget.theme-noctis',
        descriptionKey: 'visual-settings-card.widget.theme-noctis-description'
    }
]
