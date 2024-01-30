import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import incomeJson from "../json/income.json";
import expensesJson from "../json/expenses.json";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/actions/toastAction";
import { showConfirm } from "@/store/actions/confirmAction";
import ReadCardDialog from "./ReadCardDialog";
import { createIncomeExpenses, getIncomeExpenseById } from "@/store/actions/incomeExpensesAction";
import { useRouter } from "next/router";
function ExcelReader() {
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) setIncomeList(incomeJson);
  }, [incomeJson, id]);
  useEffect(() => {
    if (!id) setExpensesList(expensesJson);
  }, [expensesJson, id]);
  const dispatch = useDispatch();
  const incomeExpenses = useSelector((state) => state.incomeExpenses.incomeExpenses);
  async function init() {
    if (id) dispatch(getIncomeExpenseById(id));
  }
  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (incomeExpenses) {
      const income = JSON.parse(incomeExpenses.income_form || "[]");
      const expense = JSON.parse(incomeExpenses.expense_form || "[]");
      setIncomeList(income);
      setExpensesList(expense);
      setDescription(incomeExpenses.description);
    }
  }, [incomeExpenses]);

  const [readCardManagerIsOpen, setReadCardManagerIsOpen] = React.useState(false);
  const [description, setDescription] = useState("");
  function handleConfirmSaveData() {
    if (!description) {
      dispatch(showToast("กรุณากรอกข้อมูลหมายเหตุทุกครั้งหากไม่มีหมายเหตุ กรุณาระบุ ขีด (-)", "bg-red-500", 5000));
      return;
    }
    dispatch(
      showConfirm("(สำคัญ : สำหรับผู้จัดการเท่านั้น หากไม่ใช่ทำรายการโดยผู้จัดการโปรดระบุสาเหตุ) ยืนยันการบันทึก, ในขั้นตอนต่อไปคุณจะต้องเสียบบัตรประจำตัวของผู้จัดการ", () => {
        setReadCardManagerIsOpen(true);
      })
    );
  }
  const sumAllBank = incomeList.reduce((acc, cur) => {
    return acc + Number(cur.bank);
  }, 0);
  const sumAllCashExpenses = expensesList.reduce((acc, cur) => {
    return acc + Number(cur.cash);
  }, 0);
  const sumAllCash = incomeList.reduce((acc, cur) => {
    return acc + Number(cur.cash);
  }, 0);
  async function checkManagerAndSave(citizen_id) {
    try {
      dispatch(
        createIncomeExpenses({ income_form: JSON.stringify(incomeList), expense_form: JSON.stringify(expensesList), expense: sumAllCashExpenses, income: sumAllBank + sumAllCash, description, citizen_id }, () => {
          router.push("/dashboard/income-expense");
        })
      );
    } catch (error) {
      dispatch(showToast(error, "bg-red-500", 3000));
    }
  }
  const noInputFromKeys = {
    ยอดยกมา: "ราย",
  };
  const placeholderFromKeys = [
    { financial_status: "รับหุ้นกู้ยืม", field: "memo", placeholder: "กรอกข้อมูลเช่น 1%" },
    { financial_status: "นำเงินฝากธนาคาร", field: "memo", placeholder: "กรอกข้อมูลธนาคารตรงนี้" },
    { financial_status: "รับดอกธนาคาร", field: "memo", placeholder: "กรอกข้อมูลธนาคารตรงนี้" },
    { financial_status: "ถอนเงินธนาคาร", field: "memo", placeholder: "กรอกข้อมูลธนาคารตรงนี้" },
    { financial_status: "", field: "memo", placeholder: "กรอกข้อมูลอื่นๆ หรือ ว่างไว้" },
    { item: "", field: "memo", placeholder: "กรอกข้อมูลอื่นๆ หรือ ว่างไว้" },
    { financial_status: "สถานะทางการเงิน ณ วันทำการ", field: "memo", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "สถานะทางการเงิน ณ วันทำการ", field: "bank", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "สถานะทางการเงิน ณ วันทำการ", field: "cash", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "สถานะทางการเงิน ณ วันทำการ", field: "no", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระเงินต้น", field: "memo", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระเงินต้น", field: "bank", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระเงินต้น", field: "cash", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระเงินต้น", field: "no", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระดอกเบี้ย", field: "memo", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระดอกเบี้ย", field: "bank", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระดอกเบี้ย", field: "cash", placeholder: "ไม่ต้องกรอก" },
    { financial_status: "รับชำระดอกเบี้ย", field: "no", placeholder: "ไม่ต้องกรอก" },
  ];
  const typeFromKeys = {
    date: "date",
    bank: "number",
    cash: "number",
    no: "number",
  };
  const titles = {
    financial_status: "สถานะการเงิน",
    date: "วันที่",
    no: "ราย",
    cash: "เงินสด",
    memo: "หมายเหตุ",
    bank: "ธนาคาร",
  };
  const allowDateOnly = [{ financial_status: "ยอดยกมา" }];

  const [page, setPage] = useState("income");
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{page === "income" ? "#ส่วนที่ 1 รายรับ" : "#ส่วนที่ 2 รายจ่าย"}</h3>
        <p>หากช่องไหนไม่มีข้อมูลโปรดเว้นว่างไว้ทุกกรณี</p>
      </div>
      <div className="mb-4">
        <Input variant="bordered" label="หมายเหตุ" placeholder="กรอกข้อมูล" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      {page === "income" ? (
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {/* Render table headers */}
              {incomeList.length > 0 &&
                Object.keys(incomeList[0]).map((header) => (
                  <th key={header} className="py-4">
                    {titles[header] || header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render table rows */}
            {incomeList.map((item, index) => (
              <tr key={index} className="cursor-pointer">
                {Object.values(item).map((val, idx) => (
                  <td key={idx} className="px-6 py-1 whitespace-nowrap hover:bg-gray-100">
                    {Object.keys(item)[idx] !== "financial_status" ? (
                      <>
                        <Input
                          disabled={noInputFromKeys[Object.keys(item)[idx]]}
                          type={typeFromKeys[Object.keys(item)[idx]] || "text"}
                          className="text-center"
                          variant="bordered"
                          size="sm"
                          placeholder={placeholderFromKeys.find((i) => Object.keys(item)[idx] === i.field && i.financial_status === item.financial_status)?.placeholder || ""}
                          value={val === "-" ? "" : val}
                          onChange={(e) => {
                            const newIncomeList = [...incomeList];
                            newIncomeList[index][Object.keys(item)[idx]] = e.target.value;
                            setIncomeList(newIncomeList);
                          }}
                        />
                      </>
                    ) : (
                      val
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {/* Render table headers */}
              {expensesList.length > 0 &&
                Object.keys(expensesList[0]).map((header) => (
                  <th key={header} className="py-4">
                    {titles[header] || header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render table rows */}
            {expensesList.map((item, index) => (
              <tr key={index} className="cursor-pointer">
                {Object.values(item).map((val, idx) => (
                  <td key={idx} className="px-6 py-1 whitespace-nowrap hover:bg-gray-100">
                    {Object.keys(item)[idx] !== "item" ? (
                      <>
                        <Input
                          disabled={noInputFromKeys[Object.keys(item)[idx]]}
                          type={typeFromKeys[Object.keys(item)[idx]] || "text"}
                          className="text-center"
                          variant="bordered"
                          size="sm"
                          placeholder={placeholderFromKeys.find((i) => Object.keys(item)[idx] === i.field && i.item === item.item)?.placeholder || ""}
                          value={val === "-" ? "" : val}
                          onChange={(e) => {
                            const newExpensesList = [...expensesList];
                            newExpensesList[index][Object.keys(item)[idx]] = e.target.value;
                            setExpensesList(newExpensesList);
                          }}
                        />
                      </>
                    ) : (
                      val
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-end gap-4">
        <div>
          ยอดรวมธนาคาร (รายรับ): <span className="text-xl font-bold">{sumAllBank}</span> บาท
        </div>
        <div>
          ยอดรวมเงินสด (รายรับ): <span className="text-xl font-bold">{sumAllCash}</span> บาท
        </div>
        <div className="text-red-600">
          ยอดรวมเงินสด (รายจ่าย): <span className="text-xl font-bold">{sumAllCashExpenses}</span> บาท
        </div>
      </div>
      <div className="flex justify-end gap-4 py-4">
        {page === "expenses" && (
          <>
            <Button onClick={() => setPage("income")}>
              <FaChevronLeft /> ย้อนกลับ (รายรับ)
            </Button>
            <Button color="success" className="text-white" onClick={() => handleConfirmSaveData()}>
              บันทึกรายการ
            </Button>
          </>
        )}
        {page === "income" && (
          <>
            <Button onClick={() => setPage("expenses")}>
              ต่อไป (รายจ่าย) <FaChevronRight />
            </Button>
          </>
        )}
      </div>
      <ReadCardDialog isOpen={readCardManagerIsOpen} onClose={() => setReadCardManagerIsOpen(false)} callback={(data) => checkManagerAndSave(data.citizen_id)} />
    </div>
  );
}

export default ExcelReader;
