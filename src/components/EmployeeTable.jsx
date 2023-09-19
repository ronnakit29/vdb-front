import React from 'react'
import TableComponent from './TableComponent'

export default function EmployeeTable({ data, onReload }) {
    const headers = [
        {
            key: "id",
            label: "ID"
        },
        {
          key: "fullname",
          label: "ชื่อ-นามสกุล"
        },
        {
          key: "citizen_id",
          label: "เลขบัตรประชาชน",
          format: ({ value }) => value || "-"
        },
        {
          key: "tel",
          label: "เบอร์โทร",
          format: ({ value }) => value || "-"
        },
        {
          key: "created_at",
          label: "วันที่เพิ่ม"
        },
        {
          key: "role",
          label: "ตำแหน่ง"
        }
    ]
  return (
    <TableComponent columns={headers} rows={data || []} onReload={onReload} />
  )
}
