import * as React from 'react'
import { IdcardOutlined, LockOutlined } from '@ant-design/icons';
import { Input, Button, notification } from 'antd';
import { LoginAccount } from '@api/Accounts';
import { useMutation } from '@tanstack/react-query';
import { authHolder } from '@hooks/AccountController';
import { useNavigate } from 'react-router-dom'
import { PageKey } from '@hooks/PageController';
import { toZip } from '@utils/Converter';

function Login() {

    const navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification();
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const setToken = authHolder((state) => state.token_holder)
    const setPageAccess = PageKey((state) => state.setPageAccess)
    const [getData, setData] = React.useState({
        idn: '',
        password: ''
    })

    const handleChange = (e) => {
        setData({
            ...getData,
            [e.target.name]: e.target.value
        })
    }

    const numberOnly = (e) => {
        setData({
            ...getData,
            [e.target.name]: e.target.value.replace(/\D/g, '')
        })
    }

    const LoginAccountMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                idn: getData.idn,
                password: getData.password,
            }
            const response = await LoginAccount(dataContainer)
            const { status, title, message, token, account_access, ui_theme } = response
            if (token) {
                setPageAccess(account_access)
                localStorage.setItem('UPTH',toZip(account_access))
                localStorage.setItem('TKPIN',toZip(token))
                localStorage.setItem('Theme',ui_theme)
                setToken(token)
                navigate('/Atoms')
            }
            api[status]({
                message: title,
                description: message
            });
        },
    })

    function handleLogin() {
        {
            getData.idn === ''
                ? api['warning']({
                    message: 'Invalid ID Number',
                    description: 'Please input your ID Number to login.'
                })
                : getData.password === ''
                    ? api['warning']({
                        message: 'Invalid Password',
                        description: 'Please input your Password to login.'
                    })
                    : LoginAccountMutation.mutate('Login_Account')
        }
    }

    return (
        <>
            {contextHolder}
            <div className='h-[500px] flex flex-col justify-center items-center mt-8' >
                <div className='justify-center items-center text-slate-100 text-xl font-medium mb-5'>
                    Automated Tracking Operations and Monitoring System
                </div>
                <div className='container w-[350px]' >
                    <div className='text-center mb-3'>
                        <div className='mt-2'>
                            <Input size='large'
                                name='idn'
                                placeholder='ID Number'
                                prefix={<IdcardOutlined />}
                                value={getData.idn}
                                onChange={numberOnly}
                                autoComplete='off'
                            />
                        </div>
                        <div className='mt-2'>
                            <Input.Password
                                name='password'
                                size='large'
                                placeholder='Password'
                                visibilityToggle={{
                                    visible: passwordVisible,
                                    onVisibleChange: setPasswordVisible,
                                }}
                                prefix={<LockOutlined />}
                                onChange={handleChange}
                                autoComplete='off'
                            />
                            <Button hidden className='float-right' size='large'
                                type='link'>Forgot password?</Button>
                        </div>
                        <div className='text-center mt-2'>
                            <Button className='bg-[#1677ff] w-full' onClick={handleLogin}
                                size='large' type='primary'>Login</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login