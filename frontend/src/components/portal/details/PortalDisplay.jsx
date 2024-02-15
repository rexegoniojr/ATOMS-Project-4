import * as React from 'react'
import {
  Divider, Typography, Input, Space, Badge, Card, Empty
} from 'antd'
import { convertTime } from '@utils/Formats'

function PortalDisplay({ obtain, list, token }) {
  return (
    <>
      {
        list?.length === 0
          ? (<div className='h-[380px] flex flex-col justify-center items-center select-none'>
            <div className='flex justify-center content-center'>
              <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
            </div>
          </div>)
          : (<>
            <Divider orientation='left'>Portal Details</Divider>
            <Badge.Ribbon color={list?.portalStatus === 'Complete'
              ? 'green'
              : list?.portalStatus === 'Pending'
                ? 'purple'
                : 'blue'} text={
                  !list?.portalStatus
                    ? 'Available'
                    : list?.portalStatus
                }>
              <Card>
                <Space.Compact block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Action Owner</Typography.Title>
                    <Input value={list?.ActionOwner} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Ticket No</Typography.Title>
                    <Input value={list?.ticketNo} readOnly />
                  </div>
                </Space.Compact>
                <Space.Compact block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Date of Portal</Typography.Title>
                    <Input value={list?.portalDate} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Time of Portal</Typography.Title>
                    <Input value={convertTime(list?.portalTime)} readOnly />
                  </div>
                </Space.Compact>
                <Typography.Title level={5}>Remarks</Typography.Title>
                <Input.TextArea value={list?.Remarks} autoSize={{ maxRows: 5, }} readOnly />
              </Card>
            </Badge.Ribbon>
          </>)
      }
    </>
  )
}

export default PortalDisplay