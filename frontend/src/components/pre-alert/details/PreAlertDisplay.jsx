import React from 'react'
import { Typography, Input, Space, Divider } from 'antd';
import { convertTime, mmddyy } from '@utils/Formats';

function PreAlertDisplay({ obtain }) {
    return (
        <div className='container px-2 pt-2 '>
            <Space.Compact block className='mt-3'>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Name of CS</Typography.Title>
                    <Input readOnly value={obtain.nameOfCS} />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Type of Shipment</Typography.Title>
                    <Input readOnly value={obtain.typeOfShipment} />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Type of Declaration</Typography.Title>
                    <Input value={obtain.typeOfDeclaration} />
                </div>
            </Space.Compact>
            <Space.Compact block className='mt-2'>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Consignee Name</Typography.Title>
                    <Input value={obtain.consigneeName} />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Type of Account</Typography.Title>
                    <Input value={obtain.typeOfAccount} />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>HBL / AWBL</Typography.Title>
                    <Input value={obtain.hbl_awbl} />
                </div>
            </Space.Compact>
            <Space.Compact block className='mt-2'>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Arrival Date</Typography.Title>
                    <Input value={mmddyy(obtain.arrivalDate)} />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Number of Line Items</Typography.Title>
                    <Input value={obtain.numOfLineItems} />
                </div>
            </Space.Compact>
            <Space.Compact block className='mt-2'>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Date of Receipt of Pre-Alert</Typography.Title>
                    <Input value={mmddyy(obtain.dateOfReceipt)} />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Time of Receipt of Pre-Alert</Typography.Title>
                    <Input value={convertTime(new Date(obtain.timeOfReceipt).toTimeString())} />
                </div>
            </Space.Compact>
            <Space.Compact block className='mt-2'>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Pro Number</Typography.Title>
                    <Input value={obtain.proNum} />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Old Pro</Typography.Title>
                    <Input value={obtain.oldPro} />
                </div>
            </Space.Compact>
            <div className='w-[100%]'>
                <Typography.Title level={5}>Remarks</Typography.Title>
                <Input.TextArea value={obtain.remarks} autoSize={{ maxRows: 5, }} />
            </div>
        </div>
    )
}

export default PreAlertDisplay