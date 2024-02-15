import * as React from 'react'
import { UserOutlined } from '@ant-design/icons';
import {
  Select, Button, notification, TimePicker, Space, Card, Badge, Tabs
} from 'antd'
import { authHolder } from '@hooks/AccountController';
import { jwtDecode } from 'jwt-decode';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignedPermit, assignPermit } from '@api/Permit';
import { getOnlineUserPermit } from '@api/Status';
import { viewData } from '@hooks/ModalController';
import { mmddyy } from '@utils/Formats';
import { v4 as uuidv4 } from 'uuid';
import PermitDetails from './permit-assign/PermitDetails';
import PermitTransfer from './permit-assign/PermitTransfer';

function PermitAssign({ obtain, list }) {

  const [api, contextHolder] = notification.useNotification();
  const getModalStatusView = viewData((state) => state.modalStatus)
  const setRefresher = viewData((state) => state.storeValue)
  const getRefresher = viewData((state) => state.refreshValue)
  const getUserToken = authHolder((state) => state.account_details)
  const token = jwtDecode(getUserToken)
  let today = new Date()
  const [getUserKey, setUserKey] = React.useState('')
  const [getInfo, setInfo] = React.useState({
    typeOfPermit: '',
    permitActionOwner: '',
    submitTime: '',
    assignedBy: token.firstName + ' ' + token.lastName,
    assigneeKey: token.userKey,
    userPermitKey: getUserKey,
    refNum: obtain.refNum,
  })

  const [getPermitList, setPermitList] = React.useState([])
  const AssignedPermitDetailsQuery = useQuery({
    queryKey: ['AssignedPermitDetails'],
    queryFn: async () => {
      const result = await getAssignedPermit(obtain.refNum)
      const permits = obtain.typeOfPermit.split(',')
      result.map((x) => {
        let index = permits.indexOf(x.typeOfPermit)
        if (index > -1) {
          permits.splice(index, 1)
        }
      })

      let data_holder = []
      permits.map((x) => {
        data_holder.push({
          label: x,
          value: x,
        })
      })
      const counter = getRefresher + 1
      setRefresher(counter)
      setPermitList(data_holder)
      resetFields()
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

  const [getOnlineUser, setOnlineUser] = React.useState([])
  const OnlineUserPermitDetailsQuery = useQuery({
    queryKey: ['OnlineUserPermitDetails'],
    queryFn: async () => {
      const result = await getOnlineUserPermit()
      setOnlineUser(result)
      resetFields()
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

  function resetFields() {
    setInfo({
      typeOfPermit: '',
      permitActionOwner: '',
      submitTime: '',
      assignedBy: token.firstName + ' ' + token.lastName,
      assigneeKey: token.userKey,
      userPermitKey: getUserKey,
      refNum: obtain.refNum,
    })
  }

  function handlePermit(e) {
    setInfo({
      ...getInfo,
      typeOfPermit: e
    })
  }

  function handleActionOwner(e, value) {
    setInfo({
      ...getInfo,
      permitActionOwner: e
    })
    setUserKey(value?.key)
  }

  function onTimeChange(time, timeString) {
    setInfo({
      ...getInfo,
      submitTime: timeString
    })
  };

  const queryClient = useQueryClient()
  const submitAssignPermitMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        permitActionOwner: getInfo.permitActionOwner,
        typeOfPermit: getInfo.typeOfPermit,
        submitDate: mmddyy(today),
        submitTime: getInfo.submitTime,
        assignedBy: getInfo.assignedBy,
        assigneeKey: getInfo.assigneeKey,
        userPermitKey: getUserKey,
        refNum: obtain.refNum,
      }

      const response = await assignPermit(dataContainer)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        resetFields()
        AssignedPermitDetailsQuery.refetch()
        OnlineUserPermitDetailsQuery.refetch()
        queryClient.invalidateQueries({ queryKey: ['PermitDetails'] }, { exact: true })
      }
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    submitAssignPermitMutation.mutate('AssignNewPermit')
  }

  return (
    <>
      {contextHolder}
      <div className='container px-2 pt-2' key={uuidv4()} >
        <div className='container pb-3' key={uuidv4()} >
          <Space.Compact block>
            <Select
              name='typeOfPermit'
              className='w-[500px]'
              value={getInfo.typeOfPermit || undefined}
              onChange={handlePermit}
              options={getPermitList}
              allowClear
              placeholder='Type of Permit' />
            <Select
              name='permitActionOwner'
              className='w-[500px]'
              value={getInfo.permitActionOwner || undefined}
              onChange={handleActionOwner}
              options={getOnlineUser}
              allowClear
              showSearch
              placeholder='Select User' />
            <TimePicker className='w-[500px]'
              placeholder='Set Time Submission' name='submitTime'
              use12Hours format="hh:mm A" onChange={onTimeChange} />
            <Button type='primary' className='w-[100px] bg-[#1677ff]'
              disabled={!getInfo.typeOfPermit ||
                !getInfo.permitActionOwner ||
                !getInfo.submitTime} onClick={handleSubmit}>Submit</Button>
          </Space.Compact>
        </div>
        <div className='container overflow-y-auto h-[465px]' key={uuidv4()} >
          {
            list?.length === 0
              ? (<div className='h-[380px] flex flex-col justify-center items-center select-none'
                key={uuidv4()}>
                <div className='flex justify-center content-center'>
                  <UserOutlined style={{ fontSize: '50px' }} />
                </div>
                <div className='flex justify-center text-xl font-semibold pt-2'>
                  <span>No Permit is Assigned</span>
                </div>
              </div>)
              : list?.map((x) => (<div className='pt-2 mx-2'
                key={uuidv4()}>
                <Badge.Ribbon color={x.permitStatus === 'Assigned'
                  ? 'geekblue'
                  : x.permitStatus === 'Transfered'
                    ? 'volcano'
                    : x.permitStatus === 'Pending'
                      ? 'blue'
                      : 'green'} text={x.permitStatus}>
                  <Card title={x.typeOfPermit}>
                    {
                      x.permitStatus === 'Complete'
                        ? (<PermitDetails data={x} />)
                        : (<Tabs defaultActiveKey='1' items={[
                          {
                            key: '1',
                            label: 'Details',
                            children: <PermitDetails data={x} />,
                          },
                          {
                            key: '2',
                            label: 'Transfer',
                            children: <PermitTransfer data={x} transfer={(result) => {
                              api[result.status]({
                                message: result.title,
                                description: result.message
                              });
                            }} />,
                          },
                        ]} />)
                    }
                  </Card>
                </Badge.Ribbon>
              </div>))
          }
        </div>
      </div>
    </>
  )
}

export default PermitAssign