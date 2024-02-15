import * as React from 'react'
import { Divider, Typography, Input, Space, Button, Empty, notification } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';
import { getPRESADDetails, submitTurnOverPreSad } from '@api/PRESAD';
import { getPeerCheckerDetails } from '@api/PeerChecker';
import { convertTime } from '@utils/Formats';
import { v4 as uuidv4 } from 'uuid';

import PRESADEdit from './details/PRESADEdit';
import PRESADDisplay from './details/PRESADDisplay';
function ViewPRESAD({ obtain, token, control, selected }) {

    const [api, contextHolder] = notification.useNotification();
    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const ApprovedCDTForTurnOverDetailsQuery = useQuery({
        queryKey: ['ApprovedCDTForTurnOverDetails'],
        queryFn: async () => {
            const result = await getPRESADDetails(obtain.refNum)
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

    const submitPRESADTurnOverMutation = useMutation({
        mutationFn: async (value) => {
            const dataContainer = {
                ActionOwner: value.ActionOwner,
                declarantUserKey: value.declarantUserKey,
                userKey: token.userKey,
                refNum: obtain.refNum
            }
            console.log(dataContainer)
            const response = await submitTurnOverPreSad(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                ApprovedCDTForTurnOverDetailsQuery.refetch()
            }
        },
    })

    function handleTurnOver(value) {
        submitPRESADTurnOverMutation.mutate(value)
    }

    const PeerCheckerDetailsQuery = useQuery({
        queryKey: ['PeerCheckerDetails'],
        queryFn: async () => {
            const result = await getPeerCheckerDetails(obtain.refNum)
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

    function PRESADListDisplay(ctr, sel) {
        if (sel === 'PRESAD') {
            switch (ctr) {
                case 'Edit':
                    return <PRESADEdit obtain={obtain} token={token} selected={selected}
                        PCList={PeerCheckerDetailsQuery?.data} control={control} key='edit' />
                default:
                    return <PRESADDisplay obtain={obtain} selected={selected}
                        PCList={PeerCheckerDetailsQuery?.data} control={control} key='assign' />
            }
        }
        else {
            return <PRESADDisplay obtain={obtain} selected={selected}
                PCList={PeerCheckerDetailsQuery?.data} control={control} key='assign' />
        }
    }

    return (
        <div className='container overflow-y-auto h-[510px]'>
            {contextHolder}
            <div className='mx-2'>
                {
                    selected === 'Pre Alert'
                        ? (<>
                            {
                                ApprovedCDTForTurnOverDetailsQuery.data?.clientApprovalDate &&
                                    !ApprovedCDTForTurnOverDetailsQuery.data?.dateOfTurnOver
                                    ? (<>
                                        <Divider orientation='left'>Turn Over to Declarant for PRESAD</Divider><Space.Compact block>
                                            <div className='w-2/4'>
                                                <Typography.Title level={5}>Turn Over Date</Typography.Title>
                                                <Input value={ApprovedCDTForTurnOverDetailsQuery.data?.dateOfTurnOver}
                                                    readOnly />
                                            </div>
                                            <div className='w-2/4'>
                                                <Typography.Title level={5}>Turn Over Time</Typography.Title>
                                                <Space.Compact block>
                                                    <Input value={
                                                        convertTime(ApprovedCDTForTurnOverDetailsQuery.data?.timeOfTurnOver)
                                                    }
                                                        readOnly />
                                                    <Button type='primary' className='w-[100px] bg-[#1677ff]'
                                                        onClick={() => {
                                                            handleTurnOver(ApprovedCDTForTurnOverDetailsQuery.data)
                                                        }}>Submit</Button>
                                                </Space.Compact>
                                            </div>
                                        </Space.Compact>
                                    </>)
                                    : (<></>)
                            }
                        </>)
                        : (<></>)
                }
                {
                    ApprovedCDTForTurnOverDetailsQuery.data?.dateOfTurnOver
                        ? PRESADListDisplay(control, selected)
                        : (<div className='h-[380px] flex flex-col justify-center items-center select-none'
                            key={uuidv4()}>
                            <div className='flex justify-center content-center'>
                                <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                            </div>
                        </div>)
                }
            </div>
        </div>
    )
}

export default ViewPRESAD