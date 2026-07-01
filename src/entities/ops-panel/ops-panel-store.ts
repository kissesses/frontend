import { create } from 'zustand'

const STORAGE_KEY = 'kissesses_ops_unlocked'

interface OpsPanelState {
    unlocked: boolean
    actions: {
        lock: () => void
        unlock: () => void
    }
}

const readUnlocked = () => {
    try {
        return sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

const writeUnlocked = (value: boolean) => {
    try {
        if (value) {
            sessionStorage.setItem(STORAGE_KEY, '1')
        } else {
            sessionStorage.removeItem(STORAGE_KEY)
        }
    } catch {
        // ignore private browsing restrictions
    }
}

export const useOpsPanelStore = create<OpsPanelState>((set) => ({
    unlocked: readUnlocked(),
    actions: {
        unlock: () => {
            writeUnlocked(true)
            set({ unlocked: true })
        },
        lock: () => {
            writeUnlocked(false)
            set({ unlocked: false })
        }
    }
}))

export const useOpsPanelUnlocked = () => useOpsPanelStore((state) => state.unlocked)
export const useOpsPanelActions = () => useOpsPanelStore((state) => state.actions)
