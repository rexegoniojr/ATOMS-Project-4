import * as React from 'react'
import { Divider, Typography, Input, Space, Button, notification } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApprovedCDT } from '@api/CDTApproved';
import { convertTime } from '@utils/Formats';

function DeclarantTurnOver({ obtain, selected }) {

    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient()
    const submitUpdateApprovedCDTMutation = useMutation({
        mutationFn: async (value) => {
            const dataContainer = {
                refNum: obtain.refNum,
                command: value
            }
            const response = await updateApprovedCDT(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['ApprovedCDTDetails'] }, { exact: true })
            }
        },
    })

    function handleSentToClient(e) {
        e.preventDefault()
        submitUpdateApprovedCDTMutation.mutate('SENT TO CLIENT')
    }

    function handleClientApproval(e) {
        e.preventDefault()
        submitUpdateApprovedCDTMutation.mutate('APPROVED BY CLIENT')
    }

    return (
        <div className='mx-2'>
            {contextHolder}
            <Divider orientation='left'>Turn Over to CS for Approval</Divider>
            {
                selected === 'Pre Alert'
                    ? (<>
                        <Space.Compact block>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Date of Turn Over</Typography.Title>
                                <Input value={obtain.dateOfTurnOver} readOnly />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Time of Turn Over</Typography.Title>
                                <Input value={convertTime(obtain.timeOfTurnOver)} readOnly />
                            </div>
                        </Space.Compact>
                        <Space.Compact block>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Date Sent To Client</Typography.Title>
                                <Input value={obtain.dateSentToClient} readOnly />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Time Sent To Client</Typography.Title>
                                <Space.Compact block>
                                    <Input value={convertTime(obtain.timeSentToClient)} readOnly />
                                    <Button type='primary' className='w-[100px] bg-[#1677ff]'
                                        hidden={!obtain.dateSentToClient ? false : true}
                                        onClick={handleSentToClient}>Submit</Button>
                                </Space.Compact>
                            </div>
                        </Space.Compact>
                        <Space.Compact block>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Client Approval Date</Typography.Title>
                                <Input value={obtain.clientApprovalDate} readOnly />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Client Approval Time</Typography.Title>
                                <Space.Compact block>
                                    <Input value={convertTime(obtain.clientApprovalTime)} readOnly />
                                    <Button type='primary' className='w-[100px] bg-[#1677ff]'
                                        hidden={obtain.dateSentToClient && !obtain.clientApprovalDate
                                            ? false : true} onClick={handleClientApproval}>Submit</Button>
                                </Space.Compact>
                            </div>
                        </Space.Compact>
                    </>)
                    : (<>
                        <Space.Compact block>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Date of Turn Over</Typography.Title>
                                <Input value={obtain.dateOfTurnOver} readOnly />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Time of Turn Over</Typography.Title>
                                <Input value={convertTime(obtain.timeOfTurnOver)} readOnly />
                            </div>
                        </Space.Compact>
                        <Space.Compact block>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Date Sent To Client</Typography.Title>
                                <Input value={obtain.dateSentToClient} readOnly />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Time Sent To Client</Typography.Title>
                                <Input value={convertTime(obtain.timeSentToClient)} readOnly />
                            </div>
                        </Space.Compact>
                        <Space.Compact block>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Client Approval Date</Typography.Title>
                                <Input value={obtain.clientApprovalDate} readOnly />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Client Approval Time</Typography.Title>
                                <Input value={convertTime(obtain.clientApprovalTime)} readOnly />
                            </div>
                        </Space.Compact>
                    </>)
            }
        </div>
    )
}

export default DeclarantTurnOver