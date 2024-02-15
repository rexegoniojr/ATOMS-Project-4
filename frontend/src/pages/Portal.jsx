import React from 'react'
import { Tabs } from 'antd';
import AvailablePortal from './portal/AvailablePortal';
import PendingPortal from './portal/PendingPortal';
import CompletePortal from './portal/CompletePortal';
function Portal() {


    const items = [
        {
            key: '1',
            label: 'Available',
            children: (<AvailablePortal />),
        },
        {
            key: '2',
            label: 'Pending',
            children: (<PendingPortal />),
        },
        {
            key: '3',
            label: 'Complete',
            children: (<CompletePortal />),
        },
    ]
    return (
        <>
            <div className='px-4'>
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </>
    )
}

export default Portal