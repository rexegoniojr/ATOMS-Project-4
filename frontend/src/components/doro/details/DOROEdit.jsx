import * as React from 'react'
import {
    Divider, Typography, Input, Space, Button, DatePicker, TimePicker,
    Badge, Card, Checkbox, Tooltip, notification
} from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDORO } from '@api/DORO';
import { convertTime, mmddyy } from '@utils/Formats';
import { toUpperText } from '@utils/Converter';
import DORODisplay from './DORODisplay'

function DOROEdit({ list, obtain, token }) {

    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient()
    const [getData, setData] = React.useState({
        ActionOwner: list?.ActionOwner,
        appliedDate: list?.appliedDate,
        appliedTime: list?.appliedTime,
        securedDate: list?.securedDate,
        securedTime: list?.securedTime,
        Remarks: list?.Remarks
    })

    const [getApplied, setApplied] = React.useState(true)
    function onCheckApplied() {
        setApplied(!getApplied)
        setData({
            ...getData,
            appliedDate: '',
            appliedTime: '',
        })
    }

    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }

    function onDateChangeApplied(date, dateString) {
        setData({
            ...getData,
            appliedDate: dayjs(dateString, 'MM-DD-YYYY')
        })
    }

    function onTimeChangeApplied(time, timeString) {
        setData({
            ...getData,
            appliedTime: dayjs(timeString, 'h:mm A')
        })
    };

    const [getSecured, setSecured] = React.useState(true)
    function onCheckSecured() {
        setSecured(!getSecured)
        setData({
            ...getData,
            securedDate: '',
            securedTime: '',
        })
    }

    function onDateChangeSecured(date, dateString) {
        setData({
            ...getData,
            securedDate: dayjs(dateString, 'MM-DD-YYYY')
        })
    }

    function onTimeChangeSecured(time, timeString) {
        setData({
            ...getData,
            securedTime: dayjs(timeString, 'h:mm A')
        })
    };

    function handleRemarks(e) {
        setData({
            ...getData,
            Remarks: toUpperText(e.target.value)
        })
    }

    const submitUpdateMutation = useMutation({
        mutationFn: async (value) => {

            const dataContainer = {
                ActionOwner: token.firstName + ' ' + token.lastName,
                appliedDate: getData.appliedDate,
                appliedTime: getData.appliedTime,
                securedDate: getData.securedDate,
                securedTime: getData.securedTime,
                drStatus: value,
                Remarks: getData.Remarks,
                userKey: token.userKey,
                refNum: obtain.refNum
            }

            const response = await updateDORO(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['DORODetails'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['AvailableDOROList'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['PendingDOROList'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['CompleteDOROList'] }, { exact: true })
            }
        },
    })

    function handleSubmit(e) {
        e.preventDefault()
        let stat = ''
        if (!getData.appliedDate || !getData.appliedTime || !getData.securedDate || !getData.securedTime) {
            stat = 'Pending'
        }
        else { stat = 'Complete' }
        submitUpdateMutation.mutate(stat)
    }

    return (<>
        {contextHolder}
        {
            list?.drStatus === 'Complete'
                ? (<> <DORODisplay list={list} obtain={obtain} /> </>)
                : (<>
                    <Divider orientation='left'>DO/RO Details</Divider>
                    <Badge.Ribbon color={list?.drStatus === 'Complete'
                        ? 'green'
                        : list?.drStatus === 'Pending'
                            ? 'purple'
                            : 'blue'} text={
                                !list?.drStatus
                                    ? 'Available'
                                    : list?.drStatus
                            }>
                        <Card>
                            <Typography.Title level={5}>Action Owner</Typography.Title>
                            <Input value={list?.ActionOwner} readOnly />
                            <Space.Compact hidden={!list?.ActionOwner ? true : false} block>
                                <div className='w-2/4'>
                                    <Typography.Title level={5}>Applied Date</Typography.Title>
                                    {
                                        list?.appliedDate
                                            ? (<Input value={mmddyy(list?.appliedDate)} readOnly />)
                                            : (<>
                                                <DatePicker
                                                    name='fundReceived'
                                                    value={isDateTimeValid(getData?.appliedDate) === false
                                                        ? undefined : getData.appliedDate}
                                                    onChange={onDateChangeApplied}
                                                    placeholder='Select Date'
                                                    format={'MM-DD-YYYY'}
                                                    style={{ width: '100%' }}
                                                    allowClear={false}
                                                    disabled={getApplied}
                                                />
                                            </>)
                                    }
                                </div>
                                <div className='w-2/4'>
                                    <Typography.Title level={5}>Applied Time</Typography.Title>
                                    {
                                        list?.appliedTime
                                            ? (<Input value={convertTime(
                                                new Date(list?.appliedTime).toTimeString())} readOnly />)
                                            : (<Space.Compact block>
                                                <TimePicker disabled={getApplied} style={{ width: '100%' }}
                                                    value={isDateTimeValid(getData?.appliedTime) === false
                                                        ? undefined : getData?.appliedTime} onChange={onTimeChangeApplied}
                                                    placeholder='Select Time' use12Hours
                                                    format={'h:mm A'} allowClear={false} />
                                                <div className='ml-2 my-1'>
                                                    <Tooltip placement='top' title={<span>Uncheck to edit</span>}
                                                        arrow={true}>
                                                        <Checkbox checked={getApplied} onClick={() => { onCheckApplied() }}
                                                            className='pr-2' />
                                                    </Tooltip>
                                                </div>
                                            </Space.Compact>)
                                    }
                                </div>
                            </Space.Compact>
                            <Space.Compact hidden={!list?.appliedDate ? true : false} block>
                                <div className='w-2/4'>
                                    <Typography.Title level={5}>Date Secured</Typography.Title>
                                    {
                                        list?.securedDate
                                            ? (<Input value={mmddyy(list?.securedDate)} readOnly />)
                                            : (<>
                                                <DatePicker
                                                    name='fundReceived'
                                                    value={isDateTimeValid(getData?.securedDate) === false
                                                        ? undefined : getData.securedDate}
                                                    onChange={onDateChangeSecured}
                                                    placeholder='Select Date'
                                                    format={'MM-DD-YYYY'}
                                                    style={{ width: '100%' }}
                                                    allowClear={false}
                                                    disabled={getSecured}
                                                />
                                            </>)
                                    }
                                </div>
                                <div className='w-2/4'>
                                    <Typography.Title level={5}>Time Secured</Typography.Title>
                                    {
                                        list?.securedTime
                                            ? (<Input value={convertTime(
                                                new Date(list?.securedTime).toTimeString())} readOnly />)
                                            : (<Space.Compact block>
                                                <TimePicker disabled={getSecured} style={{ width: '100%' }}
                                                    value={isDateTimeValid(getData?.securedTime) === false
                                                        ? undefined : getData?.securedTime} onChange={onTimeChangeSecured}
                                                    placeholder='Select Time' use12Hours
                                                    format={'h:mm A'} allowClear={false} />
                                                <div className='ml-2 my-1'>
                                                    <Tooltip placement='top' title={<span>Uncheck to edit</span>}
                                                        arrow={true}>
                                                        <Checkbox checked={getSecured} onClick={() => { onCheckSecured() }}
                                                            className='pr-2' />
                                                    </Tooltip>
                                                </div>
                                            </Space.Compact>)
                                    }
                                </div>
                            </Space.Compact>
                            <Typography.Title level={5}>Remarks</Typography.Title>
                            <Input.TextArea value={getData.Remarks} onChange={handleRemarks}
                                autoSize={{ maxRows: 5, }} readOnly={list?.drStatus === 'Complete'
                                    ? true : false} />
                            <div className='float-end mt-2' hidden={list?.drStatus === 'Complete'
                                ? true : false}>
                                <Button type='primary' className='w-[100px] bg-[#1677ff]'
                                    hidden={list?.drStatus === 'Complete'
                                        ? true : false} onClick={handleSubmit}>Submit</Button>
                            </div>
                        </Card>
                    </Badge.Ribbon>
                </>)
        }
    </>)
}

export default DOROEdit