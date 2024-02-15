import * as React from 'react'
import {
    Modal, Select, Space, Input, Button, notification,
    Switch, ConfigProvider, Divider
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LockOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { viewAccount } from '@hooks/ModalController';
import { getAccountDetails, updateUserInformation, updateUserPassword } from '@api/Accounts';

function ViewAccountDetails({ showModal, closeModal }) {

    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification()
    const [getData, setData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        acc_type: '',
        acc_access: [],
        idn: '',
        acc_status: '',
        status: ''
    })

    const [getPassword, setPassword] = React.useState({
        password: '',
        passwordCheck: ''
    })

    const getUserKey = viewAccount((state) => state.userKey)
    const getStatus = viewAccount((state) => state.modalStatus)
    const [isOnline, setOnline] = React.useState(false)
    const [isEdit, setEdit] = React.useState(true)
    const [isChangePassword, setChangePassword] = React.useState(true)
    const AccountDetailsQuery = useQuery({
        queryKey: ['ViewAccountDetails'],
        queryFn: async () => {
            const result = await getAccountDetails(getUserKey)
            setData({
                firstName: result[0]?.firstName,
                lastName: result[0]?.lastName,
                email: result[0]?.email,
                acc_type: result[0]?.acc_type,
                acc_access: result[0]?.acc_access.split(','),
                idn: result[0]?.idn,
                acc_status: result[0]?.acc_status,
                status: result[0]?.status,
            })
            if (result[0]?.status === 'Online') { setOnline(true) }
            else { setOnline(false) }
            setEdit(true)
            setChangePassword(true)
            return result
        },
        enabled: getStatus,
        retryDelay: 1000,
    })

    const acc_type = ['ADMINISTRATOR', 'SUPER ADMIN', 'MANAGER',
        'SUPERVISOR', 'CS1', 'CS2', 'DECLARANT', 'SUPPORT']

    const acc_access = ['Pre Alert', 'Assign Permit', 'Assign Declarant',
        'CDT', 'PRESAD', 'Peer Checker', 'Lodgement', 'Portal', 'Fund Request', 'DO-RO Processing',
        'Re-Entry', 'Register Account', 'Complete List', 'Permit']

    function handleEdit() {
        setEdit(!isEdit)
        if (!isEdit) {
            AccountDetailsQuery.refetch()
        }
    }

    function handlePassword() {
        setChangePassword(!isChangePassword)
        if (!isChangePassword) {
            setPassword({
                password: '',
                passwordCheck: ''
            })
        }
    }

    let hasMinPass = getPassword.password.length >= 8
    let hasLowerChar = /(.*[a-z].*)/.test(getPassword.password)
    let hasUpperChar = /(.*[A-Z].*)/.test(getPassword.password)
    let hasNumberChar = /(.*[0-9].*)/.test(getPassword.password)
    let hasSpecialChar = /(.*[^a-zA-Z0-9].*)/.test(getPassword.password)

    let dispNumSym;
    if (hasNumberChar === true &&
        hasSpecialChar === true) {
        dispNumSym = <small className='text-green-400'>
            <CheckOutlined /> include at least one number and symbol. </small>
    } else {
        dispNumSym = <small className='text-rose-500'>
            <CloseOutlined /> include at least one number and symbol. </small>
    }

    let dispUpLow;
    if (hasUpperChar === true &&
        hasLowerChar == true) {
        dispUpLow = <small className='text-green-400'>
            <CheckOutlined /> include both lower and upper case character. </small>
    } else {
        dispUpLow = <small className='text-rose-500'>
            <CloseOutlined /> include both lower and upper case character. </small>
    }

    function handleChange(e) {
        setData({ ...getData, [e.target.name]: e.target.value })
    }

    const textUpperCase = (e) => {
        setData({ ...getData, [e.target.name]: e.target.value.toUpperCase() })
    }

    const numberOnly = (e) => {
        setData({ ...getData, [e.target.name]: e.target.value.replace(/\D/g, '') })
    }

    function handleSelectAccoutType(value) {
        setData({ ...getData, acc_type: value })
    }

    function handleSelectAccoutAccess(value) {
        setData({ ...getData, acc_access: value })
    }

    function handleSelectAccountStatus(value) {
        setData({ ...getData, acc_status: value })
    }

    function handleChangePassword(e) {
        setPassword({ ...getPassword, [e.target.name]: e.target.value })
    }

    function handleStatus(e) {
        setOnline(e)
        if (e === true) { setData({ ...getData, status: 'Online' }) }
        else { setData({ ...getData, status: 'Offline' }) }
    }

    const UpdateUserInformationMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                firstName: getData.firstName,
                lastName: getData.lastName,
                email: getData.email,
                acc_type: getData.acc_type,
                acc_access: getData.acc_access.sort().join(),
                acc_status: getData.acc_status,
                status: getData.status,
                userKey: getUserKey,
            }
            const response = await updateUserInformation(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });
        },
        onSuccess: () => {
            AccountDetailsQuery.refetch()
            queryClient.invalidateQueries({ queryKey: ['AccountList'] }, { exact: true })
        }
    })

    function handleUpdateUserInformation(e) {
        e.preventDefault()
        UpdateUserInformationMutation.mutate('Update_Information')
    }

    const UpdateUserPasswordMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                password: getPassword.password,
                userKey: getUserKey,
            }
            const response = await updateUserPassword(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });
        },
        onSuccess: () => {
            handlePassword()
        }
    })
    function handleUpdateUserPassword(e) {
        e.preventDefault()
        UpdateUserPasswordMutation.mutate('Update_Password')
    }

    return (
        <Modal
            title={'Account Details'}
            open={showModal}
            onCancel={closeModal}
            width={500}
            maskClosable={false}
            footer={false}
        >
            {contextHolder}
            <div className="container overflow-y-auto h-[235px]">
                <div className='float-right mx-2 pt-[2px] pb-2'>
                    <Switch checkedChildren="Online" unCheckedChildren="Offline"
                        onClick={handleStatus}
                        checked={isOnline} disabled={isEdit} />
                </div>
                <div className='mt-2 mx-2'>
                    <Space.Compact block>
                        <Input
                            name='firstName'
                            allowClear
                            placeholder='First Name'
                            autoComplete='off'
                            readOnly={isEdit}
                            value={getData.firstName}
                            onChange={textUpperCase}
                        />
                        <Input
                            name='lastName'
                            allowClear
                            placeholder='Last Name'
                            autoComplete='off'
                            readOnly={isEdit}
                            value={getData.lastName}
                            onChange={textUpperCase}
                        />
                    </Space.Compact>
                </div>
                <div className='mt-2 mx-2'>
                    <Space.Compact block>
                        <Input
                            name='email'
                            allowClear
                            placeholder='Email'
                            autoComplete='off'
                            readOnly={isEdit}
                            value={getData.email}
                            onChange={handleChange}
                        />
                        <Input
                            name='idn'
                            allowClear
                            placeholder='ID Number'
                            autoComplete='off'
                            readOnly={isEdit}
                            value={getData.idn}
                            onChange={numberOnly}
                        />
                    </Space.Compact>
                </div>
                <div className='mt-2 mx-2'>
                    <Select
                        name='acc_type'
                        allowClear
                        showSearch
                        placeholder='Account Type'
                        style={{ width: '100%' }}
                        options={acc_type.map((x) => ({
                            label: x,
                            value: x,
                        }))}
                        disabled={isEdit}
                        value={getData.acc_type || undefined}
                        onChange={handleSelectAccoutType}
                    />
                </div>
                <div className='mt-2 mx-2'>
                    <Select
                        name='account_access'
                        mode='multiple'
                        allowClear
                        showSearch
                        placeholder='Account Access'
                        options={acc_access.sort().map((x) => ({
                            label: x,
                            value: x,
                        }))}
                        style={{ width: '100%' }}
                        disabled={isEdit}
                        value={getData.acc_access || undefined}
                        onChange={handleSelectAccoutAccess}
                    />
                </div>
                <div className='mt-2 mx-2 flex flex-row'>
                    {
                        getData.acc_type === 'ADMINISTRATOR'
                            ? (<></>)
                            : (<Select
                                name='account_status'
                                allowClear={false}
                                placeholder='Account Status'
                                options={[
                                    {
                                        value: 'Activate',
                                        label: 'Activate',
                                    },
                                    {
                                        value: 'Deactivate',
                                        label: 'Deactivate',
                                    },
                                ]}
                                style={{ width: '32%' }}
                                disabled={isEdit}
                                value={getData.acc_status || undefined}
                                onChange={handleSelectAccountStatus}
                            />)
                    }
                    <Button type='link' onClick={handleEdit}>
                        {isEdit ? 'Edit Profile' : 'Cancel Edit'}
                    </Button>
                    <Button type='link' onClick={handlePassword}>
                        {isChangePassword ? 'Change Password' : 'Cancel'}
                    </Button>
                    <div className='ml-auto' hidden={isEdit}>
                        <ConfigProvider theme={{
                            token: {
                                colorPrimary: '#166534',
                            },
                        }}>
                            <Button className='float-right bg-[#166534]' type='primary'
                                onClick={handleUpdateUserInformation} hidden={isEdit}> Save</Button>
                        </ConfigProvider>
                    </div>
                </div>
                <div className='mt-2 mx-2' hidden={isChangePassword}>
                    <Divider>Change Password</Divider>
                    <div className='mt-2'>
                        <Input
                            name='password'
                            allowClear
                            value={getPassword.password}
                            onChange={handleChangePassword}
                            placeholder='New Password'
                            autoComplete='off'
                            status={
                                getPassword.password === getPassword.passwordCheck
                                    ? ''
                                    : 'error'
                            }
                        />
                    </div>
                    <div className='mt-2'>
                        <Space.Compact block>
                            <Input
                                name='passwordCheck'
                                allowClear
                                value={getPassword.passwordCheck}
                                onChange={handleChangePassword}
                                placeholder='Confirm Password'
                                autoComplete='off'
                                status={
                                    getPassword.password === getPassword.passwordCheck
                                        ? ''
                                        : 'error'
                                }
                            />
                            <ConfigProvider theme={{
                                token: {
                                    colorPrimary: '#166534',
                                },
                            }}>
                                <Button className='float-right bg-[#166534]' type='primary'
                                    disabled={!getPassword.password || !getPassword.passwordCheck ||
                                        getPassword.password !== getPassword.passwordCheck || !hasUpperChar ||
                                        !hasLowerChar || !hasMinPass || !hasNumberChar || !hasSpecialChar
                                    } onClick={handleUpdateUserPassword}> Change Password</Button>
                            </ConfigProvider>
                        </Space.Compact>
                    </div>
                    <div className='mt-2'>
                        {
                            getData.password && (
                                <>
                                    <small>
                                        <LockOutlined /> Your password needs to:
                                    </small>
                                    <div className='container ml-1' style={{ marginLeft: '2%' }}>
                                        <div>
                                            {dispUpLow}
                                        </div>
                                        <div>
                                            {dispNumSym}
                                        </div>
                                        <div>
                                            {hasMinPass ?
                                                <small className='text-green-400'>
                                                    <CheckOutlined /> be at least 8 character long.
                                                </small> :
                                                <small className='text-rose-500'>
                                                    <CloseOutlined /> be at least 8 character long.
                                                </small>}
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ViewAccountDetails