import type { MenuActionItem } from '@components/Menu'
import { useTranslation } from 'react-i18next'
import { useLogout } from './useLogout'

/** "Logout" menu item, disabled while the logout request is in flight. */
export const useLogoutMenuItem = (): MenuActionItem => {
  const { t } = useTranslation()
  const { onLogout, loading } = useLogout()

  return {
    key: 'logout',
    label: t('auth.logout'),
    onSelect: onLogout,
    disabled: loading,
  }
}
