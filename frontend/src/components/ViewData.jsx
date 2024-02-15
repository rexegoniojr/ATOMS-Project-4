import * as React from 'react'
import { Tabs, Modal } from 'antd';
import { viewData } from '@hooks/ModalController';
import { useQueryClient } from '@tanstack/react-query';
import ViewPreAlert from '@components/pre-alert/ViewPreAlert';
import ViewPermit from '@components/permit/ViewPermit';
import ViewCDT from '@components/cdt/ViewCDT';
import ViewPRESAD from '@components/presad/ViewPRESAD';
import ViewLodge from '@components/lodge/ViewLodge';
import ViewPortal from '@components/portal/ViewPortal';
import ViewFundRequest from '@components/fund-request/ViewFundRequest';
import ViewDORO from '@components/doro/ViewDORO';
import ViewRE from '@components/re/ViewRE';
import ViewFiles from '@components/files/ViewFiles';
import Under from './Under';
function ViewData({ showModal, closeModal, token, display, selected }) {

    const queryClient = useQueryClient()
    const getDataCollection = viewData((state) => state.dataCollection)
    const setRefresher = viewData((state) => state.storeValue)
    const items = [
        {
            key: '1',
            label: 'Pre Alert',
            children: <ViewPreAlert obtain={getDataCollection} token={token} selected={selected} />,
        },
        {
            key: '2',
            label: 'Permit',
            children: <ViewPermit obtain={getDataCollection} control={display} selected={selected} />,
        },
        {
            key: '3',
            label: 'CDT',
            children: <ViewCDT obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
        {
            key: '4',
            label: 'PRESAD',
            children: <ViewPRESAD obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
        {
            key: '5',
            label: 'Lodgement',
            children: <ViewLodge obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
        {
            key: '6',
            label: 'Portal',
            children: <ViewPortal obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
        {
            key: '7',
            label: 'Fund Request',
            children: <ViewFundRequest obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
        {
            key: '8',
            label: 'DO/RO',
            children: <ViewDORO obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
        {
            key: '9',
            label: 'Re-Entry',
            children: <ViewRE obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
        {
            key: '10',
            label: 'Files',
            children: <ViewFiles obtain={getDataCollection} token={token}
                control={display} selected={selected} />,
        },
    ]

    function selectedTab(e) {
        setRefresher(0)
        /*if (e === 1) {
            queryClient.invalidateQueries({ queryKey: ['PreAlertDetails'] }, { exact: true })
        }
        else if (e === 2) {
            queryClient.invalidateQueries({ queryKey: ['PermitDetails'] }, { exact: true })
        }
        else if (e === 3) {
            queryClient.invalidateQueries({ queryKey: ['TurnOverToDeclarantDetails'] }, { exact: true })
            queryClient.invalidateQueries({ queryKey: ['ApprovedCDTDetails'] }, { exact: true })
            queryClient.invalidateQueries({ queryKey: ['CDTAssignedUserDetails'] }, { exact: true })
        }
        else if (e === 4) {
            queryClient.invalidateQueries({ queryKey: ['ApprovedCDTForTurnOverDetails'] }, { exact: true })
            queryClient.invalidateQueries({ queryKey: ['PeerCheckerDetails'] }, { exact: true })
            queryClient.invalidateQueries({ queryKey: ['PRESADDetails'] }, { exact: true })
        }
        else if (e === 5) {
            queryClient.invalidateQueries({ queryKey: ['LodgetDetails'] }, { exact: true })
            queryClient.invalidateQueries({ queryKey: ['SADDetails'] }, { exact: true })
        }
        else if (e === 6) {
            queryClient.invalidateQueries({ queryKey: ['PortalDetails'] }, { exact: true })
        }
        else if (e === 7) {
            queryClient.invalidateQueries({ queryKey: ['FundRequestDetails'] }, { exact: true })
        }
        else if (e === 8) {
            queryClient.invalidateQueries({ queryKey: ['DORODetails'] }, { exact: true })
        }
        else {

        }*/
    }

    return (
        <>
            <Modal
                title={<h5>Sequence of Shipment:&nbsp;
                    <span className='text-primary'>{("000" + getDataCollection.sos).slice(-3)}</span></h5>}
                centered
                open={showModal}
                onCancel={closeModal}
                width={900}
                maskClosable={false}
                footer={false} >
                <div className="h-[500px]">
                    <Tabs defaultActiveKey="1" onTabClick={selectedTab} items={items} tabPosition='left' />
                </div>
            </Modal>
        </>
    )
}

export default ViewData