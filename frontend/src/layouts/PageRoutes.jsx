import * as React from 'react'
import { PageKey } from '@hooks/PageController';

import {
    FileDoneOutlined, PaperClipOutlined, FileSyncOutlined, SyncOutlined, AlertOutlined, MonitorOutlined,
    FileTextOutlined, UserAddOutlined, AuditOutlined, FileOutlined, SolutionOutlined, CloudServerOutlined
} from '@ant-design/icons';

function PageRoutes() {

    const getPageAccess = PageKey((state) => state.pageAccess)
    let PageAccess = []
    getPageAccess.split(',').map((x) => {
        if (x === 'Complete List') {
            PageAccess.push({
                key: '/Atoms/Complete-List',
                label: 'Complete List',
                icon: <FileTextOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Assign Declarant') {
            PageAccess.push({
                key: '/Atoms/Assign-Declarant',
                label: 'Assign Declarant',
                icon: <PaperClipOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Assign Permit') {
            PageAccess.push({
                key: '/Atoms/Assign-Permit',
                label: 'Assign Permit',
                icon: <SolutionOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'CDT') {
            PageAccess.push({
                key: '/Atoms/CDT',
                label: 'CDT',
                icon: <FileSyncOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'DO-RO Processing') {
            PageAccess.push({
                key: '/Atoms/DO-RO',
                label: 'DO/RO Processing',
                icon: <SyncOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Fund Request') {
            PageAccess.push({
                key: '/Atoms/Fund-Request',
                label: 'Fund Request',
                icon: <MonitorOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Lodgement') {
            PageAccess.push({
                key: '/Atoms/Lodgement',
                label: 'Lodgement',
                icon: <AuditOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'PRESAD') {
            PageAccess.push({
                key: '/Atoms/PRESAD',
                label: 'PRESAD',
                icon: <FileOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Peer Checker') {
            PageAccess.push({
                key: '/Atoms/Peer-Checker',
                label: 'Peer Checker',
                icon: <FileDoneOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Permit') {
            PageAccess.push({
                key: '/Atoms/Permit',
                label: 'Permit',
                icon: <FileTextOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Portal') {
            PageAccess.push({
                key: '/Atoms/Portal',
                label: 'Portal',
                icon: <CloudServerOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Pre Alert') {
            PageAccess.push({
                key: '/Atoms/Pre-Alert',
                label: 'Pre Alert',
                icon: <AlertOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else if (x === 'Re-Entry') {
            PageAccess.push({
                key: '/Atoms/Re-Entry',
                label: 'Re-Entry',
                icon: <FileTextOutlined style={{ fontSize: '18px' }} />,
            })
        }
        else {
            PageAccess.push({
                key: '/Atoms/Account-List',
                label: 'Account List',
                icon: <UserAddOutlined style={{ fontSize: '18px' }} />,
            })
        }
    })
    return PageAccess;
}


export default PageRoutes