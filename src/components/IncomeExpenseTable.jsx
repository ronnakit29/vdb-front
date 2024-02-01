import React from "react";
import TableComponent from "./TableComponent";
import Helper from "@/classes/Helper.class";
import { useDispatch } from "react-redux";
import { showConfirm } from "@/store/actions/confirmAction";
import { createIncomeExpenses, deleteIncomeExpenses, handleCancelIncomeExpense } from "@/store/actions/incomeExpensesAction";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { showToast } from "@/store/actions/toastAction";
import ReadCardDialog from "./ReadCardDialog";

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
    {
      key: "status",
      label: "สถานะ",
      format: ({ value }) => (value === "success" ? <span className="text-green-500">เสร็จสมบูรณ์</span> : value === "cancel" ? <span className="text-red-500">ยกเลิก</span> : <span className="text-yellow-500">รอดำเนินการ</span>),
    },
    {
      key: "action",
      label: "",
      format: ({ value, item }) =>
        item.status === "success" && (
          <Button size="sm" color="danger" onClick={() => handleCancel(item.id)}>
            ยกเลิก
          </Button>
        ),
    },
  ];
  const [currentDeleteId, setCurrentDeleteId] = React.useState(null);
  const [readCardManagerIsOpen, setReadCardManagerIsOpen] = React.useState(false);
  function handleCancel(id) {
    dispatch(
      showConfirm("ยืนยันการยกเลิกรายการ", () => {
        setCurrentDeleteId(id);
        setReadCardManagerIsOpen(true);
      })
    );
  }
  function handleConfirmSaveData() {
    const required = ["income", "expense", "withdraw_value", "description"];
    const check = required.every((i) => formData[i] !== "");
    if (!check) {
      dispatch(showToast("กรุณากรอกข้อมูลให้ครบถ้วน", "bg-red-500", 3000));
      return;
    }
    dispatch(
      showConfirm("(สำคัญ : สำหรับผู้จัดการเท่านั้น หากไม่ใช่ทำรายการโดยผู้จัดการโปรดระบุสาเหตุ) ยืนยันการบันทึก, ในขั้นตอนต่อไปคุณจะต้องเสียบบัตรประจำตัวของผู้จัดการ", () => {
        setReadCardManagerIsOpen(true);
      })
    );
  }
  async function checkManagerAndSave(citizen_id) {
    try {
      dispatch(
        handleCancelIncomeExpense(currentDeleteId, () => {
          onReload && onReload();
        })
      );
    } catch (error) {
      dispatch(showToast(error, "bg-red-500", 3000));
    }
  }
  return (
    <>
      <TableComponent columns={headers} rows={data} onReload={onReload} />
      <ReadCardDialog isOpen={readCardManagerIsOpen} onClose={() => setReadCardManagerIsOpen(false)} callback={(data) => checkManagerAndSave(data.citizen_id)} />
    </>
  );
}
