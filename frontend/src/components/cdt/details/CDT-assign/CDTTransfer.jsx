import * as React from 'react'
import { Select, Button, Input, Space } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOnlineUserCDTTransfer } from '@api/Status';
import { submitCDT } from '@api/CDT';
import { viewData } from '@hooks/ModalController';
import { toUpperText } from '@utils/Converter';

function CDTTransfer({ obtain, transfer }) {

  const getModalStatusView = viewData((state) => state.modalStatus)
  const [getOnlineUser, setOnlineUser] = React.useState([])
  const OnlineUserCDTTransferDetailsQuery = useQuery({
    queryKey: ['OnlineUserCDTTransferDetails'],
    queryFn: async () => {
      const result = await getOnlineUserCDTTransfer(obtain.userKey)
      setOnlineUser(result)
      return result
    },
    enabled: getModalStatusView,
    retryDelay: 1000,
  })

  function onClickRefreshOnlineList() {
    OnlineUserCDTTransferDetailsQuery.refetch()
  }

  const [getName, setName] = React.useState()
  const [getUserKey, setUserKey] = React.useState('')
  function handleActionOwner(e, value) {
    setName(e)
    setUserKey(value.key)
  }

  const [getRemarks, setRemarks] = React.useState('')
  function handleChange(e) {
    setRemarks(toUpperText(e.target.value))
  }

  const queryClient = useQueryClient()
  const submitCDTTransferMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        DeclarantName: getName,
        assignedBy: obtain.assignedBy,
        assigneeKey: obtain.assigneeKey,
        ReviseRemarks: getRemarks,
        userKey: getUserKey,
        CDTStatus: 'Transfered',
        refNum: obtain.refNum
      }
      
      const response = await submitCDT(dataContainer)
      transfer(response)
      if (response.status === 'success') {
        OnlineUserCDTTransferDetailsQuery.refetch()
        queryClient.invalidateQueries({ queryKey: ['CDTAssignedUserDetails'] }, { exact: true })
        queryClient.invalidateQueries({ queryKey: ['OnlineUserCDTDetails'] }, { exact: true })
      }
    },
  })

  function handleTransfer(e) {
    e.preventDefault()
    submitCDTTransferMutation.mutate('Submit_Transfer_CDT')
  }

  return (
    <div className='px-10'>
      <Select
        name='assignUser'
        className='w-[100%]'
        onClick={onClickRefreshOnlineList}
        onChange={handleActionOwner}
        options={getOnlineUser}
        allowClear
        placeholder='Assign User' />
      <div className='mt-2'>
        <Input.TextArea
          name='remarks'
          allowClear
          value={getRemarks}
          onChange={handleChange}
          placeholder='Remarks'
          autoComplete='off'
          autoSize={{
            maxRows: 5,
          }}
        />
      </div>
      <div className='float-end mt-2'>
        <Button type='primary' className='w-[100px] bg-[#1677ff]'
          disabled={!getName || !getRemarks} onClick={handleTransfer} >Submit</Button>
      </div>
    </div>
  )
}

export default CDTTransfer