import Layout from '@/components/Layout'
import React, { useEffect } from 'react'
import { StatCard } from '..'
import { FaArrowUp, FaChartArea, FaPlus } from 'react-icons/fa'
import Helper from '@/classes/Helper.class'
import IncomeExpenseTable from '@/components/IncomeExpenseTable'
import { Button, Divider, Input } from '@nextui-org/react'
import ReadCardDialog from '@/components/ReadCardDialog'
import { showToast } from '@/store/actions/toastAction'
import { useDispatch, useSelector } from 'react-redux'
import { client } from '@/classes'
import { useRouter } from 'next/router'
import { createIncomeExpenses, getIncomeExpenseList } from '@/store/actions/incomeExpensesAction'
import { showConfirm } from '@/store/actions/confirmAction'
import { getVillageList } from '@/store/actions/villageAction'
import moment from 'moment'

export default function Index() {
    const initFormData = {
        income: "",
        expense: "",
        withdraw_value: "",
        withdraw_all: "",
        citizen_id: "",
        description: ""
    }
    const [formData, setFormData] = React.useState(initFormData)
    const dispatch = useDispatch();
    const [readCardManagerIsOpen, setReadCardManagerIsOpen] = React.useState(false)
    const incomeExpensesList = useSelector(state => state.incomeExpenses.incomeExpensesList)
    const router = useRouter()
    async function checkManagerAndSave(citizen_id) {
        try {
            dispatch(createIncomeExpenses({ ...formData, citizen_id }, () => {
                init();
                resetForm();
            }))
        } catch (error) {
            dispatch(showToast(error, "bg-red-500", 3000))
        }
    }
    function handleConfirmSaveData() {
        const required = ["income", "expense", "withdraw_value", "description"]
        const check = required.every(i => formData[i] !== "")
        if (!check) {
            dispatch(showToast("กรุณากรอกข้อมูลให้ครบถ้วน", "bg-red-500", 3000))
            return;
        }
        dispatch(showConfirm("(สำคัญ : สำหรับผู้จัดการเท่านั้น หากไม่ใช่ทำรายการโดยผู้จัดการโปรดระบุสาเหตุ) ยืนยันการบันทึก, ในขั้นตอนต่อไปคุณจะต้องเสียบบัตรประจำตัวของผู้จัดการ", () => {
            setReadCardManagerIsOpen(true)
        }))
    }
    function resetForm() {
        setFormData(initFormData)
    }
    const user = useSelector(state => state.user.user)
    function init() {
        dispatch(getIncomeExpenseList(villageSelect || user?.village?.id, startDate, endDate))
        dispatch(getVillageList())
    }
    const [startDate, setStartDate] = React.useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = React.useState(moment().endOf('month').format('YYYY-MM-DD'));
    useEffect(() => {
        init()
    }, [startDate, endDate])
    const villageList = useSelector((state) => state.village.villageList);
    const [villageSelect, setVillageSelect] = React.useState('');
    useEffect(() => {
        if (villageList.length > 0 && !villageSelect) {
            setVillageSelect(villageList[0].id)
        }
    }, [villageList])
    useEffect(() => {
        init()
    }, [villageSelect])
    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.isReady])
    const sumIncome = incomeExpensesList.reduce((a, b) => a + Number(b.income), 0)
    const sumExpense = incomeExpensesList.reduce((a, b) => a + Number(b.expense), 0)
    return (
        <div>
            <div className="p-8 bg-gray-100">
                <div className="grid grid-cols-3 gap-4">
                    <StatCard value={Helper.formatNumber(sumIncome || 0)} title={"ยอดรวมรายรับ"} color={'bg-green-500'}></StatCard>
                    <StatCard value={Helper.formatNumber(sumExpense)} title={"ยอดรวมรายจ่าย"} color={'bg-red-500'} icon={<FaArrowUp />}></StatCard>
                    <StatCard value={Helper.formatNumber(sumIncome - sumExpense)} title={"สรุป"} color={'bg-sky-500'} icon={<FaChartArea />}></StatCard>
                </div>
            </div>
            <Divider />
            <div className="px-8 py-2">
                <select placeholder="เลือกหมู่บ้าน" className='w-full bg-gray-50 transition-all hover:bg-gray-100 px-4 py-2 rounded-xl outline-none'
                    value={villageSelect} onChange={(e) => setVillageSelect(e.target.value)}>
                    {villageList.map((i, key) => <option key={key} value={i.id}>{i.code} | {i.name}</option>)}
                </select>
            </div>
            <div className="px-8 py-2 flex justify-between gap-4 items-center">
                <h2 className="text-xl font-semibold">บันทึกรายรับ-รายจ่าย</h2>
                <Button color='success' className='text-white gap-2 items-center' onClick={()=> router.push("/dashboard/income-expense/create")}><FaPlus/>สร้างรายการใหม่</Button>
            </div>
            {/* <div className=' py-4'>
                <div className="px-8 py-2 grid grid-cols-3 gap-4">
                    <div className="w-full">
                        <Input placeholder='กรอกข้อมูล' label="รายรับ" variant='bordered' value={formData.income} onChange={e => setFormData({ ...formData, income: e.target.value })}></Input>
                    </div>
                    <div className="w-full">
                        <Input placeholder='กรอกข้อมูล' label="รายจ่าย" variant='bordered' value={formData.expense} onChange={e => setFormData({ ...formData, expense: e.target.value })}></Input>
                    </div>
                    <div className="w-full flex items-center">
                        <Input value={Helper.formatNumber(Number(formData.income) - Number(formData.expense))} disabled label="คงเหลือ" variant='bordered'></Input>
                    </div>
                    <div className="w-full">
                        <Input placeholder='กรอกข้อมูล' label="ถอน 70%" variant='bordered' value={formData.withdraw_value} onChange={e => setFormData({ ...formData, withdraw_value: e.target.value })}></Input>
                    </div>
                    <div className="w-full">
                        <Input placeholder='กรอกข้อมูล' label="ถอนปิดบัญชี" variant='bordered' value={formData.withdraw_all} onChange={e => setFormData({ ...formData, withdraw_all: e.target.value })}></Input>
                    </div>
                    <div className="w-full">
                        <Input placeholder='กรอกข้อมูล' label="หมายเหตุ" variant='bordered' value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></Input>
                    </div>
                    <div className="flex items-center">
                        <Button color="success" size='lg' className='text-white w-full' onClick={() => handleConfirmSaveData()}
                        >บันทึกรายการ/ผู้จัดการเสียบบัตร</Button>
                    </div>
                </div>
            </div> */}
            <Divider />
            <div className='px-8 py-4 flex gap-4 items-center bg-gray-100'>
                <Input variant='bordered' type='date' className='w-full bg-white rounded-xl' label="วันที่เริ่มต้น" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Input variant='bordered' type='date' className='w-full bg-white rounded-xl' label="วันที่สิ้นสุด" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <Button size='lg' color='primary' onClick={init}>
                    รีเฟรช
                </Button>
            </div>
            <Divider />
            <div className="px-8 mt-4">
                <IncomeExpenseTable data={incomeExpensesList} onReload={init}></IncomeExpenseTable>
            </div>
            <ReadCardDialog isOpen={readCardManagerIsOpen} onClose={() => setReadCardManagerIsOpen(false)} callback={(data) => checkManagerAndSave(data.citizen_id)} />
        </div>
    )
}

Index.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}