import * as React from 'react'
import {
    Select, Button, notification, TimePicker, Space
} from 'antd'
import { authHolder } from '@hooks/AccountController';
import { jwtDecode } from 'jwt-decode';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transferPermit } from '@api/Permit';
import { getOnlineUserPermitTransfer } from '@api/Status';
import { viewData } from '@hooks/ModalController';
import { mmddyy } from '@utils/Formats';
import { v4 as uuidv4 } from 'uuid';

function PermitTransfer({ data, transfer }) {

    const [api, contextHolder] = notification.useNotification();
    const getModalStatusView = viewData((state) => state.modalStatus)
    const getUserToken = authHolder((state) => state.account_details)
    const token = jwtDecode(getUserToken)

    let today = new Date()
    const [getUserKey, setUserKey] = React.useState('')
    const [getInfo, setInfo] = React.useState({
        permitActionOwner: '',
        submitTime: '',
        assignedBy: token.firstName + ' ' + token.lastName,
        assigneeKey: token.userKey,
        userPermitKey: '',
        permitKey: data.permitKey,
    })

    function resetFields() {
        setInfo({
            permitActionOwner: '',
            submitTime: '',
            assignedBy: token.firstName + ' ' + token.lastName,
            assigneeKey: token.userKey,
            userPermitKey: '',
            permitKey: data.permitKey,
        })
        setUserKey('')
    }

    const [getOnlineUserTransfer, setOnlineUserTransfer] = React.useState([])
    const OnlineUserCDTTransferDetailsQuery = useQuery({
        queryKey: ['OnlineUserPermitTransferDetails'],
        queryFn: async () => {
            const result = await getOnlineUserPermitTransfer(data.userPermitKey)
            setOnlineUserTransfer(result)
            return result
        },
        enabled: getModalStatusView,
        retryDelay: 1000,
    })

    function onClickRefreshOnlineList() {
        OnlineUserCDTTransferDetailsQuery.refetch()
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
    const [getResult, setResult] = React.useState({
        status: '',
        title: '',
        message: ''
    })
    const submitTransferPermitCDTMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                permitActionOwner: getInfo.permitActionOwner,
                submitDate: mmddyy(today),
                submitTime: getInfo.submitTime,
                assignedBy: getInfo.assignedBy,
                assigneeKey: getInfo.assigneeKey,
                userPermitKey: getUserKey,
                permitKey: getInfo.permitKey
            }

            const response = await transferPermit(dataContainer)
            transfer(response)
            if (response.status === 'success') {
                resetFields()
                queryClient.invalidateQueries({ queryKey: ['PermitDetails'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['OnlineUserPermitDetails'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['AssignedPermitDetails'] }, { exact: true })
            }
        }
    })

    function handleSubmitTransfer(e) {
        e.preventDefault()
        submitTransferPermitCDTMutation.mutate('TrasnferPermit')
    }

    return (
        <div>
            {contextHolder}
            <Space.Compact block>
                <Select
                    name='permitActionOwner'
                    className='w-[500px]'
                    onClick={onClickRefreshOnlineList}
                    value={getInfo.permitActionOwner || undefined}
                    onChange={handleActionOwner}
                    options={getOnlineUserTransfer}
                    allowClear
                    showSearch
                    placeholder='Select User' />
                <TimePicker className='w-[500px]'
                    placeholder='Set Time Submission' name='submitTime'
                    use12Hours format="hh:mm A" onChange={onTimeChange} />
                <Button type='primary' className='w-[100px] bg-[#1677ff]'
                    disabled={!getInfo.permitActionOwner ||
                        !getInfo.submitTime || !getUserKey} onClick={handleSubmitTransfer}>Submit</Button>
            </Space.Compact>
        </div>
    )
}

export default PermitTransfer