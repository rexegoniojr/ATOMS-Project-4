import * as React from 'react'
import { Divider, Typography, Input, Space, Button, ConfigProvider, notification } from 'antd'
import { updateLodge } from '@api/Lodge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertTime } from '@utils/Formats';
import { toUpperText } from '@utils/Converter';
import LodgeDisplay from './LodgeDisplay';
function LodgeEdit({ obtain, list, token }) {

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient()
  const [getData, setData] = React.useState({
    LodgeDate: list?.LodgeDate,
    LodgeTime: list?.LodgeTime,
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
        LodgeDate: month + '-' + date + '-' + year,
        LodgeTime: convertTime(("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2)),
      })
    }
    else {
      setData({
        ...getData,
        LodgeDate: '',
        LodgeTime: '',
      })
    }
  }

  function handleChange(e) {
    setData({
      ...getData,
      Remarks: toUpperText(e.target.value)
    })
  }

  const updateLodgeMutation = useMutation({
    mutationFn: async () => {
      const dataContainer = {
        ActionOwner: token.lastName + ' ' + token.firstName,
        LodgeDate: getData.LodgeDate,
        LodgeTime: getData.LodgeTime,
        Remarks: getData.Remarks,
        userKey: token.userKey,
        refNum: obtain.refNum
      }

      const response = await updateLodge(dataContainer)
      const { status, title, message } = response
      api[status]({
        message: title,
        description: message
      });

      if (status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['LodgetDetails'] }, { exact: true })
      }
    },
  })

  function submitLodgeUpdate(e) {
    e.preventDefault()
    updateLodgeMutation.mutate('UPDATE LODGE')
  }

  return (
    <>
      {contextHolder}
      {
        list?.LodgeDate
          ? (<>
            <LodgeDisplay list={list} obtain={obtain} />
          </>)
          : (<>
            <Divider orientation='left'>Lodge Details</Divider>
            <Space.Compact block>
              <div className='w-2/4'>
                <Typography.Title level={5}>Lodge Date</Typography.Title>
                <Input value={getData.LodgeDate} readOnly />
              </div>
              <div className='w-2/4'>
                <Typography.Title level={5}>Lodge Time</Typography.Title>
                {
                  list?.LodgeDate
                    ? (<Input value={convertTime(getData.LodgeTime)} readOnly />)
                    : (<Space.Compact block>
                      <Input value={getData.LodgeTime} readOnly />
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
            <Input.TextArea value={getData.Remarks} onChange={handleChange}
              autoSize={{ maxRows: 5, }} readOnly={!list?.LodgeDate ? false : true} />
            <div className='float-end mt-2' hidden={!list?.LodgeDate ? false : true}>
              <Button type='primary' className='w-[100px] bg-[#1677ff]'
                disabled={!getData.Remarks ? true : false} onClick={submitLodgeUpdate}
                hidden={list?.LodgeDate ? true : false}>Submit</Button>
            </div>
          </>)
      }
    </>
  )
}

export default LodgeEdit