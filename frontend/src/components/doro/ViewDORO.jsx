import * as React from 'react'
import { getDORODetails } from '@api/DORO';
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';
import DORODisplay from './details/DORODisplay';
import DOROEdit from './details/DOROEdit';
function ViewDORO({ obtain, control, selected, token }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const DORODetailsQuery = useQuery({
        queryKey: ['DORODetails'],
        queryFn: async () => {
            const result = await getDORODetails(obtain.refNum)
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

    function PortalDetailsDisplay(ctr, sel) {
        if (sel === 'DORO') {
            switch (ctr) {
                case 'Edit':
                    return <DOROEdit obtain={obtain} list={DORODetailsQuery?.data}
                        token={token} key='edit' />
                default:
                    return <DORODisplay list={DORODetailsQuery?.data} obtain={obtain}
                        selected={selected} control={control} token={token} key='display' />
            }
        }
        else {
            return <DORODisplay list={DORODetailsQuery?.data} obtain={obtain}
                selected={selected} control={control} token={token} key='display' />
        }
    }

    return (<>{PortalDetailsDisplay(control, selected)}</>)
}

export default ViewDORO