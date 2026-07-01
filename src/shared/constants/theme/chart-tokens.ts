export const highchartsTheme = {
    axisLabelStyle: { color: 'var(--mantine-color-text)' },
    gridLineColor: 'var(--app-border)',
    axisLineColor: 'var(--app-border)',
    tooltip: {
        backgroundColor: 'var(--app-surface-raised)',
        borderColor: 'var(--app-border)',
        style: { color: 'var(--mantine-color-text)' }
    },
    chartBackground: 'transparent'
} as const

export function getHighchartsColumnDefaults(accentColor = 'var(--app-accent)') {
    return {
        borderWidth: 0,
        borderRadius: 4,
        pointPadding: 0.1,
        groupPadding: 0.1,
        color: accentColor,
        states: {
            hover: {
                color: 'var(--app-accent-light)'
            }
        },
        dataLabels: {
            enabled: false
        }
    }
}

export const sparklineTrendColors = {
    default: {
        negative: 'red.6',
        neutral: 'gray.5',
        positive: 'teal.6'
    },
    noctis: {
        negative: 'red.6',
        neutral: 'gray.5',
        positive: 'violet.5'
    }
} as const
