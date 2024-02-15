import { Navigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { VerifyAccount } from '@api/Accounts';
import { reloadAuth } from "@hooks/AccountController";
import { toUnzip } from "@utils/Converter";

export const AuthenticateRoute = ({ children }) => {

    const setRefresher = reloadAuth((state) => state.storeValue)
    const getRefresher = reloadAuth((state) => state.refreshValue)
    
    const VerifyAccountQuery = useQuery({
        queryKey: ['VerifyAccount'],
        queryFn: async () => {
            const result = await VerifyAccount()
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
        enabled: true,
        retryDelay: 1000,
    })

    if (VerifyAccountQuery.data?.response === 'unauthorized') {
        return <Navigate to={'/unauthorized'} replace={true} />
    }

    if (VerifyAccountQuery.data?.response === 'expired') {
        return <Navigate to={'/token-expired'} replace={true} />
    }

    return children
}

export const VerifyToken = ({ children }) => {
    if (localStorage.getItem('PKH')) {
        return <Navigate to={toUnzip(localStorage.getItem('PKH'))} replace={true} />
    }
    else { <Navigate to={'/'} replace={true} /> }

    return children
}