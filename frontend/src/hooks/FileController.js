import { create } from 'zustand'
export const FileUpload = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    fileList: [],
    addFile: (file) => set((state) => ({ fileList: [...state.fileList, file] })),
    removeFile: (file) => set((state) => ({ fileList: state.fileList.filter((t) => t !== file) })),
    clearList: () => set(() => ({ fileList: [] }))
}))

export const FileDownload = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
}))