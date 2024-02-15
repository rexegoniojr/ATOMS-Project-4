import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom'
import { toUnzip } from "@utils/Converter";

function Page404() {
    const navigate = useNavigate()

    function handleBack() {
        if (localStorage.getItem('TPLS')) {
            navigate(toUnzip(localStorage.getItem('TPLS')))
        }
        else { navigate('/') }
    }

    return (
        <div className='flex flex-col justify-center items-center my-12'>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button className='bg-[#1677ff]'
                    onClick={handleBack}
                    type="primary">Back</Button>}
            />
        </div>
    )
}

export default Page404