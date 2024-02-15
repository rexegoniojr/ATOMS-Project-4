import * as React from 'react'
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';
import { getAssignedUserCDT } from '@api/CDT';
import { getApprovedCDT } from '@api/CDTApproved';

import CSTurnOver from './CSTurnOver';
import CDTEdit from './details/CDTEdit';
import CDTAssign from './details/CDTAssign';
import CDTDisplay from './details/CDTDisplay';
import DeclarantTurnOver from './DeclarantTurnOver';

function ViewCDT({ obtain, token, control, selected }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const CDTAssignedUserDetailsQuery = useQuery({
        queryKey: ['CDTAssignedUserDetails'],
        queryFn: async () => {
            const result = await getAssignedUserCDT(obtain.refNum)
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

    function CDTListDisplay(ctr, sel, list) {
        if (sel === 'CDT') {
            switch (ctr) {
                case 'Edit':
                    return <CDTEdit obtain={obtain} key='edit' />
                default:
                    return <CDTAssign obtain={obtain} token={token} list={list}
                        key='assign' />
            }
        }
        else {
            return <CDTDisplay list={list} key='display' />
        }
    }

    const ApprovedCDTDetailsQuery = useQuery({
        queryKey: ['ApprovedCDTDetails'],
        queryFn: async () => {
            const result = await getApprovedCDT(obtain.refNum)
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

    return (
        <div className='container overflow-y-auto h-[510px]'>
            <CSTurnOver obtain={obtain} token={token} selected={selected} />
            <div className='mx-2'>
                {CDTListDisplay(control, selected, CDTAssignedUserDetailsQuery?.data)}
            </div>
            {
                /* Display only when CDT is Approved */
                ApprovedCDTDetailsQuery.data?.lenght === 0
                    ? (<></>)
                    : ApprovedCDTDetailsQuery.data?.map((x) => (
                        <DeclarantTurnOver obtain={x} selected={selected} />
                    ))
            }
        </div>
    )
}

export default ViewCDT