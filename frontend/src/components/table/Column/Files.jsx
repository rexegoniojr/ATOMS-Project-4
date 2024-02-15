import React from 'react'

function Files() {
    const column = [
        {
            title: 'File',
            dataIndex: 'fileName',
            key: 'fileName',
        },
        {
            title: 'Size',
            dataIndex: 'fileSize',
            key: 'fileSize',
            width: '12%',
        },
        {
            title: 'Date',
            dataIndex: 'dateUpload',
            key: 'dateUpload',
            width: '15%',
        },
        {
            title: 'Time',
            dataIndex: 'timeUpload',
            key: 'timeUpload',
            width: '10%',
        },
        {
            title: 'File',
            dataIndex: 'filesContainer',
            key: 'filesContainer',
            width: '10%',
        }
    ];

    return column
}

export default Files