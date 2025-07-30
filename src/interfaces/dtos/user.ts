import { UserProvider, UserRole, UserStatus } from '@constants/enums'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: keyof typeof UserRole
  avatar: string
  phone?: string
  isActive: boolean
  status: keyof typeof UserStatus
  provider?: keyof typeof UserProvider
  providerUserId?: string
}
