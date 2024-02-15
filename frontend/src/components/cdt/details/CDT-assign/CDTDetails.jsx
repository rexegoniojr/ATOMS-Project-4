import * as React from 'react'
import { Typography, Input, Space } from 'antd'

function CDTDetails({ obtain }) {
  return (
    <>
      <Space.Compact block>
        <div className='w-2/4'>
          <Typography.Title level={5}>Action Owner</Typography.Title>
          <Input value={obtain.DeclarantName} readOnly />
        </div>
        <div className='w-2/4'>
          <Typography.Title level={5}>Assigned By</Typography.Title>
          <Input value={obtain.assignedBy} readOnly />
        </div>
      </Space.Compact>
      <Space.Compact block>
        <div className='w-2/4'>
          <Typography.Title level={5}>Date of CDT</Typography.Title>
          <Input value={obtain.DateOfCDT} readOnly />
        </div>
        <div className='w-2/4'>
          <Typography.Title level={5}>Time of CDT</Typography.Title>
          <Input value={obtain.TimeOfCDT} readOnly />
        </div>
      </Space.Compact>
      <div hidden={!obtain.Remarks ? true : false}>
        <Typography.Title level={5}>Remarks by User</Typography.Title>
        <Input.TextArea value={obtain.Remarks} autoSize={{ maxRows: 5, }} readOnly />
      </div>
      <div hidden={!obtain.ReviseRemarks ? true : false}>
        <Typography.Title level={5}>Remarks by Assignee</Typography.Title>
        <Input.TextArea value={obtain.ReviseRemarks} autoSize={{ maxRows: 5, }} readOnly />
      </div>
    </>
  )
}

export default CDTDetails