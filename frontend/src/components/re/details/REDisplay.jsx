import * as React from 'react'
import {
  Divider, Typography, Input, Space, Badge, Card, Empty
} from 'antd'
import { convertTime, mmddyy } from '@utils/Formats';
import { toUpperText } from '@utils/Converter';
function REDisplay({ list }) {
  return (
    <>
      {
        !list?.ActionOwner
          ? (<div className='h-[380px] flex flex-col justify-center items-center select-none my-21'>
            <div className='flex justify-center content-center'>
              <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
            </div>
          </div>)
          : (<>
            <Divider orientation='left'>DO/RO Details</Divider>
            <Badge.Ribbon color={list?.reStatus === 'Complete'
              ? 'green'
              : list?.reStatus === 'Pending'
                ? 'purple'
                : 'blue'} text={
                  !list?.reStatus
                    ? 'Available'
                    : list?.reStatus
                }>
              <Card>
                <Typography.Title level={5}>Action Owner</Typography.Title>
                <Input value={list?.ActionOwner} readOnly />
                <Space.Compact hidden={!list?.ActionOwner ? true : false} block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Filed Date</Typography.Title>
                    <Input value={mmddyy(list?.filedDate)} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Filed Time</Typography.Title>
                    <Input value={convertTime(
                      new Date(list?.filedTime).toTimeString())} readOnly />
                  </div>
                </Space.Compact>
                <Space.Compact hidden={!list?.filedDate ? true : false} block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Date Secured</Typography.Title>
                    <Input value={mmddyy(list?.securedDate)} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Time Secured</Typography.Title>
                    <Input value={convertTime(
                      new Date(list?.securedTime).toTimeString())} readOnly />
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

export default REDisplay