import * as React from 'react'
import {
  Divider, Select, Space, Button, notification, Badge, Card, Tabs
} from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOnlineUserPeerChecker } from '@api/Status';
import { viewData } from '@hooks/ModalController';
import { assignPeerChecker } from '@api/PeerChecker';
import { v4 as uuidv4 } from 'uuid';
import PeerCheckerTransfer from './PeerCheckerTransfer';
import PeerCheckerDisplay from './PeerCheckerDisplay';
function PeerCheckerAssign({ obtain, refNum, token }) {

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient()

  const getModalStatusView = viewData((state) => state.modalStatus)
  const setRefresher = viewData((state) => state.storeValue)
  const getRefresher = viewData((state) => state.refreshValue)

  const [getOnlineUser, setOnlineUser] = React.useState([])
  const OnlineUserPeerCheckerDetailsQuery = useQuery({
    queryKey: ['OnlineUserPeerCheckerDetails'],
    queryFn: async () => {
      const result = await getOnlineUserPeerChecker()
      setOnlineUser(result)
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

  const [getName, setName] = React.useState()
  const [getUserKey, setUserKey] = React.useState('')
  function handleActionOwner(e, value) {
    setName(e)
    setUserKey(value.key)
  }

  const submitPeerCheckerMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        PeerCheckerActionOwner: getName,
        assignedBy: token.firstName + ' ' + token.lastName,
        assigneeKey: token.userKey,
        userPCKey: getUserKey,
        refNum: refNum
      }

      const response = await assignPeerChecker(dataContainer)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        OnlineUserPeerCheckerDetailsQuery.refetch()
        queryClient.invalidateQueries({ queryKey: ['PeerCheckerDetails'] }, { exact: true })
      }
    },
  })

  function submitAssign(e) {
    e.preventDefault()
    submitPeerCheckerMutation.mutate('AssignPeerChecker')
  }


  return (
    <div>
      {contextHolder}
      {
        obtain?.length === 0
          ? (<div className='px-10 pb-2'>
            <Divider orientation='left'>Assign Peer Checker</Divider>
            <Space.Compact block>
              <Select
                name='assignUser'
                className='w-[500px]'
                onChange={handleActionOwner}
                options={getOnlineUser}
                allowClear
                placeholder='Assign User' />
              <Button type='primary' className='w-[100px] bg-[#1677ff]'
                disabled={!getName}
                onClick={submitAssign}>Submit</Button>
            </Space.Compact>
          </div>)
          : (<>
            <Divider orientation='left'>Peer Checker Details</Divider>
            <div className='w-[98.5%]'
              key={uuidv4()}>
              <Badge.Ribbon color={obtain.pcStatus === 'Assigned'
                ? 'blue'
                : obtain.pcStatus === 'Transfered'
                  ? 'volcano'
                  : obtain.pcStatus === 'Pending'
                    ? 'purple'
                      : 'green'} text={obtain.pcStatus}>
                <Card>
                  {
                    obtain.pcStatus === 'Complete'
                      ? (<PeerCheckerDisplay obtain={obtain} token={token} />)
                      : (<Tabs defaultActiveKey='1' items={[
                        {
                          key: '1',
                          label: 'Details',
                          children: <PeerCheckerDisplay obtain={obtain} token={token} />,
                        },
                        {
                          key: '2',
                          label: 'Transfer',
                          children: <PeerCheckerTransfer obtain={obtain} transfer={(result) => {
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
            </div>
          </>)
      }
    </div>
  )
}

export default PeerCheckerAssign