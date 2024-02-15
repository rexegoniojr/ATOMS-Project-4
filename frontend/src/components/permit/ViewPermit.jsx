import * as React from 'react'
import { getPermitDetails } from '@api/Permit'
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';

import PermitDisplay from './details/PermitDisplay';
import PermitEdit from './details/PermitEdit';
import PermitAssign from './details/PermitAssign';

function ViewPermit({ obtain, control, selected }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const PermittDetailsQuery = useQuery({
        queryKey: ['PermitDetails'],
        queryFn: async () => {
            const result = await getPermitDetails(obtain.refNum)
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

    function PermitListDisplay(ctr, sel) {

        if (sel === 'Permit') {
            switch (ctr) {
                case 'Edit':
                    return <PermitEdit obtain={obtain} key='edit' />
                default:
                    return <PermitAssign obtain={obtain} list={PermittDetailsQuery?.data} key='assign' />
            }
        }
        else {
            return <PermitDisplay list={PermittDetailsQuery?.data} key='display' />
        }
    }

    return (
        <> {PermitListDisplay(control, selected)}  </>
    )
}

export default ViewPermit