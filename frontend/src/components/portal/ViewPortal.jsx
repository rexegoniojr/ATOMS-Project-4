import * as React from 'react'
import { getPortalDetails } from '@api/Portal';
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';
import PortalDisplay from './details/PortalDisplay';
import PortalEdit from './details/PortalEdit';
function ViewPortal({ obtain, control, selected, token }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const PortalDetailsQuery = useQuery({
        queryKey: ['PortalDetails'],
        queryFn: async () => {
            const result = await getPortalDetails(obtain.refNum)
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
        if (sel === 'Portal') {
            switch (ctr) {
                case 'Edit':
                    return <PortalEdit obtain={obtain} list={PortalDetailsQuery?.data}
                        token={token} key='edit' />
                default:
                    return <PortalDisplay list={PortalDetailsQuery?.data} obtain={obtain}
                        selected={selected} control={control} token={token} key='display' />
            }
        }
        else {
            return <PortalDisplay list={PortalDetailsQuery?.data} obtain={obtain}
                selected={selected} control={control} token={token} key='display' />
        }
    }

    return (<>{PortalDetailsDisplay(control, selected)}</>)
}

export default ViewPortal