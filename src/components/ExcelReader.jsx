import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import incomeJson from "../json/income.json";
import expensesJson from "../json/expenses.json";
import financialStatusJson from "../json/financial_status.json";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/actions/toastAction";
import { showConfirm } from "@/store/actions/confirmAction";
import ReadCardDialog from "./ReadCardDialog";
import { createIncomeExpenses, getIncomeExpenseById } from "@/store/actions/incomeExpensesAction";
import { useRouter } from "next/router";
import { setIncomeExpenses } from "@/store/slices/incomeExpensesSlice";
function ExcelReader() {
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [financialStatusList, setFinancialStatusList] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) setIncomeList(incomeJson);
  }, [incomeJson, id]);
  useEffect(() => {
    if (!id) setExpensesList(expensesJson);
  }, [expensesJson, id]);
  useEffect(() => {
    if (!id) setFinancialStatusList(financialStatusJson);
  }, [financialStatusJson, id]);

  const dispatch = useDispatch();
  const incomeExpenses = useSelector((state) => state.incomeExpenses.incomeExpenses);
  async function init() {
    if (id) {
      dispatch(getIncomeExpenseById(id));
    } else {
      dispatch(setIncomeExpenses(null));
    }
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

  const formHeaders = [
    { key: "item_financial_status", label: "สถานะทางการเงิน" },
    { key: "no", label: "ราย" },
    { key: "cash", label: "เงินสด" },
    // { key: "memo", label: "หมายเหตุ" },
  ];

  const formExpenseHeaders = [
    { key: "item", label: "รายการ" },
    { key: "no", label: "ราย" },
    { key: "cash", label: "จำนวนเงิน" },
    // { key: "memo", label: "หมายเหตุ" },
  ];

  const formFinancialStatusHeaders = [
    { key: "item_financial_status", label: "รายการ" },
    { key: "date", label: "วันที่" },
    { key: "bank", label: "ธนาคาร" },
    // { key: "memo", label: "หมายเหตุ" },
  ];

  const typeFromKeys = {
    date: "date",
    bank: "number",
    cash: "number",
    no: "number",
  };
  const allowDateOnly = [{ financial_status: "ยอดยกมา" }];
  const highlight = ["สถานะทางการเงิน ณ วันทำการ", "รับชำระเงินต้น", "รับชำระดอกเบี้ย"];
  const isHighlight = (item) => {
    return highlight.includes(item.financial_status);
  };
  const [page, setPage] = useState(0);
  function handleChengeIncomeValue(val, index, key) {
    const newIncomeList = [...incomeList];
    newIncomeList[index][key] = val;
    setIncomeList(newIncomeList);
  }
  function handleChengeExpenseValue(val, index, key) {
    const newExpensesList = [...expensesList];
    newExpensesList[index][key] = val;
    setExpensesList(newExpensesList);
  }
  function handleChangeFinancialStatus(val, index, key) {
    const newFinancialStatusList = [...financialStatusList];
    newFinancialStatusList[index][key] = val;
    setFinancialStatusList(newFinancialStatusList);
  }
  const pageTitle = {
    0: "#ส่วนที่ 1 สถานะทางการเงินธนาคาร",
    1: "#ส่วนที่ 2 รายรับ",
    2: "#ส่วนที่ 3 รายจ่าย",
  };
  function numberFormat(val, digit = 2) {
    const comma = new Intl.NumberFormat("en-US", { minimumFractionDigits: digit }).format(val);
    return comma;
  }
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{pageTitle[page]}</h3>
        <p>หากช่องไหนไม่มีข้อมูลโปรดเว้นว่างไว้ทุกกรณี</p>
      </div>
      <div className="mb-4">
        <Input variant="bordered" label="หมายเหตุ" placeholder="กรอกข้อมูล" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      {page === 0 ? (
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {/* Render table headers */}
              {financialStatusList.length > 0 &&
                formFinancialStatusHeaders.map((header) => (
                  <th key={header.key} className="py-4 text-left px-4">
                    {header.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render table rows */}
            {financialStatusList.map((item, index) => (
              <tr key={index} className={`cursor-pointer ${isHighlight(item) ? "bg-gray-100 font-bold" : ""}`}>
                {formFinancialStatusHeaders.map((i, idx) => (
                  <td key={idx} className="py-1 whitespace-nowrap hover:bg-gray-100 px-4">
                    {!["date", "cash", "bank", "memo", "no"].includes(i.key) && !item.allow_item && <span className={`${item.is_header ? "font-bold" : ""}`}>{item[i.key]}</span>}
                    {item.allow_date == 1 && i.key === "date" ? <Input type="date" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChangeFinancialStatus(e.target.value, index, i.key)} /> : ""}
                    {item.allow_no == 1 && i.key === "no" ? <Input type="number" className="text-center w-16" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChangeFinancialStatus(e.target.value, index, i.key)} /> : ""}
                    {item.allow_cash == 1 && i.key === "cash" ? <Input type="number" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChangeFinancialStatus(e.target.value, index, i.key)} /> : ""}
                    {item.allow_bank == 1 && i.key === "bank" ? <Input type="number" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChangeFinancialStatus(e.target.value, index, i.key)} /> : ""}
                    {item.allow_item == 1 && i.key === "item_financial_status" ? <Input type="text" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChangeFinancialStatus(e.target.value, index, i.key)} /> : ""}
                    {i.key === "memo" ? <Input type="text" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChangeFinancialStatus(e.target.value, index, i.key)} /> : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : page === 1 ? (
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {/* Render table headers */}
              {incomeList.length > 0 &&
                formHeaders.map((header) => (
                  <th key={header.key} className="py-4 text-left px-4">
                    {header.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render table rows */}
            {incomeList.map((item, index) => (
              <tr key={index} className={`cursor-pointer ${isHighlight(item) ? "bg-gray-100 font-bold" : ""}`}>
                {formHeaders.map((i, idx) => (
                  <td key={idx} className="py-1 whitespace-nowrap hover:bg-gray-100 px-4">
                    {!["date", "cash", "bank", "memo", "no"].includes(i.key) && !item.allow_item && <span className={`${item.is_header ? "font-bold" : ""}`}>{item[i.key]}</span>}
                    {item.allow_date == 1 && i.key === "date" ? <Input type="date" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeIncomeValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_no == 1 && i.key === "no" ? <Input type="number" className="text-center w-16" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeIncomeValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_cash == 1 && i.key === "cash" ? <Input type="number" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeIncomeValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_bank == 1 && i.key === "bank" ? <Input type="number" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeIncomeValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_item == 1 && i.key === "item_financial_status" ? <Input type="text" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeIncomeValue(e.target.value, index, i.key)} /> : ""}
                    {i.key === "memo" ? <Input type="text" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeIncomeValue(e.target.value, index, i.key)} /> : ""}
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
                formExpenseHeaders.map((header) => (
                  <th key={header.key} className="py-4 text-left px-4">
                    {header.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render table rows */}
            {expensesList.map((item, index) => (
              <tr key={index} className={`cursor-pointer ${isHighlight(item) ? "bg-gray-100 font-bold" : ""}`}>
                {formExpenseHeaders.map((i, idx) => (
                  <td key={idx} className="py-1 whitespace-nowrap hover:bg-gray-100 px-4">
                    {!["date", "cash", "bank", "memo", "no"].includes(i.key) && !item.allow_item && <span className={`${item.is_header ? "font-bold" : ""}`}>{item[i.key]}</span>}
                    {item.allow_date == 1 && i.key === "date" ? <Input type="date" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeExpenseValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_no == 1 && i.key === "no" ? <Input type="number" className="text-center w-16" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeExpenseValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_cash == 1 && i.key === "cash" ? <Input type="number" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeExpenseValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_bank == 1 && i.key === "bank" ? <Input type="number" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeExpenseValue(e.target.value, index, i.key)} /> : ""}
                    {item.allow_item == 1 && i.key === "item" ? <Input type="text" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeExpenseValue(e.target.value, index, i.key)} /> : ""}
                    {i.key === "memo" ? <Input type="text" className="text-center" variant="bordered" size="sm" placeholder={""} value={item[i.key]} onChange={(e) => handleChengeExpenseValue(e.target.value, index, i.key)} /> : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-end gap-4 py-5 bg-gray-100 px-4 rounded-lg">
        <div>
          ยอดรวมธนาคาร (รายรับ): <span className="text-xl font-bold">{numberFormat(sumAllBank)}</span> บาท
        </div>
        <div>
          ยอดรวมเงินสด (รายรับ): <span className="text-xl font-bold">{numberFormat(sumAllCash)}</span> บาท
        </div>
        <div className="text-red-600">
          ยอดรวมเงินสด (รายจ่าย): <span className="text-xl font-bold">{numberFormat(sumAllCashExpenses)}</span> บาท
        </div>
      </div>
      <div className="flex justify-end gap-4 py-4">
        {page > 0 && (
          <>
            <Button onClick={() => setPage(page - 1)}>
              <FaChevronLeft /> ย้อนกลับ
            </Button>
          </>
        )}
        {page < 2 && (
          <>
            <Button onClick={() => setPage(page + 1)}>
              ต่อไป <FaChevronRight />
            </Button>
          </>
        )}
        {page === 2 && (
          <Button color="success" className="text-white" onClick={() => handleConfirmSaveData()}>
            บันทึกรายการ
          </Button>
        )}
      </div>
      <ReadCardDialog isOpen={readCardManagerIsOpen} onClose={() => setReadCardManagerIsOpen(false)} callback={(data) => checkManagerAndSave(data.citizen_id)} />
    </div>
  );
}

export default ExcelReader;
