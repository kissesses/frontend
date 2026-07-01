import { AppShell, Group, GroupProps } from '@mantine/core'
import clsx from 'clsx'
import { Outlet, ScrollRestoration } from 'react-router'

import { HelpDrawerShared } from '@shared/ui/help-drawer'
import { SidebarLogoShared, SidebarTitleShared } from '@shared/ui/sidebar'

export const DASHBOARD_LINKS = {
    githubLink: 'https://github.com/kissesses/frontend'
} as const

type LayoutMainProps = Omit<React.ComponentProps<typeof AppShell.Main>, 'children'>

export const LayoutMain = ({ className, ...props }: LayoutMainProps) => (
    <AppShell.Main {...props} className={clsx('app-page-content', className)}>
        <Outlet />
        <ScrollRestoration />
        <HelpDrawerShared />
    </AppShell.Main>
)

export const LayoutBrand = (props: GroupProps) => (
    <Group {...props}>
        <SidebarLogoShared />
        <SidebarTitleShared />
    </Group>
)
