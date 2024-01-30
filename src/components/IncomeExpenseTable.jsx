import React from "react";
import TableComponent from "./TableComponent";
import Helper from "@/classes/Helper.class";
import { useDispatch } from "react-redux";
import { showConfirm } from "@/store/actions/confirmAction";
import { deleteIncomeExpenses } from "@/store/actions/incomeExpensesAction";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function IncomeExpenseTable({ data, onReload }) {
  const dispatch = useDispatch();
  function handleDeleteIncomeExpenses(id) {
    dispatch(
      showConfirm("ยืนยันการลบรายการ", () => {
        dispatch(
          deleteIncomeExpenses(id, () => {
            onReload && onReload();
          })
        );
      })
    );
  }
  const router = useRouter();
  const headers = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "see",
      label: "",
      format: ({ item }) => (
        <Button size="sm" color="primary" onClick={() => router.push(`/dashboard/income-expense/create?id=${item.id}`)}>
          รายละเอียด
        </Button>
      ),
    },
    {
      key: "income",
      label: "รายรับ",
      format: ({ value }) => Helper.formatNumber(value),
    },
    {
      key: "expense",
      label: "รายจ่าย",
      format: ({ value }) => Helper.formatNumber(value),
    },
    {
      key: "total",
      label: "คงเหลือ",
      format: ({ value, item }) => Helper.formatNumber(item.income - item.expense),
    },
    {
      key: "description",
      label: "หมายเหตุ",
    },
    {
      key: "created_at",
      label: "วันที่",
      format: ({ value }) => Helper.formatDate(value),
    },
    {
      key: "manager_name",
      label: "ผู้จัดการ",
    },
    // {
    //   key: 'delete',
    //   label: '',
    //   format: ({ item }) => <Button size='sm' color='danger' variant='flat' onClick={() => handleDeleteIncomeExpenses(item.id)}>ลบ</Button>
    // }
  ];
  return <TableComponent columns={headers} rows={data} onReload={onReload} />;
}
