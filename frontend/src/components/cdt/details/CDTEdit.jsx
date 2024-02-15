import * as React from 'react'
import {
  Divider, Typography, Input, Space, Button, notification, Card, Badge, ConfigProvider
} from 'antd'
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAssignedUserCDT, updateCDT } from '@api/CDT';
import { viewData } from '@hooks/ModalController';
import { toUpperText } from '@utils/Converter';
import { convertTime } from '@utils/Formats';

function CDTEdit({ obtain }) {

  const [api, contextHolder] = notification.useNotification();
  const [getData, setData] = React.useState({
    DateOfCDT: '',
    TimeOfCDT: '',
    CDTKey: '',
    CDTStatus: 'Pending',
    Remarks: ''
  })
  const getModalStatusView = viewData((state) => state.modalStatus)
  const setRefresher = viewData((state) => state.storeValue)
  const getRefresher = viewData((state) => state.refreshValue)
  const CDTAssignedUserDetailsQuery = useQuery({
    queryKey: ['CDTAssignedUserDetails'],
    queryFn: async () => {
      const result = await getAssignedUserCDT(obtain.refNum)
      setData({
        ...getData,
        DateOfCDT: result[0].DateOfCDT,
        TimeOfCDT: result[0].TimeOfCDT,
        CDTKey: result[0].CDTKey,
        Remarks: result[0].Remarks,
      })
      const counter = getRefresher + 1
      setRefresher(counter)
      return result
    },
    refetchInterval: () => {
      if (getRefresher >= 3) {
        return false
      }
      else {
        return 1000
      }
    },
    enabled: getModalStatusView,
    retryDelay: 1000,
  })

  function handleChange(e) {
    setData({
      ...getData,
      Remarks: toUpperText(e.target.value)
    })
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
        DateOfCDT: month + '-' + date + '-' + year,
        TimeOfCDT: convertTime(("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)),
        CDTStatus: 'Complete'
      })
    }
    else {
      setData({
        ...getData,
        DateOfCDT: '',
        TimeOfCDT: '',
        CDTStatus: 'Pending'
      })
    }
  }

  const updateAssignedCDTCDTMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        DateOfCDT: getData.DateOfCDT,
        TimeOfCDT: getData.TimeOfCDT,
        CDTStatus: getData.CDTStatus,
        Remarks: getData.Remarks,
        CDTKey: getData.CDTKey
      }

      const response = await updateCDT(dataContainer)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        CDTAssignedUserDetailsQuery.refetch()
      }
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    updateAssignedCDTCDTMutation.mutate('UPDATE_CDT_BY_USER')
  }

  return (
    <>
      {contextHolder}
      <Divider orientation='left'>Assigned CDT</Divider>
      <div className='overflow-y-auto h-[325px]'>
        {CDTAssignedUserDetailsQuery.data?.map((x) => (
          <div className='mx-3'>
            <Badge.Ribbon color={x.CDTStatus === 'Assigned'
              ? 'blue' : x.CDTStatus === 'Transfered'
                ? 'volcano' : x.CDTStatus === 'Pending'
                  ? 'purple' : x.CDTStatus === 'Revision'
                    ? 'red' : x.CDTStatus === 'Complete'
                      ? 'gold' : 'green'} text={x.CDTStatus}>
              <Card>
                <Space.Compact block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Action Owner</Typography.Title>
                    <Input value={x.DeclarantName} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Assigned By</Typography.Title>
                    <Input value={x.assignedBy} readOnly />
                  </div>
                </Space.Compact>
                <Space.Compact block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Assigned Date</Typography.Title>
                    <Input value={x.DateAssigned} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Assigned Time</Typography.Title>
                    <Input value={x.TimeAssigned} readOnly />
                  </div>
                </Space.Compact>
                <Space.Compact block>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Date of CDT</Typography.Title>
                    <Input value={getData.DateOfCDT} readOnly />
                  </div>
                  <div className='w-2/4'>
                    <Typography.Title level={5}>Time of CDT</Typography.Title>
                    {x.CDTStatus === 'Complete' || x.CDTStatus === 'Approved'
                      ? (<Input value={getData.TimeOfCDT} readOnly />)
                      : (<Space.Compact block>
                        <Input value={getData.TimeOfCDT} readOnly />
                        {isSet ? (<ConfigProvider theme={{
                          token: { colorPrimary: '#dc2626', }
                        }}>
                          <Button className='bg-[#dc2626]' onClick={() => { setDateTime('Cancel') }}
                            type='primary'>Cancel</Button>
                        </ConfigProvider>)
                          : (<Button type='primary' className='w-[100px] bg-[#1677ff]'
                            onClick={() => { setDateTime('Set') }}>Set Now</Button>)}
                      </Space.Compact>)}
                  </div>
                </Space.Compact>
                <Typography.Title level={5}>Remarks by User</Typography.Title>
                <Input.TextArea value={getData.Remarks} autoSize={{ maxRows: 5, }}
                  readOnly={x.CDTStatus !== 'Complete' || x.CDTStatus !== 'Approved'
                    ? false : true} onChange={handleChange} />
                <div className='float-end mt-2' hidden={x.CDTStatus !== 'Complete' ||
                  x.CDTStatus !== 'Approved' ? false : true}>
                  <Button type='primary' className='w-[100px] bg-[#1677ff]'
                    disabled={!getData.Remarks || x.CDTStatus === 'Complete' ||
                      x.CDTStatus === 'Approved' ? true : false} onClick={handleSubmit}
                    hidden={x.CDTStatus === 'Complete' || x.CDTStatus === 'Approved'
                      ? true : false}>Submit</Button>
                </div>
                <div className='mt-5' hidden={!x.ReviseRemarks &&
                  x.CDTStatus !== 'Approved' ? true : false}>
                  <Typography.Title level={5}>Remarks by Assignee</Typography.Title>
                  <Input.TextArea value={x.ReviseRemarks} autoSize={{ maxRows: 5, }} readOnly />
                </div>
              </Card>
            </Badge.Ribbon>
          </div>
        ))}
      </div>
    </>
  )
}

export default CDTEdit