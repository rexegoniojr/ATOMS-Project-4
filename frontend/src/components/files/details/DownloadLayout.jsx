import * as React from 'react'
import axios from 'axios'
import download from 'downloadjs';
import { notification, Button, Tooltip, ConfigProvider } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { DownloadOutlined } from '@ant-design/icons';
import { getAllFiles } from '@api/Files';
import { viewData } from '@hooks/ModalController';
import DataTable from '@components/table/DataTable'

function DownloadLayout({ obtain, token }) {

    const [api, contextHolder] = notification.useNotification();
    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const FilesListQuery = useQuery({
        queryKey: ['FilesList'],
        queryFn: async () => {
            const result = await getAllFiles(obtain.fileKey)
            const counter = getRefresher + 1
            setRefresher(counter)
            return result
        },
        refetchInterval: () => {
            if (getRefresher >= 3) {
                return false
            }
            else {
                return 1000
            }
        },
        enabled: getModalStatusView,
        retryDelay: 1000,
    })

    async function handleDownload(x) {
        if (x) {
            try {
                const result = await axios.get(`/Files/download/${x.fileID}`, { responseType: 'blob' })
                download(result.data, x.fileName, x.file_mimetype)
            }
            catch (error) {
                api['error']({
                    message: 'Please report this to the administrator',
                    description: error.message
                });
            }
        }
    }

    return (
        <>
            {contextHolder}
            <DataTable width={'max-content'} height={'200px'} columns={'Files'}
                rows={FilesListQuery.data?.map((x) => (x ? {
                    key: x.fileID,
                    fileName: <span style={{ cursor: 'pointer' }}>{x.fileName}</span>,
                    fileSize: <span style={{ cursor: 'pointer' }}>{x.fileSize}</span>,
                    dateUpload: <span style={{ cursor: 'pointer' }}>{x.dateUpload}</span>,
                    timeUpload: <span style={{ cursor: 'pointer' }}>{x.timeUpload}</span>,
                    filesContainer: (
                        <Tooltip placement='top' title={<span>Download</span>} arrow={true}>
                            <ConfigProvider theme={{
                                token: {
                                    colorPrimary: '#06830B',
                                },
                            }}>
                                <Button icon={<DownloadOutlined />}
                                    onClick={() => { handleDownload(x) }} size='large' />
                            </ConfigProvider>
                        </Tooltip>
                    )
                } : []))} />
        </>
    )
}

export default DownloadLayout