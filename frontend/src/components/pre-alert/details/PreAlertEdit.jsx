import * as React from 'react'
import {
    Select, Space, Input, Button, DatePicker, notification, Checkbox, Tooltip, ConfigProvider, TimePicker
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { getPreAlertDetails, updatePreAlert } from '@api/PreAlert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ConsigneeName from '@components/selection/ConsigneeName';
import { toUpperText } from '@utils/Converter';
import { convertTime, mmddyy } from '@utils/Formats';
import { viewData } from '@hooks/ModalController';

function PreAlertEdit({ obtain, token }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)

    const [api, contextHolder] = notification.useNotification();
    const [getData, setData] = React.useState({
        typeOfShipment: '',
        typeOfDeclaration: '',
        consigneeName: '',
        typeOfAccount: '',
        hbl_awbl: '',
        arrivalDate: '',
        numOfLineItems: '',
        dateOfReceipt: '',
        timeOfReceipt: '',
        proNum: '',
        oldPro: '',
        remarks: '',
    })

    const [getDate, setDate] = React.useState(dayjs())
    const [getNumLine, setNumLine] = React.useState('')

    const queryClient = useQueryClient()
    const PreAlertDetailsQuery = useQuery({
        queryKey: ['PreAlertDetails'],
        queryFn: async () => {
            const result = await getPreAlertDetails(obtain.refNum)

            if (result[0]?.arrivalDate === 'N/A') {
                setChkAD(true)
                setDate(undefined)
            }
            if (result[0]?.arrivalDate !== 'N/A') {
                setChkAD(false)
                setDate(dayjs(mmddyy(result[0]?.arrivalDate), 'MM-DD-YYYY'))
            }

            if (result[0]?.numOfLineItems === 'N/A') {
                setChkNLI(true)
                setNumLine('')
            }
            else {
                setChkNLI(false)
                setNumLine(result[0]?.numOfLineItems)
            }

            setData({
                ...getData,
                typeOfShipment: result[0]?.typeOfShipment,
                typeOfDeclaration: result[0]?.typeOfDeclaration,
                consigneeName: result[0]?.consigneeName,
                typeOfAccount: result[0]?.typeOfAccount,
                hbl_awbl: result[0]?.hbl_awbl,
                dateOfReceipt: result[0]?.dateOfReceipt,
                timeOfReceipt: result[0]?.timeOfReceipt,
                proNum: result[0]?.proNum,
                oldPro: result[0]?.oldPro,
                remarks: result[0]?.remarks,
            })
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

    function handleChange(e) {
        setData({
            ...getData,
            [e.target.name]: toUpperText(e.target.value)
        })
    }

    function handleTypeOfShipment(e) {
        setData({
            ...getData,
            typeOfShipment: e
        })
    }

    function handleTypeOfDeclaration(e) {
        setData({
            ...getData,
            typeOfDeclaration: e
        })
    }

    function handleConsignee(e) {
        setData({
            ...getData,
            consigneeName: e
        })
    }

    function handleTypeOfAccount(e) {
        setData({
            ...getData,
            typeOfAccount: e
        })
    }

    const [chkAD, setChkAD] = React.useState(false)
    function onClickChkAD() {
        setChkAD(!chkAD)
    }

    const [chkNLI, setChkNLI] = React.useState(false)
    function onClickChkNLI() {
        setChkNLI(!chkNLI)
    }

    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }

    function onDateChangeArrival(date, dateString) {
        setData({
            ...getData,
            arrivalDate: dayjs(dateString, 'MM-DD-YYYY')
        })
    }

    function onDateChangeReceipt(date, dateString) {
        setData({
            ...getData,
            dateOfReceipt: dayjs(dateString, 'MM-DD-YYYY')
        })
    }

    function onTimeChangeReceipt(time, timeString) {
        setData({
            ...getData,
            timeOfReceipt: dayjs(timeString, 'h:mm A')
        })
    };

    const [getAD, setAD] = React.useState('N/A')
    const [getNLI, setNLI] = React.useState('N/A')
    const updatePreAlertMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                typeOfShipment: getData.typeOfShipment,
                typeOfDeclaration: getData.typeOfDeclaration,
                consigneeName: getData.consigneeName,
                typeOfAccount: getData.typeOfAccount,
                hbl_awbl: getData.hbl_awbl,
                arrivalDate: getAD,
                numOfLineItems: getNLI,
                ateOfReceipt: getData.dateOfReceipt,
                timeOfReceipt: getData.timeOfReceipt,
                proNum: getData.proNum,
                oldPro: getData.oldPro,
                remarks: getData.remarks,
                refNum: obtain.refNum
            }
            const response = await updatePreAlert(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['PreAlertList'] }, { exact: true })
        }
    })
    function handleUpdate(e) {
        e.preventDefault()
        if (chkAD === false) {
            setAD(getData.arrivalDate)
        } else { setAD('N/A') }
        if (chkNLI === false) { setNLI(getNumLine) } else { setAD('N/A') }
        updatePreAlertMutation.mutate('Update_PreAlert')
    }

    return (
        <>
            {contextHolder}
            <div className='container px-2 pt-2'>
                <div className='mt-2'>
                    <Space.Compact block>
                        <Select
                            name='typeOfShipment'
                            onChange={handleTypeOfShipment}
                            allowClear
                            value={getData.typeOfShipment || undefined}
                            placeholder='Type of Shipment'
                            options={[
                                {
                                    value: 'AIR',
                                    label: 'AIR',
                                },
                                {
                                    value: 'SEA',
                                    label: 'SEA',
                                },
                            ]}
                            style={{ width: '50%' }} />
                        <Select
                            name='typeOfDeclaration'
                            onChange={handleTypeOfDeclaration}
                            allowClear
                            value={getData.typeOfDeclaration || undefined}
                            placeholder='Declaration Type'
                            options={[
                                {
                                    value: 'SGL',
                                    label: 'SGL',
                                },
                                {
                                    value: 'REGULAR',
                                    label: 'REGULAR',
                                },
                                {
                                    value: 'INFORMAL',
                                    label: 'INFORMAL',
                                },
                            ]}
                            style={{ width: '50%' }} />
                    </Space.Compact>
                </div>
                <div className='mt-2'>
                    <ConsigneeName data={getData.consigneeName || undefined}
                        handler={handleConsignee} />
                </div>
                <div className='form-group mt-2'>
                    <Space.Compact block>
                        <Select
                            name='typeOfAccount'
                            onChange={handleTypeOfAccount}
                            allowClear
                            value={getData.typeOfAccount || undefined}
                            placeholder='Account Type'
                            options={[
                                {
                                    value: 'BOLLORE',
                                    label: 'BOLLORE',
                                },
                                {
                                    value: 'MAERSK',
                                    label: 'MAERSK',
                                },
                                {
                                    value: 'KUEHNE',
                                    label: 'KUEHNE',
                                },
                            ]}
                            style={{ width: '50%' }} />
                        <Input
                            name='hbl_awbl'
                            value={getData.hbl_awbl}
                            onChange={handleChange}
                            allowClear
                            placeholder='HBL / AWBL'
                            autoComplete='off'
                            style={{ width: '50%' }} />
                    </Space.Compact>
                </div>
                <div className='form-group mt-2'>
                    <Space.Compact block>
                        <Tooltip placement='top' title={<span>Check if Arrival Date is N/A</span>}
                            arrow={true}>
                            <Checkbox checked={chkAD} onClick={onClickChkAD} className='pr-2' />
                        </Tooltip>
                        <DatePicker
                            name='arrivalDate'
                            size='small'
                            onChange={onDateChangeArrival}
                            value={isDateTimeValid(getDate) === false
                                ? undefined : dayjs(mmddyy(getDate), 'MM-DD-YYYY')}
                            placeholder='Arrival Date'
                            format={'MM-DD-YYYY'}
                            style={{ width: '47%' }}
                            allowClear={false}
                            disabled={chkAD}
                        />
                        <Tooltip placement='top' title={<span>Check if Number of Line Items is N/A</span>}
                            arrow={true}>
                            <Checkbox checked={chkNLI} onClick={onClickChkNLI} className='px-2' />
                        </Tooltip>
                        <Input
                            name='numOfLineItems'
                            value={getNumLine}
                            onChange={(e) => { setNumLine(e.target.value.replace(/\D/g, '')) }}
                            allowClear
                            placeholder='Number of Line Items'
                            autoComplete='off'
                            style={{ width: '45%' }}
                            disabled={chkNLI}
                        />
                    </Space.Compact>
                </div>
                <div className='mt-2'>
                    <Space.Compact block>
                        <DatePicker
                            name='dateOfReceipt'
                            value={isDateTimeValid(getData?.dateOfReceipt) === false
                                ? undefined : dayjs(mmddyy(getData.dateOfReceipt), 'MM-DD-YYYY')}
                            onChange={onDateChangeReceipt}
                            placeholder='Date of Receipt'
                            format={'MM-DD-YYYY'}
                            style={{ width: '100%' }}
                        />
                        <TimePicker style={{ width: '100%' }}
                            value={isDateTimeValid(getData?.timeOfReceipt) === false
                                ? undefined : dayjs(
                                    convertTime(new Date(getData?.timeOfReceipt).toTimeString()), 'h:mm A')
                            } onChange={onTimeChangeReceipt}
                            placeholder='Time of Receipt' use12Hours
                            format={'h:mm A'} />
                    </Space.Compact>
                </div>
                <div className='form-group mt-2'>
                    <Space.Compact block>
                        <Input
                            name='proNum'
                            value={getData.proNum}
                            onChange={handleChange}
                            allowClear
                            placeholder='Pro Number'
                            autoComplete='off' />
                        <Input
                            name='oldPro'
                            value={getData.oldPro}
                            onChange={handleChange}
                            allowClear
                            placeholder='Old Pro'
                            autoComplete='off' />
                    </Space.Compact>
                </div>
                <div className='form-group mt-2'>
                    <Input.TextArea
                        name='remarks'
                        value={getData.remarks}
                        onChange={handleChange}
                        allowClear
                        placeholder='Remarks'
                        autoComplete='off' autoSize={{ maxRows: 5, }} />
                </div>
                <div className='mt-2'>
                    <ConfigProvider theme={{
                        token: {
                            colorPrimary: '#166534',
                        },
                    }}>
                        <Button className='float-right bg-[#166534]' type='primary'
                            disabled={!getData.typeOfShipment || !getData.typeOfDeclaration ||
                                !getData.consigneeName || !getData.typeOfAccount || !getData.hbl_awbl ||
                                chkNLI === false && !getNumLine || chkNLI === false &&
                                getNumLine === '0' || !getData.proNum || !getData.oldPro ||
                                !getData.remarks}
                            onClick={handleUpdate}>Update</Button>
                    </ConfigProvider>
                </div>
            </div>
        </>
    )
}

export default PreAlertEdit