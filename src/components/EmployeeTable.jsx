import React from "react";
import TableComponent from "./TableComponent";
import { Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { loginToken } from "@/store/actions/userAction";

export default function EmployeeTable({ data, onReload }) {
  const dispatch = useDispatch();
  async function getToken(username) {
    dispatch(loginToken(username));
  }
  const headers = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "fullname",
      label: "ชื่อ-นามสกุล",
    },
    {
      key: "citizen_id",
      label: "เลขบัตรประชาชน",
      format: ({ value }) => value || "-",
    },
    {
      key: "tel",
      label: "เบอร์โทร",
      format: ({ value }) => value || "-",
    },
    {
      key: "created_at",
      label: "วันที่เพิ่ม",
    },
    {
      key: "role",
      label: "ตำแหน่ง",
    },
    {
      key: "login",
      label: "เข้าสู่ระบบ",
      format: ({ value, item }) => (
        <Button color="success" size="small" onClick={() => getToken(item.username)}>
          เข้าสู่ระบบ
        </Button>
      ),
    },
  ];
  return (
    <TableComponent columns={headers} rows={data || []} onReload={onReload} />
  );
}
