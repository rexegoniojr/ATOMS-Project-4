import * as React from 'react'
import { Divider, Typography, Input, Space, Badge, Card } from 'antd'
import { useQuery } from '@tanstack/react-query';
import { getPRESADData } from '@api/PRESAD';
import { viewData } from '@hooks/ModalController';
import { convertTime } from '@utils/Formats';
import { UserOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import PeerCheckerDisplay from './peer-checker/PeerCheckerDisplay';
function PRESADDisplay({ obtain, selected, control, PCList }) {

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

    return (
        <>
            <Divider orientation='left'>PRESAD Details</Divider>
            <Space.Compact block>
                <div className='w-2/4'>
                    <Typography.Title level={5}>PRESAD Date</Typography.Title>
                    <Input value={PRESADDetailsQuery.data?.PRESADDate} readOnly />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>PRESAD Time</Typography.Title>
                    <Input value={convertTime(PRESADDetailsQuery.data?.PRESADTime)} readOnly />
                </div>
            </Space.Compact>
            <div hidden={PRESADDetailsQuery.data?.PRESADDate !== undefined ? false : true}>
                <Divider orientation='left'> Peer Checker Details</Divider>
            </div>
            {
                PRESADDetailsQuery.data?.PRESADDate !== undefined
                    ? PCList?.lenght === 0 || PCList?.pcStatus === undefined
                        ? (<div className='h-[380px] flex flex-col justify-center items-center select-none'
                            key={uuidv4()}>
                            <div className='flex justify-center content-center'>
                                <UserOutlined style={{ fontSize: '50px' }} />
                            </div>
                            <div className='flex justify-center text-xl font-semibold pt-2'>
                                <span>No Peer Checker is Assigned</span>
                            </div>
                        </div>)
                        : (
                            <Badge.Ribbon color={PCList.pcStatus === 'Assigned'
                                ? 'blue'
                                : PCList.pcStatus === 'Transfered'
                                    ? 'volcano'
                                    : PCList.pcStatus === 'Pending'
                                        ? 'purple'
                                        : 'green'} text={PCList.pcStatus}>
                                <Card>
                                    <PeerCheckerDisplay obtain={PCList} control={control} selected={selected} />
                                </Card>
                            </Badge.Ribbon>)
                    : (<></>)
            }
        </>
    )
}

export default PRESADDisplay