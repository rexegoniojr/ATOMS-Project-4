import React from 'react'

function Normal() {

    const column = [
        {
            title: 'Sequence of Shipment',
            dataIndex: 'sos',
            key: 'sos',
            fixed: 'left',
            width: '100px',
        },
        {
            title: 'Type of Shipment',
            dataIndex: 'typeOfShipment',
            key: 'typeOfShipment',
            width: '80px',
        },
        {
            title: 'Type of Declaration',
            dataIndex: 'typeOfDeclaration',
            key: 'typeOfDeclaration',
            width: '100px',
        },
        {
            title: 'Consignee Name',
            dataIndex: 'consigneeName',
            key: 'consigneeName',
            width: '150px',
        },
        {
            title: 'Type of Account',
            dataIndex: 'typeOfAccount',
            key: 'typeOfAccount',
            width: '120px',
        },
        {
            title: 'HBL / AWBL',
            dataIndex: 'hbl_awbl',
            key: 'hbl_awbl',
        },
        {
            title: 'Arrival Date',
            dataIndex: 'arrivalDate',
            key: 'arrivalDate',
            width: '120px',
        },
        {
            title: 'Date of Receipt of Pre-alert',
            dataIndex: 'dateOfReceipt',
            key: 'dateOfReceipt',
            width: '120px',
        },
        {
            title: 'Time of Receipt of Pre-alert',
            dataIndex: 'timeOfReceipt',
            key: 'timeOfReceipt',
            width: '120px',
        },
        {
            title: 'Number of Line Items',
            dataIndex: 'numOfLineItems',
            key: 'numOfLineItems',
            width: '100px',
        },
        {
            title: 'Pro',
            dataIndex: 'proNum',
            key: 'proNum',
        },
        {
            title: 'Old Pro',
            dataIndex: 'oldPro',
            key: 'oldPro',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
    ];

    return column
}

export default Normal