import * as React from 'react'
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';
import { getSADDetails } from '@api/Lodge';
import SADDisplay from './details/SADDisplay';
import SADEdit from './details/SADEdit';

function ViewSAD({ selected, control, token, obtain }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const SADDetailsQuery = useQuery({
        queryKey: ['SADDetails'],
        queryFn: async () => {
            const result = await getSADDetails(obtain.refNum)
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

        if (sel === 'Pre Alert') {
            switch (ctr) {
                case 'Edit':
                    return <SADEdit obtain={obtain} list={SADDetailsQuery?.data}
                        token={token} key='edit' />
                default:
                    return <SADDisplay list={SADDetailsQuery?.data}
                        selected={selected} control={control} token={token} key='display' />
            }
        }
        else {
            return <SADDisplay list={SADDetailsQuery?.data}
                selected={selected} control={control} token={token} key='display' />
        }
    }

    return (
        <>{LodgeListDisplay(control, selected)}</>
    )
}

export default ViewSAD