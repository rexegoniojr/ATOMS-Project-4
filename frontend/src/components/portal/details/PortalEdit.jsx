import * as React from 'react'
import {
  Divider, Typography, Input, Space, Button, ConfigProvider,
  Badge, Card, notification
} from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePortal } from '@api/Portal';
import { toUpperText } from '@utils/Converter';
import { convertTime } from '@utils/Formats';
import PortalDisplay from './PortalDisplay'
function PortalEdit({ list, obtain, token }) {

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient()
  const [getData, setData] = React.useState({
    ticketNo: list?.ticketNo,
    portalDate: list?.portalDate,
    portalTime: list?.portalTime,
    Remarks: list?.Remarks,
  })

  let today = new Date()
  let date = ("0" + today.getDate()).slice(-2);
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let year = today.getFullYear();
  let hours = today.getHours();
  let minutes = today.getMinutes();

  const [isSet, setChange] = React.useState(false)
  function setDateTime(e) {
    setChange(!isSet)

    if (e === 'Set') {
      setData({
        ...getData,
        portalDate: month + '-' + date + '-' + year,
        portalTime: convertTime(("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)),
      })
    }
    else {
      setData({
        ...getData,
        portalDate: '',
        portalTime: '',
      })
    }
  }

  function handleChangeRemarks(e) {
    setData({
      ...getData,
      Remarks: toUpperText(e.target.value)
    })
  }

  function handleChangeTicket(e) {
    setData({
      ...getData,
      ticketNo: toUpperText(e.target.value)
    })
  }

  const updatePortalMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        ActionOwner: token.firstName + ' ' + token.lastName,
        ticketNo: getData.ticketNo,
        portalDate: getData.portalDate,
        portalTime: getData.portalTime,
        portalStatus: 'Complete',
        Remarks: getData.Remarks,
        userKey: token.userKey,
        refNum: obtain.refNum
      }

      const response = await updatePortal(dataContainer)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['PortalDetails'] }, { exact: true })
      }
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    updatePortalMutation.mutate('UPDATE PORTAL')
  }

  return (
    <>
      {contextHolder}
      {
        list?.portalDate
          ? (<>
            <PortalDisplay list={list} obtain={obtain} />
          </>)
          : (<>
            <Divider orientation='left'>Portal Details</Divider>
            <Badge.Ribbon color={list?.portalStatus === 'Complete'
              ? 'green'
              : list?.portalStatus === 'Pending'
                ? 'purple'
                : 'blue'} text={
                  !list?.portalStatus
                    ? 'Available'
                    : list?.portalStatus
                }>
              <Card>
                <Typography.Title level={5}>Ticket No</Typography.Title>
                <Input onChange={handleChangeTicket} value={getData.ticketNo}
                  readOnly={list?.userKey === token.userKey ? false : true} />
                <Space.Compact block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Date of Portal</Typography.Title>
                    <Input value={getData.portalDate} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Time of Portal</Typography.Title>
                    {
                      list?.userKey !== token.userKey
                        ? (<Input value={convertTime(getData.portalTime)} readOnly />)
                        : (<Space.Compact block>
                          <Input value={convertTime(getData.portalTime)} readOnly />
                          {isSet ? (<ConfigProvider theme={{
                            token: { colorPrimary: '#dc2626', }
                          }}>
                            <Button className='bg-[#dc2626]' onClick={() => { setDateTime('Cancel') }}
                              type='primary'>Cancel</Button>
                          </ConfigProvider>)
                            : (<Button type='primary' className='w-[100px] bg-[#1677ff]'
                              onClick={() => { setDateTime('Set') }}>Set Now</Button>)}
                        </Space.Compact>)
                    }
                  </div>
                </Space.Compact>
                <Typography.Title level={5}>Remarks</Typography.Title>
                <Input.TextArea value={getData.Remarks} onChange={handleChangeRemarks}
                  autoSize={{ maxRows: 5, }} readOnly={!list?.portalDate ? false : true} />
                <div className='float-end mt-2' hidden={!list?.portalDate ? false : true}>
                  <Button type='primary' className='w-[100px] bg-[#1677ff]'
                    disabled={!getData.Remarks ? true : false} onClick={handleSubmit}
                    hidden={list?.portalDate ? true : false}>Submit</Button>
                </div>
              </Card>
            </Badge.Ribbon>
          </>)
      }
    </>
  )
}

export default PortalEdit