import * as React from 'react'
import {
  Input, Typography, Space, Card, Badge, Empty,
} from 'antd'
import { mmddyy } from '@utils/Formats';
import { convertTime } from '@utils/Formats';
import { v4 as uuidv4 } from 'uuid';

function FundRequestDisplay({ obtain, list, selected, control, token, accept }) {
  return (
    <div className='container overflow-y-auto h-[500px]'>
      {
        list?.length === 0
          ? (<div className='h-[380px] flex flex-col justify-center items-center select-none'>
            <div className='flex justify-center content-center'>
              <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
            </div>
          </div>)
          : list?.filter((items) => {
            return items.frStatus === 'Complete'
          }).map((x) => (<div className='pt-2 px-2 w-[98.5%]'
            key={uuidv4()}>
            <Badge.Ribbon color={x?.frStatus === 'Complete'
              ? 'green'
              : x?.frStatus === 'Pending'
                ? 'purple'
                : x?.frStatus === 'Cancelled'
                  ? 'red'
                  : 'blue'} text={
                    !x?.frStatus
                      ? 'Available'
                      : x?.frStatus
                  }>
              <Card>
                <div hidden={x?.frStatus ? true : false}>
                  <Typography.Title level={5}>Action Owner</Typography.Title>
                  <Input value={x?.ActionOwner} readOnly />
                </div>
                <Typography.Title level={5}>Note</Typography.Title>
                <Input.TextArea value={x?.frNote} autoSize={{ maxRows: 5, }} readOnly />
                <Space.Compact block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Request Date</Typography.Title>
                    <Input value={x?.requestDate} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Request Date</Typography.Title>
                    <Input value={convertTime(x?.requestTime)} readOnly />
                  </div>
                </Space.Compact>
                <div hidden={x?.frStatus === 'Complete' ? false : true}>
                  <Space.Compact block>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                      <Input value={mmddyy(x?.receivedDate)} readOnly />
                    </div>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                      <Input value={convertTime(new Date(x?.receivedTime).toTimeString())} readOnly />
                    </div>
                  </Space.Compact>
                </div>
                <div hidden={!x?.Remarks ? true : false}>
                  <Typography.Title level={5}>Remarks</Typography.Title>
                  <Input.TextArea autoSize={{ maxRows: 5, }} value={x?.Remarks} readOnly />
                </div>
              </Card>
            </Badge.Ribbon>
          </div>))
      }
    </div >
  )
}

export default FundRequestDisplay