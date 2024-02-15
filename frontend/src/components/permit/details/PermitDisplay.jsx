import * as React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Card, Badge } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import PermitDetails from './permit-assign/PermitDetails';

function PermitDisplay({ list }) {
  return (
    <div className='container overflow-y-auto h-[510px]' key={uuidv4()} >
      {
        list?.length === 0
          ? (<div className='h-[380px] my-5 flex flex-col justify-center items-center select-none'
            key={uuidv4()}>
            <div className='flex justify-center content-center'>
              <UserOutlined style={{ fontSize: '50px' }} />
            </div>
            <div className='flex justify-center text-xl font-semibold pt-2'>
              <span>No Permit is Assigned</span>
            </div>
          </div>)
          : list?.map((x) => (<div className='pt-2 w-[98.5%]'
            key={uuidv4()}>
            <Badge.Ribbon color={x.permitStatus === 'Assigned'
                  ? 'geekblue'
                  : x.permitStatus === 'Transfered'
                    ? 'volcano'
                    : x.permitStatus === 'Pending'
                      ? 'blue'
                      : 'green'} text={x.permitStatus}>
              <Card title={x.typeOfPermit}>
                <PermitDetails data={x} />
              </Card>
            </Badge.Ribbon>
          </div>))
      }
    </div>
  )
}

export default PermitDisplay