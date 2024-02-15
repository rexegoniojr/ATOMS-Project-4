import * as React from 'react'
import { getREDetails } from '@api/RE';
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';
import REDisplay from './details/REDisplay';
import REEdit from './details/REEdit';

function ViewRE({ obtain, control, selected, token }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const REDetailsQuery = useQuery({
        queryKey: ['REDetails'],
        queryFn: async () => {
            const result = await getREDetails(obtain.refNum)
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

    function REDetailsDisplay(ctr, sel) {
        if (sel === 'RE') {
            switch (ctr) {
                case 'Edit':
                    return <REEdit obtain={obtain} list={REDetailsQuery?.data}
                        token={token} key='edit' />
                default:
                    return <REDisplay list={REDetailsQuery?.data} obtain={obtain}
                        selected={selected} control={control} token={token} key='display' />
            }
        }
        else {
            return <REDisplay list={REDetailsQuery?.data} obtain={obtain}
                selected={selected} control={control} token={token} key='display' />
        }
    }

    return (<>{REDetailsDisplay(control, selected)}</>)
}

export default ViewRE