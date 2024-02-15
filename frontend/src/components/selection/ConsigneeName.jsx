import * as React from 'react'
import { Select, Space, Input, Divider, Button, Tooltip, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { getAllConsigneeName, addConsignee } from '@api/Selection'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { authHolder } from '@hooks/AccountController';

function ConsigneeName({ handler, data ,disabled}) {

    const [api, contextHolder] = notification.useNotification();
    const getUserToken = authHolder((state) => state.account_details)
    const queryClient = new QueryClient()
    const ConsigneeQuery = useQuery({
        queryKey: ['ConsigneeName'],
        queryFn: async () => {
            const result = await getAllConsigneeName()
            return result
        },
        enabled: false
    })

    const [getConsignee, setConsignee] = React.useState()
    function onConsigneeChange(value) {
        setConsignee(value)
    }

    const addConsigneeMutation = useMutation({
        mutationFn: async () => {
            const cn = {
                consigneeName: getConsignee,
                userKey: getUserToken.userKey
            }
            const response = await addConsignee(cn)
            setConsignee('')
            const { status, title, message } = response
            api[status]({
                message: title,
                description: message
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['ConsigneeName'], { exact: true })
            ConsigneeQuery.refetch()
        }
    })

    function handleAddConsignee(e) {
        e.preventDefault()
        addConsigneeMutation.mutate('New_Consignee')
        ConsigneeQuery.refetch()
    }

    function handleClick(e) {
        e.preventDefault()
        ConsigneeQuery.refetch()
    }


    return (
        <>
            {contextHolder}
            <Select
                name='consigneeName'
                onChange={handler}
                onClick={handleClick}
                value={data}
                allowClear
                showSearch
                placeholder='Consignee Name'
                style={{ width: '100%' }}
                disabled={disabled}
                dropdownRender={(menu) => (
                    <>
                        {menu}
                        <Divider
                            style={{
                                margin: '8px 0',
                            }}
                        />
                        <Space>
                            <Tooltip placement='bottom' title={getConsignee}>
                                <Input size='small'
                                    value={getConsignee}
                                    onChange={(e) => {
                                        onConsigneeChange(e.target.value.toLocaleUpperCase())
                                    }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                            </Tooltip>
                            <Button type="text" size='small' icon={<PlusOutlined />}
                                onClick={handleAddConsignee}
                                loading={addConsigneeMutation.isLoading}
                                disabled={!getConsignee ? true : false}>
                                Add item
                            </Button>
                        </Space>
                    </>
                )}
                options={ConsigneeQuery.data?.sort().map((x) => ({
                    label: x.consigneeName,
                    value: x.consigneeName,
                }))}
            />
        </>
    )
}


export default ConsigneeName