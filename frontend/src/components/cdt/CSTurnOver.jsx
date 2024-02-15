import * as React from 'react'
import { Divider, Typography, Input, Space, Button, notification, Empty } from 'antd'
import { getTurnOverToDeclarantDetails, turnOverToDeclarant } from '@api/PreAlert'
import { useQuery, useMutation } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';
import { convertTime } from '@utils/Formats';
function CSTurnOver({ obtain, token, selected }) {

    const [api, contextHolder] = notification.useNotification();
    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const TurnOverToDeclarantDetailsQuery = useQuery({
        queryKey: ['TurnOverToDeclarantDetails'],
        queryFn: async () => {
            const result = await getTurnOverToDeclarantDetails(obtain.refNum)
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

    const submitTurnOverToDeclaranttMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                userKey: token.userKey,
                refNum: obtain.refNum
            }
            const response = await turnOverToDeclarant(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') { TurnOverToDeclarantDetailsQuery.refetch() }
        },
    })

    function handleSubmit(e) {
        e.preventDefault()
        submitTurnOverToDeclaranttMutation.mutate('Submit_TurnOver_To_Declarant')
    }

    function displayTO(a, b) {
        return TurnOverToDeclarantDetailsQuery.data?.length === 0
            ? a === b && selected === 'Pre Alert'
                ? (<Space.Compact block className='mt-2'>
                    <Input placeholder='Date of Turn over' readOnly />
                    <Input placeholder='Time of Turn over' readOnly />
                    <Button className='bg-[#1677ff]' type='primary'
                        onClick={handleSubmit}>Submit Turn over</Button>
                </Space.Compact>)
                : (<Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />)
            : (<>
                {
                    TurnOverToDeclarantDetailsQuery.data?.map((x) => (
                        <Space.Compact block className='mt-2'>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Turn Over Date</Typography.Title>
                                <Input value={x.dateOfTurnOver} />
                            </div>
                            <div className='w-2/4'>
                                <Typography.Title level={5}>Turn Over Time</Typography.Title>
                                <Input value={convertTime(x.timeOfTurnOver)} />
                            </div>
                        </Space.Compact>
                    ))
                }
            </>)
    }

    return (
        <div className='mx-2'>
            {contextHolder}
            <Divider orientation='left'>Turn Over to Declarant for CDT</Divider>
            {
                displayTO(obtain.userKey, token.userKey)
            }
        </div>
    )
}

export default CSTurnOver