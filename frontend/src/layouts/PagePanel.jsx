import * as React from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import Logo_large from '@assets/logo_large.gif'
import Logo_small from '@assets/logo_small.gif'
import { PageKey } from '@hooks/PageController';
import PageRoutes from '@layouts/PageRoutes';
import { toZip } from '@utils/Converter';
import { reloadAuth } from "@hooks/AccountController";
import AccountSettings from '@components/account/AccountSettings';
const { Header, Sider, Content } = Layout;

function PagePanel() {

    const [collapsed, setCollapsed] = React.useState(false);
    const { token: { colorBgContainer } } = theme.useToken();
    const getKeyPage = PageKey((state) => state.key)
    const setKeyPage = PageKey((state) => state.setKey)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const setRefresher = reloadAuth((state) => state.storeValue)

    return (
        <Layout className='full-screen'>
            <Sider className='overflow-y-auto' width={250}
                trigger={null} collapsible collapsed={collapsed}>
                {collapsed
                    ? (<>
                        <img src={Logo_small} alt="logo" className='px-3' />
                    </>)
                    : (<>
                        <img src={Logo_large} alt="logo" className='px-4' />
                    </>)}
                <Menu className='px-2'
                    onClick={({ key }) => {
                        setKeyPage(key)
                        localStorage.setItem('PKH', toZip(key))
                        navigate(key)
                        setRefresher(0)
                        if (key === '/Atoms/Pre-Alert') {
                            queryClient.invalidateQueries({ queryKey: ['PreAlertList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Assign-Permit') {
                            queryClient.invalidateQueries({ queryKey: ['PreAlertWithPermitList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Permit') {
                            queryClient.invalidateQueries({ queryKey: ['PreAlertWithPermitAssigned'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Assign-Declarant') {
                            queryClient.invalidateQueries({ queryKey: ['ForCDTList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/CDT') {
                            queryClient.invalidateQueries({ queryKey: ['AssignedCDTListToUser'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/PRESAD') {
                            queryClient.invalidateQueries({ queryKey: ['AssignedPRESADListToUser'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Peer-Checker') {
                            queryClient.invalidateQueries({ queryKey: ['AssignedPeerCheckerListToUser'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Lodgement') {
                            queryClient.invalidateQueries({ queryKey: ['LodgeList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Portal') {
                            queryClient.invalidateQueries({ queryKey: ['AvailablePortalList'] },
                                { exact: true })
                            queryClient.invalidateQueries({ queryKey: ['PendingPortalList'] },
                                { exact: true })
                            queryClient.invalidateQueries({ queryKey: ['CompletePortalList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Fund-Request') {
                            queryClient.invalidateQueries({ queryKey: ['AvailableFundRequestList'] },
                                { exact: true })
                            queryClient.invalidateQueries({ queryKey: ['PendingFundRequestList'] },
                                { exact: true })
                            queryClient.invalidateQueries({ queryKey: ['CompleteFundRequestList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Lodgement') {
                            queryClient.invalidateQueries({ queryKey: ['LodgeList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Re-Entry') {
                            queryClient.invalidateQueries({ queryKey: ['AvailableREList'] },
                                { exact: true })
                            queryClient.invalidateQueries({ queryKey: ['CompleteREList'] },
                                { exact: true })
                            queryClient.invalidateQueries({ queryKey: ['PendingREList'] },
                                { exact: true })
                        }
                        else if (key === '/Atoms/Complete-List') {
                            queryClient.invalidateQueries({ queryKey: ['CompleteDataList'] },
                                { exact: true })
                        }
                        else {
                            queryClient.invalidateQueries({ queryKey: ['AccountList'] },
                                { exact: true })
                        }
                    }}
                    theme='dark'
                    mode="inline"
                    defaultSelectedKeys={[getKeyPage]}
                    items={PageRoutes()?.map((x) => ({
                        key: x.key,
                        label: x.label,
                        icon: x.icon,
                        children: x.children,
                    }))}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        height: 62,
                        paddingLeft: 5,
                        paddingBottom: 10,
                        background: colorBgContainer,
                    }}
                >
                    <div className='flex flex-row'>
                        <div>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 50,
                                    height: 50,
                                }}
                            />
                        </div>
                        <div className='mx-4'>Automated Tracking Operations &amp; Monitoring System</div>
                        <div className='absolute top-0 right-4'>
                            <AccountSettings />
                        </div>
                    </div>
                </Header>
                <Content className='overflow-y-auto pb-2'
                    style={{
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default PagePanel