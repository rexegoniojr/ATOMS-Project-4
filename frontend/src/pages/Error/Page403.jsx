import React from 'react';
import { Button, Result } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { LogoutAccount } from '@api/Accounts';
import { authHolder } from '@hooks/AccountController';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

function Page403() {

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

    return (
        <div className='flex flex-col justify-center items-center my-12'>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button className='bg-[#1677ff]'
                    onClick={() => { logoutMutation.mutate('Logout_Account') }}
                    type="primary">Go To Login</Button>}
            />
        </div>
    )
}

export default Page403