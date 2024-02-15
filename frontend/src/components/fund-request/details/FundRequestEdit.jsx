import * as React from 'react'
import {
  Divider, Input, Button, notification, Typography, Space, Card,
  Badge, Empty, Popconfirm, Tabs
} from 'antd'
import { submitRequest, submitCancellation } from '@api/FundRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toUpperText } from '@utils/Converter'
import { convertTime } from '@utils/Formats';
import { v4 as uuidv4 } from 'uuid';

import AvailableList from './fund-request-edit/AvailableList';
import PendingList from './fund-request-edit/PendingList';
import CompleteList from './fund-request-edit/CompleteList';
function FundRequestEdit({ obtain, list, selected, control, token }) {

  const [api, contextHolder] = notification.useNotification();
  const items = [
    {
      key: '1',
      label: 'Available',
      children: (<AvailableList obtain={obtain} list={list}
        selected={selected} control={control} token={token}
        accept={(result) => {
          api[result.status]({
            message: result.title,
            description: result.message
          });
        }} />),
    },
    {
      key: '2',
      label: 'Pending',
      children: (<PendingList obtain={obtain} list={list}
        selected={selected} control={control} token={token}
        submit={(result) => {
          api[result.status]({
            message: result.title,
            description: result.message
          });
        }} />),
    },
    {
      key: '3',
      label: 'Complete',
      children: (<CompleteList obtain={obtain} list={list}
        selected={selected} control={control} token={token} />),
    },
  ]

  return (
    <>
      {contextHolder}
      <Divider orientation='left'>Fund Request List</Divider>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  )
}

export default FundRequestEdit