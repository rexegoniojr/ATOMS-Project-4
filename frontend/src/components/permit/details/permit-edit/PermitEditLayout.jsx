import * as React from 'react'
import {
    Button, Input, DatePicker, Space, Card, Badge, Typography, Tooltip, Checkbox
} from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePermit } from '@api/Permit';
import { toUpperText } from '@utils/Converter';
import { mmddyy } from '@utils/Formats';

function PermitEditLayout({ data, DAP, DSP, updateResult }) {

    const [getData, setData] = React.useState({
        dateOfAppPermit: dayjs(mmddyy(DAP), 'MM-DD-YYYY'),
        dateSecPermit: dayjs(mmddyy(DSP), 'MM-DD-YYYY'),
        permitRemarks: data.permitRemarks,
        permitKey: data.permitKey,
    })

    function onSelectDAP(date, dateString) {
        setData({
            ...getData,
            dateOfAppPermit: dayjs(dateString, 'MM-DD-YYYY')
        })
    }

    function onSelectDSP(date, dateString) {
        setData({
            ...getData,
            dateSecPermit: dayjs(dateString, 'MM-DD-YYYY')
        })
    }

    function handleChange(e) {
        setData({
            ...getData,
            permitRemarks: toUpperText(e.target.value)
        })
    }

    const [chkDAP, setDAP] = React.useState(true)
    function onClickChkDAP() {
        setDAP(!chkDAP)
    }

    const [chkDSP, setDSP] = React.useState(true)
    function onClickChkDSP() {
        setDSP(!chkDSP)
    }

    const queryClient = useQueryClient()
    const updatePermitMutation = useMutation({
        mutationFn: async () => {

            const dataContainer = {
                dateOfAppPermit: mmddyy(getData.dateOfAppPermit),
                dateSecPermit: mmddyy(getData.dateSecPermit),
                permitRemarks: getData.permitRemarks,
                permitKey: getData.permitKey
            }
            const response = await updatePermit(dataContainer)
            updateResult(response)
            if (response.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['PermitDetails'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['AssignedPermitDetailsEmployee'] },
                    { exact: true })
            }
        },
    })

    function handleSubmit(e) {
        e.preventDefault()
        updatePermitMutation.mutate('PermitUpdateMutation')
    }

    return (
        <Badge.Ribbon color={data.permitStatus === 'Assigned'
            ? 'geekblue'
            : data.permitStatus === 'Transfered'
                ? 'volcano'
                : data.permitStatus === 'Pending'
                    ? 'blue'
                    : 'green'} text={data.permitStatus}>
            <Card title={data.typeOfPermit}>
                <Typography.Title level={5}>Date of Application of Permit</Typography.Title>
                {
                    data.permitStatus === 'Complete'
                        ? (<Input value={data.dateOfAppPermit} readOnly />)
                        : (<Space.Compact block>
                            <Tooltip placement='top' title={<span>Uncheck to change date</span>}
                                arrow={true}>
                                <Checkbox checked={chkDAP} onClick={onClickChkDAP} className='pr-2' />
                            </Tooltip>
                            <DatePicker
                                name='dateOfAppPermit'
                                size='large'
                                onChange={onSelectDAP}
                                value={getData.dateOfAppPermit}
                                placeholder='Arrival Date'
                                format={'MM-DD-YYYY'}
                                style={{ width: '100%' }}
                                allowClear={false}
                                disabled={chkDAP}
                            />
                        </Space.Compact>)
                }

                <Typography.Title level={5}>Date of Secured Permit</Typography.Title>
                {
                    data.permitStatus === 'Complete'
                        ? (<Input value={data.dateSecPermit} readOnly />)
                        : (<Space.Compact block>
                            <Tooltip placement='top' title={<span>Uncheck to change date</span>}
                                arrow={true}>
                                <Checkbox checked={chkDSP} onClick={onClickChkDSP} className='pr-2' />
                            </Tooltip>
                            <DatePicker
                                name='dateSecPermit'
                                size='large'
                                onChange={onSelectDSP}
                                value={getData.dateSecPermit}
                                placeholder='Arrival Date'
                                format={'MM-DD-YYYY'}
                                style={{ width: '100%' }}
                                allowClear={false}
                                disabled={chkDSP}
                            />
                        </Space.Compact>)
                }

                <Space.Compact block>
                    <div className='w-2/4'>
                        <Typography.Title level={5}>Submission Date</Typography.Title>
                        <Input value={data.submitDate} readOnly />
                    </div>
                    <div className='w-2/4'>
                        <Typography.Title level={5}>Submission Date</Typography.Title>
                        <Input value={data.submitTime} readOnly />
                    </div>
                </Space.Compact>
                <Typography.Title level={5}>Remarks</Typography.Title>
                <Input.TextArea name='permitRemarks' onChange={handleChange}
                    value={getData.permitRemarks} autoSize={{ maxRows: 5, }}
                    readOnly={data.permitStatus === 'Complete'
                        ? true : false} />
                <Button type='primary' className='w-[100px] float-end bg-[#1677ff] mt-2'
                    disabled={!getData.permitRemarks}
                    hidden={data.permitStatus === 'Complete' ? true : false}
                    onClick={handleSubmit}>Submit</Button>
            </Card>
        </Badge.Ribbon>
    )
}

export default PermitEditLayout