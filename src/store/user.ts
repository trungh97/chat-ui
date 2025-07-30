import { User } from '@interfaces/dtos'
import { create } from 'zustand'
import { createSelectors } from './utils'

export interface UserState {
  currentUser: User | null
  setCurrentUser: (user: any) => void
  clearCurrentUser: () => void
}

const useUserStoreBase = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),
}))

const useUserStore = createSelectors(useUserStoreBase)

export default useUserStore
export { useUserStore }

