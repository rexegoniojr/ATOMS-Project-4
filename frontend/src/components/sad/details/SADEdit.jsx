import * as React from 'react'
import { Divider, Typography, Input, Space, Button, notification } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitSad } from '@api/Lodge';
import SADDisplay from './SADDisplay';
function SADEdit({ list, control, selected, token, obtain }) {

    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient()

    const submitSADMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                ActionOwner: token.lastName + ' ' + token.firstName,
                userKey: token.userKey,
                refNum: obtain.refNum
            }

            const response = await submitSad(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['SADDetails'] }, { exact: true })
            }
        },
    })

    function handleSubmitSAD(e) {
        e.preventDefault()
        submitSADMutation.mutate('SUBMIT SAD')
    }

    return (
        <>
            {contextHolder}
            {
                list?.sentDate
                    ? (<SADDisplay list={list} selected={selected}
                        control={control} token={token} obtain={obtain} key='display' />)
                    : (<>
                        <Divider orientation='left'>SAD Status</Divider>
                        <Space.Compact block>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Date Sent To Client</Typography.Title>
                                <Input readOnly />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Time Sent To Client</Typography.Title>
                                {
                                    list?.sentDate
                                        ? (<Input readOnly />)
                                        : (<Space.Compact block>
                                            <Input readOnly />
                                            <Button type='primary' className='w-[100px] bg-[#1677ff]'
                                                onClick={handleSubmitSAD}>Sent</Button>
                                        </Space.Compact>)
                                }
                            </div>
                        </Space.Compact>
                    </>)
            }
        </>
    )
}

export default SADEdit