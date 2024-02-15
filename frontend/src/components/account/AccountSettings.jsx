import * as React from 'react'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { LogoutAccount } from '@api/Accounts';
import { authHolder } from '@hooks/AccountController';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

function AccountSettings() {

    const navigate = useNavigate()
    const getUserToken = authHolder((state) => state.account_details)
    const token = jwtDecode(getUserToken)
    const logoutMutation = useMutation({
        mutationFn: async () => {
            await LogoutAccount(token.userKey)
        },
        onSuccess: () => {
            localStorage.clear()
            navigate('/')
        }
    })

    const items = [
        {
            label: 'My Account',
            key: '1',
            icon: <UserOutlined style={{ fontSize: '18px' }} />,
        },
        {
            label: 'Logout',
            key: '2',
            danger: true,
            icon: <LogoutOutlined style={{ fontSize: '18px' }} />,
            onClick: () => { logoutMutation.mutate('Logout_Account') }
        },
    ];


    return (
        <Dropdown menu={{ items }} placement="bottom">
            <Button onClick={(e) => e.preventDefault()} className='bg-[#1677ff]'
                type="primary" icon={<UserOutlined />} />
        </Dropdown>
    )
}

export default AccountSettings