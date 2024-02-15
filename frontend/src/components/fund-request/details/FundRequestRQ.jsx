import * as React from 'react'
import {
  Divider, Input, Button, notification, Typography, Space, Card,
  Badge, Empty, Popconfirm
} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { submitRequest, submitCancellation } from '@api/FundRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toUpperText } from '@utils/Converter'
import { convertTime, mmddyy } from '@utils/Formats';
import { v4 as uuidv4 } from 'uuid';

function FundRequestRQ({ obtain, list, control, select }) {

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient()
  const [getNote, setNote] = React.useState('')
  function handleChange(e) {
    setNote(toUpperText(e.target.value))
  }

  const submitRequestMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        frNote: getNote,
        refNum: obtain.refNum
      }

      const response = await submitRequest(dataContainer)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['FundRequestDetails'] }, { exact: true })
        queryClient.invalidateQueries({ queryKey: ['FundRequestDetails'] }, { exact: true })
        queryClient.invalidateQueries({ queryKey: ['AvailableFundRequestList'] }, { exact: true })
        queryClient.invalidateQueries({ queryKey: ['CompleteFundRequestList'] }, { exact: true })
        queryClient.invalidateQueries({ queryKey: ['PendingFundRequestList'] }, { exact: true })
        setNote('')
      }
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    submitRequestMutation.mutate('SUBMIT REQUEST')
  }

  const submitCancellationMutation = useMutation({
    mutationFn: async (value) => {
      const response = await submitCancellation(value)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['FundRequestDetails'] }, { exact: true })
        setNote('')
      }
    },
  })

  function handleCancel(e) {
    submitCancellationMutation.mutate(e)
  }

  return (
    <>
      {contextHolder}
      <Divider orientation='left'>Request Fund</Divider>
      <div className='px-8 pb-2'>
        <Input.TextArea placeholder='Note for Fund Request'
          value={getNote} onChange={handleChange}
          autoSize={{ maxRows: 5, }} />
        <div className='float-end mt-2'>
          <Button type='primary' className='w-[130px] bg-[#1677ff]'
            disabled={!getNote} onClick={handleSubmit}>Submit Request</Button>
        </div>
      </div>
      <Divider orientation='left'>Request List</Divider>
      <div className='container overflow-y-auto h-[340px]'>
        {
          list?.length === 0
            ? (<div className='h-[250px] flex flex-col justify-center items-center select-none'>
              <div className='flex justify-center content-center'>
                <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
              </div>
            </div>)
            : list?.map((x) => (<div className='pt-2 px-2 w-[98.5%]'
              key={uuidv4()}>
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
                  <div hidden={x?.frStatus ? true : false}>
                    <Typography.Title level={5}>Action Owner</Typography.Title>
                    <Input value={x?.ActionOwner} readOnly />
                  </div>
                  <Typography.Title level={5}>Note</Typography.Title>
                  <Input.TextArea value={x?.frNote} autoSize={{ maxRows: 5, }} readOnly />
                  <Space.Compact block>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Request Date</Typography.Title>
                      <Input value={x?.requestDate} readOnly />
                    </div>
                    <div className='w-2/4'>
                      <Typography.Title level={5}>Request Date</Typography.Title>
                      <Input value={convertTime(x?.requestTime)} readOnly />
                    </div>
                  </Space.Compact>
                  <div hidden={x?.frStatus === 'Complete' ? false : true}>
                    <Space.Compact block>
                      <div className='w-2/4'>
                        <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                        <Input value={mmddyy(x?.receivedDate)} readOnly />
                      </div>
                      <div className='w-2/4'>
                        <Typography.Title level={5}>Fund Recieved Date</Typography.Title>
                        <Input value={convertTime(new Date(x?.receivedTime).toTimeString())} readOnly />
                      </div>
                    </Space.Compact>
                  </div>
                  <div hidden={!x?.Remarks ? true : false}>
                    <Typography.Title level={5}>Remarks</Typography.Title>
                    <Input.TextArea autoSize={{ maxRows: 5, }} value={x?.Remarks} readOnly />
                  </div>
                  <div className='mt-2 float-end' hidden={x?.frStatus === 'Complete' ||
                    x?.frStatus === 'Cancelled' ? true : false}>
                    <Popconfirm
                      icon={
                        <QuestionCircleOutlined
                          style={{
                            color: 'red',
                          }} />}
                      title='Confirm Cancellation'
                      description="Are you sure to cancel this fund request?"
                      okButtonProps={{ className: 'bg-[#1677ff]' }}
                      onConfirm={() => { handleCancel(x?.frKey) }}
                      okText="Yes"
                      cancelText="No">
                      <Button danger>Cancel</Button>
                    </Popconfirm>
                  </div>
                </Card>
              </Badge.Ribbon>
            </div>))
        }
      </div >
    </>
  )
}

export default FundRequestRQ