import React from 'react'
import { Tabs } from 'antd';
import AvailableDORO from './doro/AvailableDORO';
import PendingDORO from './doro/PendingDORO';
import CompleteDORO from './doro/CompleteDORO';
function DORO() {
    const items = [
        {
            key: '1',
            label: 'Available',
            children: (<AvailableDORO />),
        },
        {
            key: '2',
            label: 'Pending',
            children: (<PendingDORO />),
        },
        {
            key: '3',
            label: 'Complete',
            children: (<CompleteDORO />),
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

export default DORO