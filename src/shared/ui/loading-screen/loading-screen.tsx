import { Center, Progress, Stack, Text } from '@mantine/core'
import { usePrimaryColorName } from '@shared/hocs/theme-applier'

export function LoadingScreen({
    height = '100dvh',
    text = undefined,
    value = 100
}: {
    height?: string
    text?: string
    value?: number
}) {
    const primaryColor = usePrimaryColorName()
    return (
        <Center style={{ height: `calc(${height} - var(--app-shell-header-height) - 20px)` }}>
            <Stack align="center" gap="xs" w="100%">
                {text && <Text size="lg">{text}</Text>}
                <Progress
                    animated
                    color={primaryColor}
                    maw="32rem"
                    radius="xs"
                    striped
                    value={value}
                    w="80%"
                />
            </Stack>
        </Center>
    )
}
