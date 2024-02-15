import * as React from 'react'
import { LockOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Space, Button, Select, notification, ConfigProvider, Tooltip, Tag } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RegisterAccount, getAccountList } from '@api/Accounts';
import { v4 as uuidv4 } from 'uuid';
import { viewAccount } from '@hooks/ModalController';
import DataTable from '@components/table/DataTable';
import ViewAccountDetails from '@components/register/ViewAccountDetails';

function Register() {

    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
    const [getData, setData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        emailCheck: '',
        acc_type: '',
        acc_access: [],
        idn: '',
        password: '',
        passwordCheck: ''
    })

    function resetFields() {
        setData({
            firstName: '',
            lastName: '',
            email: '',
            emailCheck: '',
            acc_type: '',
            acc_access: [],
            idn: '',
            password: '',
            passwordCheck: ''
        })
    }

    const acc_type = ['ADMINISTRATOR', 'SUPER ADMIN', 'MANAGER',
        'SUPERVISOR', 'CS1', 'CS2', 'DECLARANT', 'SUPPORT']

    /*const acc_access = ['Pre Alert', 'Assign Permit', 'Assign Declarant',
        'CDT', 'PRESAD', 'Peer Checker', 'Lodgement', 'Portal', 'Fund Request', 'DO-RO Processing',
        'Re-Entry', 'Register Account', 'Complete List', 'Permit']*/

    const acc_access = [
        {
            label: 'Administrator',
            options: [
                {
                    label: 'Register Account',
                    value: 'Register Account'
                }
            ],
        },
        {
            label: 'Manager | Super Visor',
            options: [
                {
                    label: 'Complete List',
                    value: 'Complete List'
                },
                {
                    label: 'Assign Permit',
                    value: 'Assign Permit'
                },
                {
                    label: 'Assign Declarant',
                    value: 'Assign Declarant'
                }
            ]
        },
        {
            label: 'CS1',
            options: [
                {
                    label: 'Pre Alert',
                    value: 'Pre Alert'
                }
            ]
        },
        {
            label: 'CS2',
            options: [
                {
                    label: 'CDT',
                    value: 'CDT'
                },
                {
                    label: 'PRESAD',
                    value: 'PRESAD'
                },
                {
                    label: 'Peer Checker',
                    value: 'Peer Checker'
                },
                {
                    label: 'Lodgement',
                    value: 'Lodgement'
                },
                {
                    label: 'Portal',
                    value: 'Portal'
                },
                {
                    label: 'Fund Request',
                    value: 'Fund Request'
                },
                {
                    label: 'DO-RO Processing',
                    value: 'DO-RO Processing'
                },
                {
                    label: 'Re-Entry',
                    value: 'Re-Entry'
                },
            ]
        },
        {
            label: 'Support',
            options: [
                {
                    label: 'Permit',
                    value: 'Permit'
                }
            ]
        }
    ]

    let hasMinPass = getData.password.length >= 8
    let hasLowerChar = /(.*[a-z].*)/.test(getData.password)
    let hasUpperChar = /(.*[A-Z].*)/.test(getData.password)
    let hasNumberChar = /(.*[0-9].*)/.test(getData.password)
    let hasSpecialChar = /(.*[^a-zA-Z0-9].*)/.test(getData.password)

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

    const handleChange = (e) => {
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

    const AccountListQuery = useQuery({
        queryKey: ['AccountList'],
        queryFn: async () => {
            const result = await getAccountList()
            return result
        },
        refetchInterval: 60 * 1000,
        retryDelay: 1000,
    })

    const RegisterAccountMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                firstName: getData.firstName,
                lastName: getData.lastName,
                email: getData.email,
                acc_type: getData.acc_type,
                acc_access: getData.acc_access.sort().join(),
                idn: getData.idn,
                password: getData.password,
                userKey: uuidv4(),
            }
            const response = await RegisterAccount(dataContainer)
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });

            if (status === 'success') {
                AccountListQuery.refetch()
                resetFields()
            }
        }
    })

    function submit(e) {
        e.preventDefault()
        RegisterAccountMutation.mutate('New_Account')
    }

    const [getSearch, setSearch] = React.useState('')

    const getModalStatusView = viewAccount((state) => state.modalStatus)
    const setModalStatusView = viewAccount((state) => state.setStatus)
    const setUserKey = viewAccount((state) => state.storeKey)
    function handleView(x) {
        setUserKey(x)
        queryClient.invalidateQueries({ queryKey: ['ViewAccountDetails'] }, { exact: true })
        setModalStatusView(true)
    }

    return (
        <>
            {contextHolder}

            <ViewAccountDetails showModal={getModalStatusView}
                closeModal={() => { setModalStatusView(false) }} />

            <div className='flex px-4' >
                <div className='flex-initial'>
                    <div className='container w-[300px]'>
                        <div className='form-group mt-2'>
                            <Input size='large'
                                name='firstName'
                                placeholder='First Name'
                                value={getData.firstName}
                                onChange={textUpperCase}
                                autoComplete='off'
                                allowClear
                            />
                        </div>
                        <div className='form-group mt-2' >
                            <Input size='large'
                                name='lastName'
                                placeholder='Last Name'
                                value={getData.lastName}
                                onChange={textUpperCase}
                                autoComplete='off'
                                allowClear
                            />
                        </div>
                        <div className='form-group mt-2'>
                            <Input size='large'
                                name='email'
                                placeholder='Email'
                                value={getData.email}
                                onChange={handleChange}
                                autoComplete='off'
                                allowClear
                                status={
                                    getData.email === getData.emailCheck
                                        ? ''
                                        : 'error'
                                }
                            />
                        </div>
                        <div className='form-group mt-2'>
                            <Input size='large'
                                name='emailCheck'
                                placeholder='Confirm Email'
                                value={getData.emailCheck}
                                onChange={handleChange}
                                autoComplete='off'
                                allowClear
                                status={
                                    getData.email === getData.emailCheck
                                        ? ''
                                        : 'error'
                                }
                            />
                        </div>
                        <div className='form-group mt-2'>
                            {
                                getData.email && (
                                    <>
                                        {
                                            getData.email === getData.emailCheck
                                                ? <small className='text-green-400'>Email match</small>
                                                : <small className='text-rose-500'>Email didn't match</small>
                                        }
                                    </>
                                )
                            }
                        </div>
                        <div className='form-group mt-2'>
                            <Select
                                size='large'
                                name='account_type'
                                onChange={handleSelectAccoutType}
                                value={getData.acc_type || undefined}
                                allowClear
                                showSearch
                                placeholder='Account Type'
                                style={{ width: '100%' }}
                                options={acc_type.map((x) => ({
                                    label: x,
                                    value: x,
                                }))}
                            />
                        </div>
                        <div className='form-group mt-2'>
                            <Select
                                size='large'
                                name='account_access'
                                mode='multiple'
                                onChange={handleSelectAccoutAccess}
                                value={getData.acc_access || undefined}
                                allowClear
                                showSearch
                                placeholder='Account Access'
                                style={{ width: '100%' }}
                                options={acc_access}
                            />
                        </div>
                        <div className='form-group mt-2'>
                            <Input size='large'
                                name='idn'
                                placeholder='ID Number'
                                value={getData.idn}
                                onChange={numberOnly}
                                autoComplete='off'
                                allowClear
                            />
                        </div>
                        <div className='form-group mt-2'>
                            <Input size='large'
                                name='password'
                                placeholder='Password'
                                value={getData.password}
                                onChange={handleChange}
                                autoComplete='off'
                                allowClear
                                status={
                                    getData.password === getData.passwordCheck
                                        ? ''
                                        : 'error'
                                }
                            />
                        </div>
                        <div className='form-group mt-2'>
                            <Input
                                size='large'
                                name='passwordCheck'
                                placeholder='Confirm Password'
                                value={getData.passwordCheck}
                                onChange={handleChange}
                                autoComplete='off'
                                allowClear
                                status={
                                    getData.password === getData.passwordCheck
                                        ? ''
                                        : 'error'
                                }
                            />
                        </div>
                        <div className='form-group mt-2'>
                            {
                                getData.password && (
                                    <>
                                        <small className='invert'>
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
                        <div className='text-center mt-2'>
                            <Space.Compact block>
                                <Button disabled={
                                    !getData.firstName || !getData.lastName || !getData.email ||
                                    !getData.emailCheck || !getData.password || !getData.passwordCheck ||
                                    !getData.idn || !getData.acc_type || !getData.acc_access ||
                                    getData.email !== getData.emailCheck ||
                                    getData.password !== getData.passwordCheck || !hasUpperChar ||
                                    !hasLowerChar || !hasMinPass || !hasNumberChar || !hasSpecialChar
                                } className='bg-[#1677ff] w-full' onClick={submit}
                                    size='large' type='primary'>Register</Button>
                                <ConfigProvider theme={{
                                    token: {
                                        colorPrimary: '#dc2626',
                                    },
                                }}>
                                    <Button className='bg-[#dc2626] w-full' onClick={resetFields}
                                        size='large' type='primary'>Clear</Button>
                                </ConfigProvider>
                            </Space.Compact>
                        </div>
                    </div>
                </div>
                <div className='flex-initial pl-3 min-w-[50%]'>
                    <div className='pb-2 min-w-[20%] float-end'>
                        <Input addonAfter={<SearchOutlined />} placeholder='Search'
                            onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
                            value={getSearch} />
                    </div>
                    <DataTable columns={'Accounts'} width={'max-content'} height={'100vh'}
                        rows={AccountListQuery.data?.filter((items) => {
                            return getSearch.toUpperCase() === ''
                                ? items
                                : items.idn.includes(getSearch) ||
                                items.lastName.toUpperCase().includes(getSearch) ||
                                items.firstName.toUpperCase().includes(getSearch)
                        }).map((x) => (x ? {
                            key: x.userKey,
                            idn: (
                                <Tooltip placement='left' title={<span>View Details</span>} arrow={true}>
                                    <Button type='link' size='small'
                                        onClick={() => {
                                            handleView(x.userKey)
                                        }}
                                        color='#092b00' block>{x.idn}</Button>
                                </Tooltip>
                            ),
                            lastName: <span className='cursor-pointer'>{x.lastName}</span>,
                            firstName: <span className='cursor-pointer'>{x.firstName}</span>,
                            email: <span className='cursor-pointer'>{x.email}</span>,
                            acc_type: <span className='cursor-pointer'>{x.acc_type}</span>,
                            acc_status: <span className='cursor-pointer'>{x.acc_status}</span>,
                            status: <Tag color={x.status === 'Online' ? 'green' : 'red'}>
                                <span className='cursor-pointer'>{x.status}</span>
                            </Tag>,
                        } : []))} />
                </div>
            </div >
        </>
    )
}

export default Register