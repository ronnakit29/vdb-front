import React from 'react'
import TableComponent from './TableComponent'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { deleteVillage, getVillage } from '@/store/actions/villageAction'
import { showDialog } from '@/store/actions/dialogAction'
import { showConfirm } from '@/store/actions/confirmAction'

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
        },
        {
            key: "action",
            label: "",
            format: ({ item }) => <div className="flex gap-2">
                <Button size='sm' className='text-white' color='success' onClick={() => handleOpenVillageDialog(item.id)}>แก้ไข</Button>
                <Button size='sm' className='text-white' color='danger' onClick={()=> handleDeleteVillage(item.id)}>ลบ</Button>
            </div>
        }
    ]
    const dispatch = useDispatch()
    function handleOpenVillageDialog(id) {
        dispatch(getVillage(id))
        dispatch(showDialog("village", "แก้ไขหมู่บ้าน"))
    }
    function handleDeleteVillage(id) {
        dispatch(showConfirm("ยืนยันการลบหมู่บ้าน", ()=> {
            dispatch(deleteVillage(id))
        }))
    }
    return (
        <TableComponent columns={headers} rows={data || []} onReload={onReload} />
    )
}
