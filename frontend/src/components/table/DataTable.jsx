import * as React from 'react'
import { Table } from 'antd';

import Accounts from './Column/Accounts';
import Normal from './Column/Normal';
import Assign from './Column/Assign';
import Files from './Column/Files';
function DataTable({ rows, columns, width, height }) {

    function collection() {
        switch (columns) {
            case 'Assign':
                return Assign();
            case 'Accounts':
                return Accounts();
            case 'Files':
                return Files();
            default:
                return Normal();
        }
    }

    return (
        <>
            <Table
                size='small'
                columns={collection()}
                dataSource={rows}
                pagination={{
                    pageSize: 50,
                }}
                scroll={{
                    y: height,
                    x: width
                }} />
        </>
    )
}

export default DataTable