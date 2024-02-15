import React from 'react'

function Accounts() {
    const column = [
        {
            title: 'ID Number',
            dataIndex: 'idn',
            key: 'idn',
            width:'100px',
            fixed: 'left',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Account Type',
            dataIndex: 'acc_type',
            key: 'acc_type',
        },
        {
            title: 'Account Status',
            dataIndex: 'acc_status',
            width:'80px',
            key: 'acc_status',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    return column
}

export default Accounts