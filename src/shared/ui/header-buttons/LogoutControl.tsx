import { rem } from '@mantine/core'
import { PiSignOut } from 'react-icons/pi'
import { useNavigate } from 'react-router'

import { clearQueryClient } from '@shared/api'
import { useLogout } from '@shared/api/hooks/auth/auth.hooks'
import { ROUTES } from '@shared/constants'
import { resetAllStores } from '@shared/hocs/store-wrapper'
import { useAuth } from '@shared/hooks'

import { removeToken } from '@entities/auth'

import { HeaderControl } from './HeaderControl'
import classes from './LogoutControl.module.css'

export function LogoutControl() {
    const { setIsAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { mutate: logout } = useLogout({})

    const handleLogout = () => {
        logout({ variables: {} })
        setIsAuthenticated(false)
        removeToken()
        resetAllStores()
        clearQueryClient()
        navigate(ROUTES.AUTH.LOGIN)
    }

    return (
        <HeaderControl className={classes.logout} onClick={handleLogout}>
            <PiSignOut style={{ width: rem(22), height: rem(22) }} />
        </HeaderControl>
    )
}
