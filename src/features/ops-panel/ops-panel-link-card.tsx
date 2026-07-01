import { Badge, Card, Group, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core'
import { ReactNode } from 'react'
import { Link } from 'react-router'

interface OpsPanelLinkCardProps {
    badge?: string
    badgeColor?: string
    description: string
    href: string
    icon: ReactNode
    newTab?: boolean
    title: string
}

export function OpsPanelLinkCard(props: OpsPanelLinkCardProps) {
    const { badge, badgeColor = 'gray', description, href, icon, newTab, title } = props

    const content = (
        <Card p="md" radius="sm" withBorder>
            <Group align="flex-start" gap="sm" wrap="nowrap">
                <ThemeIcon color="grape" size="lg" variant="light">
                    {icon}
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <Group gap="xs" wrap="wrap">
                        <Text fw={600} size="sm">
                            {title}
                        </Text>
                        {badge && (
                            <Badge color={badgeColor} size="sm" variant="light">
                                {badge}
                            </Badge>
                        )}
                    </Group>
                    <Text c="dimmed" size="xs">
                        {description}
                    </Text>
                </Stack>
            </Group>
        </Card>
    )

    if (newTab) {
        return (
            <UnstyledButton
                component="a"
                href={href}
                rel="noreferrer"
                style={{ display: 'block', width: '100%' }}
                target="_blank"
            >
                {content}
            </UnstyledButton>
        )
    }

    return (
        <UnstyledButton component={Link} style={{ display: 'block', width: '100%' }} to={href}>
            {content}
        </UnstyledButton>
    )
}
