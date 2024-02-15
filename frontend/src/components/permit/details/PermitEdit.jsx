import * as React from 'react'
import { notification } from 'antd'
import { authHolder } from '@hooks/AccountController';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from '@tanstack/react-query';
import { getAssignedPermitToEmployee } from '@api/Permit';
import { viewData } from '@hooks/ModalController';
import { v4 as uuidv4 } from 'uuid';

import PermitEditLayout from './permit-edit/PermitEditLayout';

function PermitEdit({ obtain }) {

    const [api, contextHolder] = notification.useNotification();
    const getModalStatusView = viewData((state) => state.modalStatus)
    const setRefresher = viewData((state) => state.storeValue)
    const getRefresher = viewData((state) => state.refreshValue)
    const getUserToken = authHolder((state) => state.account_details)
    const token = jwtDecode(getUserToken)

    const AssignedPermitDetailsEmployeeQuery = useQuery({
        queryKey: ['AssignedPermitDetailsEmployee'],
        queryFn: async () => {
            const result = await getAssignedPermitToEmployee(obtain.refNum, token.userKey)
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
    let today = new Date()
    return (
        <>
            {contextHolder}
            <div className='container overflow-y-auto h-[465px]' key={uuidv4()}>
                {
                    AssignedPermitDetailsEmployeeQuery.data?.map((x) => (
                        <div className='pt-2 w-[98.5%]' key={uuidv4()}>
                            <PermitEditLayout data={x} DAP={
                                x.dateOfAppPermit !== '' ? x.dateOfAppPermit : today
                            }
                                DSP={
                                    x.dateSecPermit !== '' ? x.dateSecPermit : today
                                }
                                updateResult={(result) => {
                                    api[result.status]({
                                        message: result.title,
                                        description: result.message
                                    });
                                }} />
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default PermitEdit