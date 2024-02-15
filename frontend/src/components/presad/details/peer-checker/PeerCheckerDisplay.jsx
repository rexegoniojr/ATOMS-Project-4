import * as React from 'react'
import {
  Divider, Space, Typography, Input, notification, Card, Badge, ConfigProvider, Button
} from 'antd'
import { updatePeerChecker } from '@api/PeerChecker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertTime } from '@utils/Formats'
import { toUpperText } from '@utils/Converter';

function PeerCheckerDisplay({ obtain, control, selected }) {

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient()

  const [getData, setData] = React.useState({
    dateComplete: obtain.dateComplete,
    timeComplete: obtain.timeComplete,
    refNum: obtain.refNum,
    pcStatus: 'Pending',
    Remarks: obtain.Remarks,
  })

  function PeerCheckerDisplay(con) {
    switch (con) {
      case 'Edit':
        return (<>
          <Space.Compact block>
            <div className='w-2/4'>
              <Typography.Title level={5}>Action Owner</Typography.Title>
              <Input value={obtain.PeerCheckerActionOwner} readOnly />
            </div>
            <div className='w-2/4'>
              <Typography.Title level={5}>Assigned By</Typography.Title>
              <Input value={obtain.assignedBy} readOnly />
            </div>
          </Space.Compact>
          <Space.Compact block>
            <div className='w-2/4'>
              <Typography.Title level={5}>Assigned Date</Typography.Title>
              <Input value={obtain.dateAssigned} readOnly />
            </div>
            <div className='w-2/4'>
              <Typography.Title level={5}>Assigned Time</Typography.Title>
              <Input value={convertTime(obtain.timeAssigned)} readOnly />
            </div>
          </Space.Compact>
          <Space.Compact block>
            <div className='w-2/4'>
              <Typography.Title level={5}>Date Completed</Typography.Title>
              <Input value={getData.dateComplete} readOnly />
            </div>
            <div className='w-2/4'>
              <Typography.Title level={5}>Time Completed</Typography.Title>
              {
                obtain.pcStatus === 'Complete'
                  ? (<Input value={convertTime(getData.timeComplete)} readOnly />)
                  : (<Space.Compact block>
                    <Input value={getData.timeComplete} readOnly />
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
          <Input.TextArea value={getData.Remarks} onChange={handleChange} autoSize={{ maxRows: 5, }} />
          <div className='float-end mt-2' hidden={obtain.pcStatus !== 'Complete' ? false : true}>
            <Button type='primary' className='w-[100px] bg-[#1677ff]'
              disabled={!getData.Remarks || obtain.pcStatus === 'Complete'
                ? true : false} onClick={submitPeerCheckerUpdate}
              hidden={obtain.pcStatus === 'Complete' ? true : false}>Submit</Button>
          </div>
        </>)
      default:
        return (<><Space.Compact block>
          <div className='w-2/4'>
            <Typography.Title level={5}>Action Owner</Typography.Title>
            <Input value={obtain.PeerCheckerActionOwner} readOnly />
          </div>
          <div className='w-2/4'>
            <Typography.Title level={5}>Assigned By</Typography.Title>
            <Input value={obtain.assignedBy} readOnly />
          </div>
        </Space.Compact>
          <Space.Compact block>
            <div className='w-2/4'>
              <Typography.Title level={5}>Assigned Date</Typography.Title>
              <Input value={obtain.dateAssigned} readOnly />
            </div>
            <div className='w-2/4'>
              <Typography.Title level={5}>Assigned Time</Typography.Title>
              <Input value={convertTime(obtain.timeAssigned)} readOnly />
            </div>
          </Space.Compact>
          <div hidden={!obtain.Remarks ? true : false}>
            <Typography.Title level={5}>Remarks</Typography.Title>
            <Input.TextArea value={obtain.Remarks} autoSize={{ maxRows: 5, }} readOnly />
          </div></>)
    }
  }

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
        dateComplete: month + '-' + date + '-' + year,
        timeComplete: convertTime(("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)),
        pcStatus: 'Complete'
      })
    }
    else {
      setData({
        ...getData,
        dateComplete: '',
        timeComplete: '',
        pcStatus: 'Pending'
      })
    }
  }

  function handleChange(e) {
    setData({
      ...getData,
      Remarks: toUpperText(e.target.value)
    })
  }

  const updateAssignedPCMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        dateComplete: getData.dateComplete,
        timeComplete: getData.timeComplete,
        refNum: obtain.refNum,
        pcStatus: getData.pcStatus,
        Remarks: getData.Remarks,
      }

      const response = await updatePeerChecker(dataContainer)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['PeerCheckerDetails'] }, { exact: true })
      }
    },
  })

  function submitPeerCheckerUpdate(e) {
    e.preventDefault()
    updateAssignedPCMutation.mutate('UPDATE PEER CHECKER')
  }

  return (
    <>
      {contextHolder}
      {
        selected === 'Peer Checker'
          ? (<>{PeerCheckerDisplay(control)}</>)
          : (<><Space.Compact block>
            <div className='w-2/4'>
              <Typography.Title level={5}>Action Owner</Typography.Title>
              <Input value={obtain.PeerCheckerActionOwner} readOnly />
            </div>
            <div className='w-2/4'>
              <Typography.Title level={5}>Assigned By</Typography.Title>
              <Input value={obtain.assignedBy} readOnly />
            </div>
          </Space.Compact>
            <Space.Compact block>
              <div className='w-2/4'>
                <Typography.Title level={5}>Assigned Date</Typography.Title>
                <Input value={obtain.dateAssigned} readOnly />
              </div>
              <div className='w-2/4'>
                <Typography.Title level={5}>Assigned Time</Typography.Title>
                <Input value={convertTime(obtain.timeAssigned)} readOnly />
              </div>
            </Space.Compact>
            <Space.Compact block>
              <div className='w-2/4'>
                <Typography.Title level={5}>Date Completed</Typography.Title>
                <Input value={obtain.dateComplete} readOnly />
              </div>
              <div className='w-2/4'>
                <Typography.Title level={5}>Time Completed</Typography.Title>
                <Input value={convertTime(obtain.timeComplete)} readOnly />
              </div>
            </Space.Compact>
            <div hidden={!obtain.Remarks ? true : false}>
              <Typography.Title level={5}>Remarks</Typography.Title>
              <Input.TextArea value={obtain.Remarks} autoSize={{ maxRows: 5, }} readOnly />
            </div></>)
      }
    </>
  )
}

export default PeerCheckerDisplay