import * as React from 'react'
import { getLodgeDetails } from '@api/Lodge';
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';

import LodgeDisplay from './details/LodgeDisplay';
import LodgeEdit from './details/LodgeEdit';
function ViewLodge({ obtain, control, selected, token }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const LodgetDetailsQuery = useQuery({
        queryKey: ['LodgetDetails'],
        queryFn: async () => {
            const result = await getLodgeDetails(obtain.refNum)
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

    function LodgeListDisplay(ctr, sel) {

        if (sel === 'Lodgement') {
            switch (ctr) {
                case 'Edit':
                    return <LodgeEdit obtain={obtain} list={LodgetDetailsQuery?.data}
                        token={token} key='edit' />
                default:
                    return <LodgeDisplay list={LodgetDetailsQuery?.data} obtain={obtain}
                        selected={selected} control={control} token={token} key='display' />
            }
        }
        else {
            return <LodgeDisplay list={LodgetDetailsQuery?.data} obtain={obtain}
                selected={selected} control={control} token={token} key='display' />
        }
    }

    return (<>{LodgeListDisplay(control, selected)}</>)
}

export default ViewLodge