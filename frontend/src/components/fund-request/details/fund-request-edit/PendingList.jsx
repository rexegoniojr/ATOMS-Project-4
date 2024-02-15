import * as React from 'react'
import {
  notification, Empty, Badge, Card
} from 'antd'
import { v4 as uuidv4 } from 'uuid';
import RequestLayout from './pending-edit/RequestLayout';
function PendingList({ obtain, list, submit, token, accept }) {

  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <div className='container overflow-y-auto h-[380px]'>
        {
          list?.length === 0 || list?.includes('Pending') === false
            ? (<div className='h-[250px] flex flex-col justify-center items-center select-none'>
              <div className='flex justify-center content-center'>
                <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
              </div>
            </div>)
            : list?.filter((items) => {
              return items.frStatus === 'Pending'
            }).map((x) => (
              <div className='pt-2 px-2 w-[98.5%]' key={uuidv4()}>
                <Badge.Ribbon color={x?.frStatus === 'Complete'
                  ? 'green'
                  : x?.frStatus === 'Pending'
                    ? 'purple'
                    : x?.frStatus === 'Cancelled'
                      ? 'red'
                      : 'blue'} text={
                        !x?.frStatus
                          ? 'Available'
                          : x?.frStatus
                      }>
                  <Card>
                    <RequestLayout obtain={x} submit={(result) => { submit(result) }} />
                  </Card>
                </Badge.Ribbon>
              </div>))
        }
      </div >
    </>
  )
}

export default PendingList