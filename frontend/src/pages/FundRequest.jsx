import React from 'react'
import { Tabs } from 'antd';

import AvailableFundRequest from './fund-request/AvailableFundRequest';
import PendingFundRequest from './fund-request/PendingFundRequest';
import CompleteFundRequest from './fund-request/CompleteFundRequest';
function FundRequest() {

  const items = [
    {
      key: '1',
      label: 'Available',
      children: (<AvailableFundRequest />),
    },
    {
      key: '2',
      label: 'Pending',
      children: (<PendingFundRequest />),
    },
    {
      key: '3',
      label: 'Complete',
      children: (<CompleteFundRequest />),
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

export default FundRequest