import * as React from 'react'
import { Select, Button, Input, Space } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submitCDT } from '@api/CDT';
import { toUpperText } from '@utils/Converter';

function CDTRevise({ obtain, revise }) {

  const [getRemarks, setRemarks] = React.useState('')
  function handleChange(e) {
    setRemarks(toUpperText(e.target.value))
  }

  const queryClient = useQueryClient()
  const submitCDTTransferMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        DeclarantName: obtain.DeclarantName,
        assignedBy: obtain.assignedBy,
        assigneeKey: obtain.assigneeKey,
        ReviseRemarks: getRemarks,
        userKey: obtain.userKey,
        CDTStatus: 'Revision',
        refNum: obtain.refNum
      }

      const response = await submitCDT(dataContainer)
      revise(response)
      if (response.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['CDTAssignedUserDetails'] }, { exact: true })
      }
    },
  })

  function handleTransfer(e) {
    e.preventDefault()
    submitCDTTransferMutation.mutate('Submit_Transfer_CDT')
  }

  return (
    <div className='px-10'>
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
          disabled={!getRemarks} onClick={handleTransfer} >Submit</Button>
      </div>
    </div>
  )
}

export default CDTRevise