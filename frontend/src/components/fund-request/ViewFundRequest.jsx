import * as React from 'react'
import { getFundRequestDetails } from '@api/FundRequest';
import { useQuery } from '@tanstack/react-query';
import { viewData } from '@hooks/ModalController';

import FundRequestDisplay from './details/FundRequestDisplay';
import FundRequestEdit from './details/FundRequestEdit';
import FundRequestRQ from './details/FundRequestRQ';
function ViewFundRequest({ obtain, control, selected, token }) {

    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const FundRequestDetailsQuery = useQuery({
        queryKey: ['FundRequestDetails'],
        queryFn: async () => {
            const result = await getFundRequestDetails(obtain.refNum)
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

    function FundRequestListDisplay(ctr, sel) {

        if (sel === 'Fund Request') {
            switch (ctr) {
                case 'Edit':
                    return <FundRequestEdit obtain={obtain} list={FundRequestDetailsQuery?.data}
                        selected={selected} control={control} token={token} key='edit' />
                default:
                    return <FundRequestDisplay list={FundRequestDetailsQuery?.data} obtain={obtain}
                        selected={selected} control={control} token={token} key='display' />
            }
        }
        else if (sel === 'Pre Alert') {
            switch (ctr) {
                case 'Edit':
                    return <FundRequestRQ obtain={obtain} list={FundRequestDetailsQuery?.data}
                        selected={selected} control={control} token={token} key='edit' />
                default:
                    return <FundRequestDisplay list={FundRequestDetailsQuery?.data} obtain={obtain}
                        selected={selected} control={control} token={token} key='display' />
            }
        }
        else {
            return <FundRequestDisplay list={FundRequestDetailsQuery?.data} obtain={obtain}
                selected={selected} control={control} token={token} key='display' />
        }
    }

    return (<>{FundRequestListDisplay(control, selected)}</>)
}

export default ViewFundRequest