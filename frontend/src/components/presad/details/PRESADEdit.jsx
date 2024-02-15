import * as React from 'react'
import { Divider, Typography, Input, Space, Button, notification } from 'antd'
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPRESADData, submitPRESAD } from '@api/PRESAD';
import { viewData } from '@hooks/ModalController';
import { convertTime } from '@utils/Formats';

import PeerCheckerAssign from './peer-checker/PeerCheckerAssign';
import PeerCheckerDisplay from './peer-checker/PeerCheckerDisplay';
function PRESADEdit({ obtain, token, control, selected, PCList }) {

    const [api, contextHolder] = notification.useNotification();
    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const PRESADDetailsQuery = useQuery({
        queryKey: ['PRESADDetails'],
        queryFn: async () => {
            const result = await getPRESADData(obtain.refNum)
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

    const submitPreSadMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                ActionOwner: token.firstName + ' ' + token.lastName,
                userKey: token.userKey,
                refNum: obtain.refNum
            }

            const response = await submitPRESAD(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                PRESADDetailsQuery.refetch()
            }
        },
    })

    function handleSubmit(e) {
        e.preventDefault()
        submitPreSadMutation.mutate('SUBMIT PRESAD')
    }

    function PeerChecker(sel) {
        switch (sel) {
            case 'PRESAD':
                return <PeerCheckerAssign obtain={PCList} selected={selected} control={control}
                    refNum={obtain.refNum} token={token} key='edit' />
            default:
                return (<>
                    <Divider orientation='left' > Peer Checker Details</Divider>
                    <PeerCheckerDisplay obtain={PCList} selected={selected}
                        control={control} key='display' />
                </>)
        }
    }

    return (
        <>
            {contextHolder}
            <Divider orientation='left'>PRESAD Details</Divider>
            <Space.Compact block>
                <div className='w-2/4'>
                    <Typography.Title level={5}>PRESAD Date</Typography.Title>
                    <Input value={PRESADDetailsQuery.data?.PRESADDate} readOnly />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>PRESAD Time</Typography.Title>
                    <Space.Compact block>
                        <Input value={convertTime(PRESADDetailsQuery.data?.PRESADTime)} readOnly />
                        <Button type='primary' className='w-[100px] bg-[#1677ff]'
                            disabled={PRESADDetailsQuery.data?.refNum === obtain.refNum ? true : false}
                            hidden={PRESADDetailsQuery.data?.refNum === obtain.refNum ? true : false}
                            onClick={handleSubmit}>Submit</Button>
                    </Space.Compact>
                </div>
            </Space.Compact>
            {
                PRESADDetailsQuery.data?.PRESADDate
                    ? (<> {PeerChecker(selected)}  </>)
                    : (<></>)
            }
        </>
    )
}

export default PRESADEdit