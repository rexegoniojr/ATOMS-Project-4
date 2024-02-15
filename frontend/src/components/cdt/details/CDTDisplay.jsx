import * as React from 'react'
import { Divider, Typography, Input, Space, Card, Badge } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

function CDTDisplay({ list }) {
  return (
    <>
      {
        list?.length === 0
          ? (<></>)
          : list?.map((x) => (<>
            <Divider orientation='left'>CDT Status</Divider>
            <div className='w-[98.5%]'
              key={uuidv4()}>
              <Badge.Ribbon color={x.CDTStatus === 'Assigned'
                ? 'blue'
                : x.CDTStatus === 'Transfered'
                  ? 'volcano'
                  : x.CDTStatus === 'Pending'
                    ? 'purple'
                    : x.CDTStatus === 'Revision'
                      ? 'red'
                      : x.CDTStatus === 'Complete'
                        ? 'gold'
                        : 'green'} text={x.CDTStatus}>
                <Card>
                  <Space.Compact block>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Action Owner</Typography.Title>
                      <Input value={x.DeclarantName} readOnly />
                    </div>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Assigned By</Typography.Title>
                      <Input value={x.assignedBy} readOnly />
                    </div>
                  </Space.Compact>
                  <Space.Compact block>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Date of CDT</Typography.Title>
                      <Input value={x.DateOfCDT} readOnly />
                    </div>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Time of CDT</Typography.Title>
                      <Input value={x.TimeOfCDT} readOnly />
                    </div>
                  </Space.Compact>
                  <div hidden={!x.Remarks ? true : false}>
                    <Typography.Title level={5}>Remarks by User</Typography.Title>
                    <Input.TextArea value={x.Remarks} autoSize={{ maxRows: 5, }} readOnly />
                  </div>
                  <div hidden={!x.ReviseRemarks ? true : false}>
                    <Typography.Title level={5}>Remarks by Assignee</Typography.Title>
                    <Input.TextArea value={x.ReviseRemarks} autoSize={{ maxRows: 5, }} readOnly />
                  </div>
                </Card>
              </Badge.Ribbon>
            </div>
          </>))
      }
    </>
  )
}

export default CDTDisplay