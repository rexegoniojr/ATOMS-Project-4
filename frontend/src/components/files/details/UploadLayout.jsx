import * as React from 'react'
import { Upload, notification, Button, ConfigProvider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fileUpload } from '@api/Files';
import { FileUpload } from '@hooks/FileController';

function UploadLayout({ obtain, token }) {

    const [api, contextHolder] = notification.useNotification();
    const fileList = FileUpload((state) => state.fileList)
    const addFile = FileUpload((state) => state.addFile)
    const removeFile = FileUpload((state) => state.removeFile)
    const clearFileList = FileUpload((state) => state.clearList)

    let checkFiles = true
    if (fileList.length === 0) { checkFiles = true }
    else { checkFiles = false }

    React.useEffect(() => {
        clearFileList()
    }, [obtain])

    function handleRemove(file) {
        removeFile(file)
    }

    function handleBeforeUpload(file) {
        let checkType
        if (file.name.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|zip)$/) !== null) {
            checkType = true
        }
        else { checkType = false }

        if (!checkType) {
            api['warning']({
                message: 'Unable to save file',
                description: `${file.name} is not allowed to upload in the system. 
                Please contact the System Administrator.`
            });
        }
        else {
            addFile(file)
        }
        return checkType || Upload.LIST_IGNORE;
    }

    async function handleUpload() {
        const formData = new FormData();
        formData.append('fileKey', obtain.fileKey);
        formData.append('refNum', obtain.refNum);
        formData.append('uploadBy', token.firstName + ' ' + token.lastName);
        formData.append('userKey', token.userKey);
        fileList.map((file) => {
            formData.append('files', file);
        });
        const response = await fileUpload(formData)
        const { status, title, message } = response
        api[status]({
            message: title,
            description: message
        });
    }

    return (
        <div className='pt-1'>
            {contextHolder}
            <ConfigProvider theme={{ token: { colorPrimary: '#166534' } }}>
                <Button className='float-right bg-[#166534]' type='primary'
                    onClick={handleUpload} hidden={checkFiles} icon={<UploadOutlined />}>Save</Button>
            </ConfigProvider>
            <div className='overflow-y-auto h-[200px]'>
                <Upload size='large' beforeUpload={handleBeforeUpload} className='w-100'
                    onRemove={handleRemove} fileList={fileList} multiple>
                    <Button className='float-left bg-[#1677ff]' type='primary'
                        icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </div>
        </div>
    )
}

export default UploadLayout