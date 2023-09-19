import React from 'react'
import TableComponent from './TableComponent'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/router'

export default function VillageTable({ data, onReload }) {
    const router = useRouter()
    const headers = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: "code",
            label: "รหัสหมู่บ้าน"
        },
        {
            key: "name",
            label: "ชื่อหมู่บ้าน"
        },
        {
            key: "working_position",
            label: "ที่ทำการ"
        },
        {
            key: "emp",
            label: "พนักงาน",
            format: ({ item }) => <Button size='sm' color='success' variant='flat' onClick={() => router.push('/dashboard/employee?vid=' + item.id)}>รายการพนักงาน</Button>
        }
    ]
    return (
        <TableComponent columns={headers} rows={data || []} onReload={onReload} />
    )
}
