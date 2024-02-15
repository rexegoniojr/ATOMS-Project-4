import { create } from 'zustand'
import { toUnzip } from '@utils/Converter'

export const authHolder = create((set) => ({
    account_details: toUnzip(localStorage.getItem('TKPIN')),
    token_holder: (data) => set(() => ({ account_details: data })),
    clearToken: () => set(() => ({ account_details: [] }))
}))

export const reloadAuth = create((set) => ({
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))