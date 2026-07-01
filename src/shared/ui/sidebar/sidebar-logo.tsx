import { Image } from '@mantine/core'
import { useOpsPanelLogoClick } from '@features/ops-panel'
import { useNavigate } from 'react-router'

import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { ROUTES } from '@shared/constants'

import { Logo } from '../logo'
import classes from './sidebar.module.css'

export const SidebarLogoShared = () => {
    const { data: authStatus } = useGetAuthStatus()
    const { handleLogoClick } = useOpsPanelLogoClick()

    const navigate = useNavigate()

    const handleSingleClick = () => {
        navigate(ROUTES.DASHBOARD.HOME)
    }

    const onClick = () => {
        handleLogoClick(handleSingleClick)
    }

    if (authStatus?.branding.logoUrl) {
        return (
            <Image
                alt="logo"
                className={classes.fadeIn}
                fallbackSrc="/favicons/logo.svg"
                fit="contain"
                onClick={onClick}
                src={authStatus.branding.logoUrl}
                style={{
                    maxWidth: '30px',
                    maxHeight: '30px',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer'
                }}
            />
        )
    }

    return (
        <Logo
            className={classes.fadeIn}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
            w="2.5rem"
        />
    )
}
