import * as React from 'react'
import {
    Input, Button, Typography, Space,  DatePicker, TimePicker, Checkbox, Tooltip
} from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { submitUpdate } from '@api/FundRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertTime, mmddyy } from '@utils/Formats';
import { toUpperText } from '@utils/Converter';

function RequestLayout({ obtain, submit }) {

    const queryClient = useQueryClient()
    const [getData, setData] = React.useState({
        receivedDate: dayjs(mmddyy(obtain?.receivedDate), 'MM-DD-YYYY'),
        receivedTime: dayjs(obtain?.receivedTime, 'h:mm A'),
        Remarks: obtain?.Remarks
    })

    const [chkReceive, setReceive] = React.useState(true)
    function onClickChkReceive() {
        setReceive(!chkReceive)
        if (chkReceive === false) {
            setData({
                ...getData,
                receivedDate: '',
                receivedTime: '',
            })
        }
    }

    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }

    function onDateChange(date, dateString) {
        setData({
            ...getData,
            receivedDate: dayjs(dateString, 'MM-DD-YYYY')
        })
    }

    function onTimeChange(time, timeString) {
        setData({
            ...getData,
            receivedTime: dayjs(timeString, 'h:mm A')
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
                frKey: obtain?.frKey,
                receivedDate: getData.receivedDate,
                receivedTime: getData.receivedTime,
                Remarks: getData.Remarks
            }

            const response = await submitUpdate(dataContainer)
            submit(response)
            if (response.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['FundRequestDetails'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['AvailableFundRequestList'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['CompleteFundRequestList'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['PendingFundRequestList'] }, { exact: true })
            }
        },
    })

    function handleSubmit(e) {
        e.preventDefault()
        submitUpdateMutation.mutate('SUBMIT UPDATE FUND REQUEST')
    }

    return (
        <>
            <Typography.Title level={5}>Note</Typography.Title>
            <Input.TextArea value={obtain?.frNote} autoSize={{ maxRows: 5, }} readOnly />
            <Space.Compact block>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Request Date</Typography.Title>
                    <Input value={obtain?.requestDate} readOnly />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Request Date</Typography.Title>
                    <Input value={convertTime(obtain?.requestTime)} readOnly />
                </div>
            </Space.Compact>
            <Space.Compact block>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                    <DatePicker
                        name='fundReceived'
                        value={isDateTimeValid(getData?.receivedDate) === false
                            ? undefined : getData.receivedDate}
                        onChange={onDateChange}
                        placeholder='Select Date'
                        format={'MM-DD-YYYY'}
                        style={{ width: '100%' }}
                        allowClear={false}
                        disabled={chkReceive}
                    />
                </div>
                <div className='w-2/4'>
                    <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                    <Space.Compact block>
                        <TimePicker disabled={chkReceive} style={{ width: '100%' }}
                            value={isDateTimeValid(getData?.receivedTime) === false
                                ? undefined : getData.receivedTime} onChange={onTimeChange}
                            placeholder='Select Time' use12Hours
                            format={'h:mm A'} allowClear={false} />
                        <div className='ml-2 my-1'>
                            <Tooltip placement='top' title={<span>Uncheck to edit</span>}
                                arrow={true}>
                                <Checkbox checked={chkReceive} onClick={() => { onClickChkReceive() }}
                                    className='pr-2' />
                            </Tooltip>
                        </div>
                    </Space.Compact>
                </div>
            </Space.Compact>
            <Typography.Title level={5}>Remarks</Typography.Title>
            <Input.TextArea onChange={handleRemarks}
                value={getData.Remarks} name='Remarks' autoSize={{ maxRows: 5, }} />
            <div className='mt-2 float-end' >
                <Button className='bg-[#1677ff]' onClick={handleSubmit}
                    disabled={!getData.Remarks} type='primary'>Submit</Button>
            </div>
        </>
    )
}

export default RequestLayout