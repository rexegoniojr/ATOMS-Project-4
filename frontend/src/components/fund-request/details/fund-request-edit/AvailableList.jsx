import * as React from 'react'
import {
    Input, Button, Typography, Space, Card,
    Badge, Empty, Popconfirm, Tabs
} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { submitAcceptRequest } from '@api/FundRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertTime } from '@utils/Formats';
import { v4 as uuidv4 } from 'uuid';

function AvailableList({ obtain, list, selected, control, token, accept }) {

    const queryClient = useQueryClient()
    const submitAcceptMutation = useMutation({
        mutationFn: async (value) => {
            const dataContainer = {
                frKey: value,
                ActionOwner: token.firstName + ' ' + token.lastName,
                userKey: token.userKey,
            }

            const response = await submitAcceptRequest(dataContainer)
            accept(response)
            if (response.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['FundRequestDetails'] }, { exact: true })
            }
        },
    })

    function handleSubmit(e) {
        submitAcceptMutation.mutate(e)
    }

    return (
        <div className='container overflow-y-auto h-[380px]'>
            {
                list?.length === 0 || list?.includes('Available') === false
                    ? (<div className='h-[250px] flex flex-col justify-center items-center select-none'>
                        <div className='flex justify-center content-center'>
                            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                        </div>
                    </div>)
                    : list?.map((x) => (<>
                        {
                            x?.frStatus === 'Available'
                                ? (<div className='pt-2 px-2 w-[98.5%]'
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
                                            <div hidden={x?.frStatus ? true : false}>
                                                <Space.Compact block>
                                                    <div className='w-2/4'>
                                                        <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                                                        <Input value={x?.recievedDate} readOnly />
                                                    </div>
                                                    <div className='w-2/4'>
                                                        <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                                                        <Input value={convertTime(x?.recievedTime)} readOnly />
                                                    </div>
                                                </Space.Compact>
                                            </div>
                                            <div className='mt-2 float-end' hidden={x?.frStatus === 'Complete' ||
                                                x?.frStatus === 'Cancelled' ? true : false}>
                                                <Popconfirm
                                                    icon={
                                                        <QuestionCircleOutlined
                                                            style={{
                                                                color: '#1677ff',
                                                            }} />}
                                                    title='Confirm Accept'
                                                    description="Are you sure you want to accept this fund request?"
                                                    okButtonProps={{ className: 'bg-[#1677ff]' }}
                                                    onConfirm={() => { handleSubmit(x?.frKey) }}
                                                    okText="Yes"
                                                    cancelText="No">
                                                    <Button className='bg-[#1677ff]'
                                                        type='primary'>Accept</Button>
                                                </Popconfirm>
                                            </div>
                                        </Card>
                                    </Badge.Ribbon>
                                </div>)
                                : (<></>)
                        }
                    </>))
            }
        </div >
    )
}

export default AvailableList