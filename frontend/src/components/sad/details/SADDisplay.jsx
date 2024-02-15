import * as React from 'react'
import { Divider, Typography, Input, Space } from 'antd'
import { convertTime } from '@utils/Formats'

function SADDisplay({ list }) {
  return (
    <>
      <Divider orientation='left'>SAD Details</Divider>
      <Typography.Title level={5}>Action Owner</Typography.Title>
      <Input value={list?.ActionOwner} readOnly />
      <Space.Compact block>
        <div className='w-2/4'>
          <Typography.Title level={5}>Lodge Date</Typography.Title>
          <Input value={list?.sentDate} readOnly />
        </div>
        <div className='w-2/4'>
          <Typography.Title level={5}>Lodge Time</Typography.Title>
          <Input value={convertTime(list?.sentTime)} readOnly />
        </div>
      </Space.Compact>
    </>
  )
}

export default SADDisplay