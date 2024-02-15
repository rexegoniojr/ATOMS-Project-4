import React from 'react'
import { Button, Tooltip, Input, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAvailableRE } from '@api/RE';
import { viewData } from '@hooks/ModalController';
import { authHolder } from '@hooks/AccountController';
import { jwtDecode } from 'jwt-decode';
import { mmddyy,convertTime } from '@utils/Formats';
import DataTable from '@components/table/DataTable'
import ViewData from '@components/ViewData';


function AvailableRE() {

  const getUserToken = authHolder((state) => state.account_details)
  const token = jwtDecode(getUserToken)
  const queryClient = useQueryClient()
  const AvailableREListQuery = useQuery({
    queryKey: ['AvailableREList'],
    queryFn: async () => {
      const result = await getAvailableRE()
      return result
    },
    refetchInterval: 30 * 1000,
    retryDelay: 1000,
  })

  const getModalStatusView = viewData((state) => state.modalStatus)
  const setModalStatusView = viewData((state) => state.setStatus)
  const setDataCollection = viewData((state) => state.storeData)
  const setRefresher = viewData((state) => state.storeValue)
  function handleView(x) {
    setDataCollection(x)
    setRefresher(0)
    queryClient.invalidateQueries({ queryKey: ['PreAlertDetails'] }, { exact: true })
    setModalStatusView(true)
  }

  const [getSearch, setSearch] = React.useState('')
  return (
    <>
      <ViewData showModal={getModalStatusView} token={token} display={'Edit'} selected={'RE'}
        closeModal={() => { setModalStatusView(false) }} />
      <div className='px-2'>
        <div className='pb-2'>
          <div className='pb-2 min-w-[25%] float-end'>
            <Input addonAfter={<SearchOutlined />} placeholder='Search'
              onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
              value={getSearch} />
          </div>
        </div>
        <DataTable width={'max-content'} height={'100vh'} column={'Normal'}
          rows={AvailableREListQuery.data?.filter((items) => {
            return getSearch.toUpperCase() === ''
              ? items
              : items.consigneeName.includes(getSearch.toUpperCase(), /^/g) ||
              items.hbl_awbl.includes(getSearch.toUpperCase(), /^/g) ||
              items.proNum.includes(getSearch.toUpperCase(), /^/g) ||
              items.oldPro.includes(getSearch.toUpperCase(), /^/g)
          }).map((x) => (x ? {
            key: x.refNum,
            sos: (
                <Tooltip placement='left' title={<span>View Details</span>} arrow={true}>
                    <Button type='link' size='small'
                        onClick={() => {
                            handleView(x)
                        }}
                        color='#092b00' block>{("000" + x.sos).slice(-3)}</Button>
                </Tooltip>
            ),
            typeOfShipment: <span className='cursor-pointer'>{x.typeOfShipment}</span>,
            typeOfDeclaration: <span className='cursor-pointer'>{x.typeOfDeclaration}</span>,
            consigneeName: <span className='cursor-pointer'>{x.consigneeName}</span>,
            typeOfAccount: <span className='cursor-pointer'>{x.typeOfAccount}</span>,
            hbl_awbl: <span className='cursor-pointer'>{x.hbl_awbl}</span>,
            arrivalDate: <Tag color='lime'>{mmddyy(x.arrivalDate)}</Tag>,
            dateOfReceipt: <Tag color='cyan'>{mmddyy(x.dateOfReceipt)}</Tag>,
            timeOfReceipt: <Tag color='cyan'>{
                convertTime(new Date(x.timeOfReceipt).toTimeString())}</Tag>,
            numOfLineItems: <span className='cursor-pointer'>{x.numOfLineItems}</span>,
            proNum: <span className='cursor-pointer'>{x.proNum}</span>,
            oldPro: <span className='cursor-pointer'>{x.oldPro}</span>,
            remarks: <span className='cursor-pointer'>{x.remarks}</span>,
          } : []))} />
      </div>
    </>
  )
}


export default AvailableRE