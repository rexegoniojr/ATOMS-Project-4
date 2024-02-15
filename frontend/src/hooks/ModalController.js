import { create } from 'zustand'

export const viewData = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

export const createPreAlert = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))

export const viewAccount = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    userKey: '',
    storeKey: (data) => set(() => ({ userKey: data })),
}))