import React from 'react'
import TableComponent from './TableComponent'
import Helper from '@/classes/Helper.class'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import moment from 'moment'

export default function PromiseListTable({ data, onReload }) {
    const typeTxt = {
        short: "ระยะสั้น",
        long: "ระยะยาว",
        business: "ฉุกเฉิน/ธุรกิจ"
    }
    const router = useRouter()
    const headers = [
        {
            key: "timestamp",
            label: "วันเวลา",
            format: ({ value }) => moment(value).format("DD/MM/YYYY HH:mm:ss")
        },
        {
            key: 'id',
            label: 'หมายเลขสัญญา',
            format: ({ value, item }) => <div className="flex flex-col">
                <div>{value}/{item.promise_year}</div>
            </div>
        },
        {
            key: 'start_date_end',
            label: 'วันที่เริ่มสัญญา',
            format: ({ value, item }) => <div className='flex flex-col'>
                <div className='font-semibold'>เริ่ม: {moment(item.start_date).format("DD/MM/YYYY")}</div>
                <div className='text-green-600'>สิ้นสุด: {moment(item.expired_date).format("DD/MM/YYYY")}</div>
            </div>
        },
        {
            key: 'status',
            label: 'สถานะ',
            format: ({ value }) => value === 1 ? <span className="text-green-500">อยู่ในสัญญา</span> : value === 0 ? <span className="text-yellow-500">สัญญาไม่สมบูรณ์</span> : value === 2 ? <span className="text-red-500">สัญญาสิ้นสุด</span> : <span className="text-gray-500">ยกเลิกสัญญา</span>
        },

        {
            key: 'x',
            label: 'ชื่อผู้กู้',
            format: ({ value, item }) => <div className="flex flex-col">
                <div>{item.title_name + item.first_name + " " + item.last_name}</div>
                <div className="text-gray-500">{item.citizen_id}</div>
            </div>
        },
        {
            key: 'type',
            label: 'ประเภทสัญญา',
            format: ({ value }) => typeTxt[value]
        },
        {
            key: 'amount',
            label: 'จำนวนเงิน',
            format: ({ value }) => Helper.formatNumber(value)
        },
        {
            key: 'interest',
            label: 'อัตราดอกเบี้ย',
            format: ({ value }) => Helper.formatNumber(value) + "%"
        },
        {
            key: 'xinterest',
            label: 'ดอกเบี้ยต่อเดือน',
            format: ({ value, item }) => Helper.formatNumber(item.amount * item.interest / 100)
        },
        {
            key: 'period',
            label: 'ระยะเวลาผ่อนชำระ',
            format: ({ value }) => Helper.formatNumber(value) + " งวด"
        },
        {
            key: 'action',
            label: '',
            format: ({ item }) => <Button color='primary' size='sm' onClick={() => router.push(`/dashboard/promise-final?groupId=${item.group_id}`)}>ดูรายละเอียด</Button>
        }

    ]
    return (
        <TableComponent columns={headers} rows={data || []} onReload={onReload}></TableComponent>
    )
}
