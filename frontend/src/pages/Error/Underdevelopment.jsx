import React from 'react'
import { ToolOutlined } from '@ant-design/icons'

function Underdevelopment() {
    return (
            <div className='h-[380px] my-[5%] flex flex-col justify-center items-center select-none invert'>
                <div className='flex justify-center content-center'>
                    <ToolOutlined style={{ fontSize: '80px' }} />
                </div>
                <div className='flex justify-center text-2xl font-semibold pt-2'>
                    <span>Underdevelopment</span>
                </div>
                <div className='flex justify-center text-xl font-semibold'>
                    <span>Coming Soon</span>
                </div>
            </div>
    )
}

export default Underdevelopment