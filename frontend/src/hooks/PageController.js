import { create } from 'zustand'
import { toUnzip } from '@utils/Converter'

export const PageKey = create((set) => ({
    pageAccess: toUnzip(localStorage.getItem('UPTH')),
    setPageAccess: (value) => set(() => ({ pageAccess: value })),
    key: toUnzip(localStorage.getItem('PKH')),
    setKey: (value) => set(() => ({ key: value })),
}))
