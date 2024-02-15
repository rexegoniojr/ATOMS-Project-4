import * as React from 'react'
import { Divider, Typography, Input, Space, Empty } from 'antd'
import { convertTime } from '@utils/Formats'
import ViewSAD from '@components/sad/ViewSAD'

function LodgeDisplay({ list, selected, control, token, obtain }) {
  return (<div>{list?.LodgeDate
    ? (<>
      <Divider orientation='left'>Lodge Details</Divider>
      <Typography.Title level={5}>Action Owner</Typography.Title>
      <Input value={list?.ActionOwner} readOnly />
      <Space.Compact block>
        <div className='w-2/4'>
          <Typography.Title level={5}>Lodge Date</Typography.Title>
          <Input value={list?.LodgeDate} readOnly />
        </div>
        <div className='w-2/4'>
          <Typography.Title level={5}>Lodge Time</Typography.Title>
          <Input value={convertTime(list?.LodgeTime)} readOnly />
        </div>
      </Space.Compact>
      <Typography.Title level={5}>Remarks</Typography.Title>
      <Input.TextArea value={list?.Remarks} autoSize={{ maxRows: 5, }} readOnly />
      <ViewSAD selected={selected} control={control} token={token} obtain={obtain} />
    </>)
    : (<div className='h-[380px] flex flex-col justify-center items-center select-none'>
      <div className='flex justify-center content-center'>
        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
      </div>
    </div>)
  }</div>)
}

export default LodgeDisplay