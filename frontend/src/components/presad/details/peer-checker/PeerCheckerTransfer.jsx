import * as React from 'react'
import { Select, Button, Input, Space } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOnlineUserPeerCheckerTransfer } from '@api/Status';
import { transferPeerChecker } from '@api/PeerChecker';
import { viewData } from '@hooks/ModalController';

function PeerCheckerTransfer({ obtain, transfer }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const [getOnlineUser, setOnlineUser] = React.useState([])
    const OnlineUserPeerCheckerTransferDetailsQuery = useQuery({
        queryKey: ['OnlineUserPeerCheckerTransferDetails'],
        queryFn: async () => {
            const result = await getOnlineUserPeerCheckerTransfer(obtain.userPCKey)
            setOnlineUser(result)
            return result
        },
        enabled: getModalStatusView,
        retryDelay: 1000,
    })

    function onClickRefreshOnlineList() {
        OnlineUserPeerCheckerTransferDetailsQuery.refetch()
    }

    const [getName, setName] = React.useState()
    const [getUserKey, setUserKey] = React.useState('')
    function handleActionOwner(e, value) {
        setName(e)
        setUserKey(value.key)
    }

    const queryClient = useQueryClient()
    const submitPeerCheckerTransferMutation = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                PeerCheckerActionOwner: getName,
                assignedBy: obtain.assignedBy,
                assigneeKey: obtain.assigneeKey,
                userPCKey: getUserKey,
                pcStatus: 'Transfered',
                refNum: obtain.refNum
            }

            const response = await transferPeerChecker(dataContainer)
            transfer(response)
            if (response.status === 'success') {
                OnlineUserPeerCheckerTransferDetailsQuery.refetch()
                queryClient.invalidateQueries({ queryKey: ['PeerCheckerDetails'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['OnlineUserPeerCheckerDetails'] }, { exact: true })
            }
        },
    })

    function handleTransfer(e) {
        e.preventDefault()
        submitPeerCheckerTransferMutation.mutate('Submit_Transfer_PEER_CHECKER')
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
            <div className='float-end mt-2'>
                <Button type='primary' className='w-[100px] bg-[#1677ff]'
                    disabled={!getName} onClick={handleTransfer}>Submit</Button>
            </div>
        </div>
    )
}

export default PeerCheckerTransfer