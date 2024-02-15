import * as React from 'react'
import {
    Modal, Select, Space, Input, Button, DatePicker, notification,
    Radio, Checkbox, Tooltip, TimePicker
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPreAlert } from '@api/PreAlert';
import { authHolder } from '@hooks/AccountController';
import ConsigneeName from '@components/selection/ConsigneeName';
import PermitType from '@components/selection/PermitType';
import { toUpperText } from '@utils/Converter';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { convertTime, mmddyy } from '@utils/Formats';

function AddPreAlert({ showModal, closeModal }) {

    const getUserToken = authHolder((state) => state.account_details)
    const token = jwtDecode(getUserToken)
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
        typeOfPermit: ['W/O']
    })

    function ClearFields() {
        setData({
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
            typeOfPermit: ['W/O']
        })
        setPermitSelected(1)
        setShowPermit(true)
        setChkAD(false)
        setChkNLI(false)
        setAD('')
        setNLI('')
    }

    function handleChange(e) {
        setData({
            ...getData,
            [e.target.name]: toUpperText(e.target.value)
        })
    }

    const numberOnly = (e) => {
        setData({
            ...getData,
            [e.target.name]: e.target.value.replace(/\D/g, '')
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

    function handlePermit(e) {
        setData({
            ...getData,
            timeOfReceipt: e
        })
    }

    const [showPermit, setShowPermit] = React.useState(true)
    const [getPermitSelected, setPermitSelected] = React.useState(1)
    function onChangePermit(obtain) {
        if (obtain.target.value === 1) {
            setShowPermit(true)
            setData({ ...getData, typeOfPermit: ['W/O'] })
        }
        else {
            setShowPermit(false)
            setData({ ...getData, typeOfPermit: [] })
        }
        setPermitSelected(obtain.target.value)
    }

    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }

    const [chkAD, setChkAD] = React.useState(false)
    function onClickChkAD() {
        setChkAD(!chkAD)
    }

    const [chkNLI, setChkNLI] = React.useState(false)
    function onClickChkNLI() {
        setChkNLI(!chkNLI)
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

    const queryClient = useQueryClient()
    const addCSReportMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                typeOfShipment: getData.typeOfShipment,
                typeOfDeclaration: getData.typeOfDeclaration,
                nameOfCS: token.lastName + ' ' + token.firstName,
                consigneeName: getData.consigneeName,
                typeOfAccount: getData.typeOfAccount,
                hbl_awbl: getData.hbl_awbl,
                arrivalDate: getAD,
                numOfLineItems: getNLI,
                dateOfReceipt: getData.dateOfReceipt,
                timeOfReceipt: getData.timeOfReceipt,
                proNum: getData.proNum,
                oldPro: getData.oldPro,
                remarks: getData.remarks,
                typeOfPermit: getData.typeOfPermit.sort().join(),
                fileKey: uuidv4(),
                userKey: token.userKey
            }

            const response = await addPreAlert(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') { ClearFields() }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['PreAlertList'] }, { exact: true })
        }
    })

    function handleSubmit(e) {
        e.preventDefault()
        if (chkAD === false) {
            setAD(mmddyy(getData.arrivalDate))
        } else { setAD('N/A') }
        if (chkNLI === false) { setNLI(getData.numOfLineItems) } else { setAD('N/A') }
        addCSReportMutation.mutate('New_CSReport')
    }

    return (
        <Modal
            title={'Add New Pre Alert'}
            open={showModal}
            onCancel={closeModal}
            width={520}
            maskClosable={false}
            footer={false}
        >
            <div className="container overflow-y-auto h-[400px]">
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
                                style={{ width: '50%' }}
                            />
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
                                style={{ width: '50%' }}
                            />
                            <Input
                                name='hbl_awbl'
                                value={getData.hbl_awbl}
                                onChange={handleChange}
                                allowClear
                                placeholder='HBL / AWBL'
                                autoComplete='off'
                                style={{ width: '50%' }}
                            />
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
                                value={isDateTimeValid(getData.arrivalDate) === false
                                    ? undefined : getData.arrivalDate}
                                placeholder='Arrival Date'
                                format={'MM-DD-YYYY'}
                                style={{ width: '47%' }}
                                disabled={chkAD}
                            />
                            <Tooltip placement='top' title={<span>Check if Number of Line Items is N/A</span>}
                                arrow={true}>
                                <Checkbox checked={chkNLI} onClick={onClickChkNLI} className='px-2' />
                            </Tooltip>
                            <Input
                                name='numOfLineItems'
                                value={getData.numOfLineItems}
                                onChange={numberOnly}
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
                                    ? undefined : getData.dateOfReceipt}
                                onChange={onDateChangeReceipt}
                                placeholder='Date of Receipt'
                                format={'MM-DD-YYYY'}
                                style={{ width: '100%' }}
                            />
                            <TimePicker style={{ width: '100%' }}
                                value={isDateTimeValid(getData?.timeOfReceipt) === false
                                    ? undefined : getData?.timeOfReceipt} onChange={onTimeChangeReceipt}
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
                                autoComplete='off'
                            />
                            <Input
                                name='oldPro'
                                value={getData.oldPro}
                                onChange={handleChange}
                                allowClear
                                placeholder='Old Pro'
                                autoComplete='off'
                            />
                        </Space.Compact>
                    </div>
                    <div className='form-group mt-2'>
                        <Input.TextArea
                            name='remarks'
                            value={getData.remarks}
                            onChange={handleChange}
                            allowClear
                            placeholder='Remarks'
                            autoComplete='off'
                            autoSize={{
                                maxRows: 5,
                            }}
                        />
                    </div>
                    <div className='form-group mt-2'>
                        <Space.Compact block>
                            <div className='mt-2 pb-2'>
                                <Radio.Group onChange={onChangePermit} defaultValue={1}
                                    value={getPermitSelected}>
                                    <Radio value={1}>W/O Permit</Radio>
                                    <Radio value={2}>With Permit</Radio>
                                </Radio.Group>
                            </div>
                        </Space.Compact>
                    </div>
                    {
                        <div className='form-group mt-2'>
                            <PermitType handler={handlePermit} show={showPermit}
                                data={getData.typeOfPermit || undefined} />
                        </div>
                    }
                    <div className='mt-2 pb-3'>
                        <Space.Compact block>
                            <Button className='bg-[#1677ff] w-full' type="primary" onClick={handleSubmit}
                                disabled={!getData.typeOfShipment || !getData.typeOfDeclaration ||
                                    !getData.consigneeName || !getData.typeOfAccount || !getData.hbl_awbl ||
                                    chkNLI === false && !getData.numOfLineItems || chkNLI === false &&
                                    getData.numOfLineItems === '0' || !getData.proNum || !getData.oldPro ||
                                    !getData.remarks || showPermit === false &&
                                    getData.typeOfPermit?.length === 0}
                                block>
                                Submit
                            </Button>
                            <Button className='bg-[#dc2626] w-full' onClick={ClearFields}
                                type='primary'>Clear</Button>
                        </Space.Compact>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AddPreAlert