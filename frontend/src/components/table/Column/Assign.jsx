import React from 'react'

function Assign() {
    const column = [
        {
            title: 'Sequence of Shipment',
            dataIndex: 'sos',
            key: 'sos',
            fixed: 'left',
            width: '120px',
        },
        {
            title: 'Type of Shipment',
            dataIndex: 'typeOfShipment',
            key: 'typeOfShipment',
            width: '120px',
        },
        {
            title: 'Type of Declaration',
            dataIndex: 'typeOfDeclaration',
            key: 'typeOfDeclaration',
            width: '120px',
        },
        {
            title: 'Name of CS',
            dataIndex: 'nameOfCS',
            key: 'nameOfCS',
            width: '120px',
        },
        {
            title: 'Consignee Name',
            dataIndex: 'consigneeName',
            key: 'consigneeName',
            width: '120px',
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
            width: '120px',
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
            width: '120px',
        },
        {
            title: 'Pro Number',
            dataIndex: 'proNum',
            key: 'proNum',
            width: '120px',
        },
        {
            title: 'Old Pro',
            dataIndex: 'oldPro',
            key: 'oldPro',
            width: '120px',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '250px',
        },
        {
            title: 'Type of Permit',
            dataIndex: 'typeOfPermit',
            key: 'typeOfPermit',
            width: '300px',
        },
        {
            title: 'Assign',
            dataIndex: 'assign',
            key: 'assign',
            width: '60px',
            fixed: 'right',
        }
    ];

    return column
}

export default Assign