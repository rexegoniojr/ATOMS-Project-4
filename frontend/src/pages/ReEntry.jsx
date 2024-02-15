import React from 'react'
import { Tabs } from 'antd';
import AvailableRE from './re/AvailableRE';
import PendingRE from './re/PendingRE';
import CompleteRE from './re/CompleteRE';
function ReEntry() {
    const items = [
        {
            key: '1',
            label: 'Available',
            children: (<AvailableRE />),
        },
        {
            key: '2',
            label: 'Pending',
            children: (<PendingRE />),
        },
        {
            key: '3',
            label: 'Complete',
            children: (<CompleteRE />),
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

export default ReEntry