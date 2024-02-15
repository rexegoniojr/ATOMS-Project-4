import * as React from 'react'
import { Space, Typography, Input } from 'antd'

function PermitDetails({ data }) {
    return (
        <>
            <Typography.Title level={5}>Action Owner</Typography.Title>
            <Input value={data.permitActionOwner} readOnly />
            <Space.Compact block>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Date of Application of Permit</Typography.Title>
                    <Input value={data.dateOfAppPermit} readOnly />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Date of Secured Permit</Typography.Title>
                    <Input value={data.dateSecPermit} readOnly />
                </div>
            </Space.Compact>
            <Space.Compact block>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Submission Date</Typography.Title>
                    <Input value={data.submitDate} readOnly />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Submission Date</Typography.Title>
                    <Input value={data.submitTime} readOnly />
                </div>
            </Space.Compact>
            <div hidden={!data.permitRemarks ? true : false}>
                <Typography.Title level={5}>Remarks</Typography.Title>
                <Input.TextArea value={data.permitRemarks} autoSize={{ maxRows: 5, }} readOnly />
            </div>
        </>
    )
}

export default PermitDetails