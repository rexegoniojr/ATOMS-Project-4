import * as React from 'react'
import {
    Divider, Select, Space, Button, notification,
    Badge, Card, Tabs, Tooltip, Popconfirm
} from 'antd'
import { UserOutlined, CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOnlineUserCDT } from '@api/Status';
import { viewData } from '@hooks/ModalController';
import { submitCDT, submitTurnOverToCS } from '@api/CDT';
import { v4 as uuidv4 } from 'uuid';

import CDTDetails from './CDT-assign/CDTDetails';
import CDTRevise from './CDT-assign/CDTRevise';
import CDTTransfer from './CDT-assign/CDTTransfer';

function CDTAssign({ obtain, token, list }) {

    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient()

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)

    const [getOnlineUser, setOnlineUser] = React.useState([])
    const OnlineUserCDTDetailsQuery = useQuery({
        queryKey: ['OnlineUserCDTDetails'],
        queryFn: async () => {
            const result = await getOnlineUserCDT()
            setOnlineUser(result)
            const counter = getRefresher + 1
            setRefresher(counter)
            return result
        },
        refetchInterval: () => {
            if (getRefresher >= 3) {
                return false
            }
            else {
                return 1000
            }
        },
        enabled: getModalStatusView,
        retryDelay: 1000,
    })

    const [getName, setName] = React.useState()
    const [getUserKey, setUserKey] = React.useState('')
    function handleActionOwner(e, value) {
        setName(e)
        setUserKey(value.key)
    }

    const submitCDTMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                DeclarantName: getName,
                assignedBy: token.firstName + ' ' + token.lastName,
                assigneeKey: token.userKey,
                ReviseRemarks: '',
                userKey: getUserKey,
                CDTStatus: 'Assigned',
                refNum: obtain.refNum
            }
            const response = await submitCDT(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                OnlineUserCDTDetailsQuery.refetch()
                queryClient.invalidateQueries({ queryKey: ['CDTAssignedUserDetails'] }, { exact: true })
            }
        },
    })

    function handleSubmit(e) {
        e.preventDefault()
        submitCDTMutation.mutate('Submit_CDT')
    }

    const submitTurnOverCDTMutation = useMutation({
        mutationFn: async (value) => {
            const response = await submitTurnOverToCS(value)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                OnlineUserCDTDetailsQuery.refetch()
                queryClient.invalidateQueries({ queryKey: ['CDTAssignedUserDetails'] }, { exact: true })
            }
        },
    })


    function handleConfirm(x) {
        const data = {
            ActionOwner: x.DeclarantName,
            CDTKey: x.CDTKey,
            userKey: x.userKey,
            refNum: x.refNum,
        }
        submitTurnOverCDTMutation.mutate(data)
    }

    return (
        <>
            {contextHolder}
            <Divider orientation='left'>Assign Declarant for CDT</Divider>
            <div className='overflow-y-auto h-[325px]'>
                {
                    list?.length === 0
                        ? (<>
                            <div className='px-10 pb-2'>
                                <Space.Compact block>
                                    <Select
                                        name='assignUser'
                                        className='w-[500px]'
                                        onChange={handleActionOwner}
                                        options={getOnlineUser}
                                        allowClear
                                        placeholder='Assign User' />
                                    <Button type='primary' className='w-[100px] bg-[#1677ff]'
                                        disabled={!getName} onClick={handleSubmit}>Submit</Button>
                                </Space.Compact>
                            </div>
                            <div className='h-[200px] my-5 flex flex-col justify-center items-center select-none'
                                key={uuidv4()}>
                                <div className='flex justify-center content-center'>
                                    <UserOutlined style={{ fontSize: '50px' }} />
                                </div>
                                <div className='flex justify-center text-xl font-semibold pt-2'>
                                    <span>CDT Not Assigned</span>
                                </div>
                            </div>
                        </>)
                        : list?.map((x) => (
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
                                    <Card actions={x.CDTStatus === 'Complete'
                                        && x.assigneeKey === token.userKey
                                        ? [
                                            <Tooltip title='Approve'>
                                                <Popconfirm title='Confirm approval'
                                                    description='Are you sure to approve this task?'
                                                    icon={<QuestionCircleOutlined style={{ color: '#1677ff' }} />}
                                                    okButtonProps={{ className: 'bg-[#1677ff]' }}
                                                    okText='Yes' cancelText='No' onConfirm={() => {
                                                        handleConfirm(x)
                                                    }}>
                                                    <CheckOutlined key="approve" style={{ fontSize: '20px' }} />
                                                </Popconfirm>
                                            </Tooltip>
                                        ]
                                        : []}>
                                        {
                                            x.CDTStatus === 'Approved'
                                                ? (<CDTDetails obtain={x} />)
                                                : (<Tabs defaultActiveKey='1' items={[
                                                    {
                                                        key: '1',
                                                        label: 'Details',
                                                        children: <CDTDetails obtain={x} token={token} />,
                                                    },
                                                    {
                                                        key: '2',
                                                        label: 'Revision',
                                                        children: <CDTRevise obtain={x} revise={(result) => {
                                                            api[result.status]({
                                                                message: result.title,
                                                                description: result.message
                                                            });
                                                        }} />,
                                                    },
                                                    {
                                                        key: '3',
                                                        label: 'Transfer',
                                                        children: <CDTTransfer obtain={x} transfer={(result) => {
                                                            api[result.status]({
                                                                message: result.title,
                                                                description: result.message
                                                            });
                                                        }} />,
                                                    },
                                                ]} />)
                                        }
                                    </Card>
                                </Badge.Ribbon>
                            </div>
                        ))
                }
            </div>
        </>
    )
}

export default CDTAssign