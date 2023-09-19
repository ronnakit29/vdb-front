import React from 'react'
import TableComponent from './TableComponent'
import Helper from '@/classes/Helper.class'

export default function MemberTable({ data, onReload }) {
    const headers = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'citizen_id',
            label: 'เลขประจำตัวประชาชน'
        },
        {
            key: "title_name",
            label: "คำนำหน้า",
            format: ({ value, item }) => <div className="flex flex-col">
                <div>{value}</div>
                <div className='text-sm text-gray-500/80'>{item.en_title_name || "-"}</div>
            </div>
        },
        {
            key: "first_name",
            label: "ชื่อ",
            format: ({ value, item }) => <div className="flex flex-col">
                <div>{value}</div>
                <div className='text-sm text-gray-500/80'>{item.en_first_name || "-"}</div>
            </div>
        },
        {
            key: "last_name",
            label: "ชื่อ",
            format: ({ value, item }) => <div className="flex flex-col">
                <div>{value}</div>
                <div className='text-sm text-gray-500/80'>{item.en_last_name || "-"}</div>
            </div>
        },
        {
            key: 'address',
            label: 'ที่อยู่',
        },
        {
            key: 'created_at',
            label: 'วันที่เข้าระบบ',
            format: ({ value }) => Helper.formatDate(value)
        }
    ]
    return (
        <TableComponent
            columns={headers}
            rows={data || []}
            onReload={onReload}
        ></TableComponent>
    )
}
