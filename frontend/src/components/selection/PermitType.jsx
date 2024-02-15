import * as React from 'react'
import { Select, Space, Input, Divider, Button, notification, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { getAllPermitTypes, addPermitType } from '@api/Selection';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { authHolder } from '@hooks/AccountController';

function PermitType({ handler, show, data }) {
    
    const [api, contextHolder] = notification.useNotification();
    const getUserToken = authHolder((state) => state.account_details)
    const queryClient = new QueryClient()
    const PermitQuery = useQuery({
        queryKey: ['permitType'],
        queryFn: async () => {
            const result = await getAllPermitTypes()
            return result
        },
        enabled: false
    })

    const [getTypeOfPermit, setTypeOfPermit] = React.useState()
    function onPermitChange(value) {
        setTypeOfPermit(value)
    }

    const addPermitMutation = useMutation({
        mutationFn: async () => {
            const permit = {
                typeOfPermit: getTypeOfPermit,
                userKey: getUserToken.userKey
            }
            const response = await addPermitType(permit)
            setTypeOfPermit('')
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['permitType'], { exact: true })
            PermitQuery.refetch()
        }
    })

    function handleAddPermit(e) {
        e.preventDefault()
        addPermitMutation.mutate('New_Permit')
        PermitQuery.refetch()
    }

    function handleClick(e) {
        e.preventDefault()
        PermitQuery.refetch()
    }

    return (
        <>
            {contextHolder}
            <Select
                hidden={show}
                name='typeOfPermit'
                onChange={handler}
                onClick={handleClick}
                value={data}
                mode='multiple'
                allowClear
                placeholder='Type of Permit'
                style={{ width: '100%' }}
                dropdownRender={(menu) => (
                    <>
                        {menu}
                        <Divider
                            style={{
                                margin: '8px 0',
                            }}
                        />
                        <Space>
                            <Tooltip placement='bottom' title={getTypeOfPermit}>
                                <Input size='small'
                                    value={getTypeOfPermit}
                                    onChange={(e) => {
                                        onPermitChange(e.target.value.toLocaleUpperCase())
                                    }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                            </Tooltip>
                            <Button type="text" size='small' icon={<PlusOutlined />}
                                onClick={handleAddPermit} disabled={!getTypeOfPermit ? true : false}>
                                Add item
                            </Button>
                        </Space>
                    </>
                )}
                options={PermitQuery.data?.sort().map((x) => ({
                    label: x.typeOfPermit,
                    value: x.typeOfPermit,
                }))}
            />
        </>
    )
}

export default PermitType