import Helper from '@/classes/Helper.class'
import Layout from '@/components/Layout'
import MemberCardComponent from '@/components/MemberCardComponent'
import { Button, Card, CardBody, CardHeader, Divider, Input, Link, Tab, Tabs, User } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import moment from 'moment/moment'
import { setDialog, setTitle } from '@/store/slices/utilSlice'
import { setInsertSlot, setInsertSlotType } from '@/store/slices/memberSlice'
import dayjs from 'dayjs'
import ImageToBase64Converter from '@/components/ImageToBase64Converter'
import { showToast } from '@/store/actions/toastAction'
import { checkQuota, createPromiseDocument } from '@/store/actions/promiseDocumentAction'
import THBText from 'thai-baht-text'
import { showConfirm } from '@/store/actions/confirmAction'
import { FaChevronRight } from 'react-icons/fa'
import ReadCardDialog from '@/components/ReadCardDialog'

export function SectionForm({ children, title, isRequireTitle = false }) {
    return (<div className='mb-4'>
        <h1 className="text-lg mb-2 font-bold text-sky-500">{title} {isRequireTitle && <span className='text-red-500'>*</span>}</h1>
        {children}
    </div>);
}

export const guaranteeType = [
    {
        name: "ผู้ค้ำประกัน",
        value: "guarantor",
        accept: ['long', 'short', 'business']
    },
    {
        name: "หลักทรัพย์",
        value: "collateral",
        accept: ['business']
    },
    {
        name: "เงินฝาก",
        value: "deposit",
        accept: ['business']
    }
]

function ReportCardComponent({ typeTxt, value, hedge_fund, total, index, onChange }) {
    return (<Card className="bg-white" shadow='sm' >
        <CardBody>
            <h2 className="text-xl font-semibold text-green-500">สัญญาที่ {index}/{total}</h2>
            <p className="text-gray-600">ประเภท : {typeTxt}</p>
            <p className="text-gray-600">ยอดเงินกู้ : {Helper.formatNumber(value || 0)}</p>
            <p className="text-gray-600 mb-2">หักเข้ากองทุนประกันความเสี่ยง : {Helper.formatNumber(hedge_fund || 0)}</p>
            <Input variant='bordered' color='primary' type='number' min={0} step={0.01} label="ดอกเบี้ย (ร้อยละ) ต่อเดือน" placeholder="กรอกดอกเบี้ย" onChange={onChange} />
        </CardBody>
    </Card>);
}



export function UserSlotComponent({ onClick, fullname, citizen_id, imageUrl, description }) {
    return (<div onClick={onClick}>
        <Card shadow='sm'>
            <CardBody>
                <div className="w-full flex items-center gap-4">
                    <ImageToBase64Converter imageUrl={imageUrl} height={'20px'} className="w-16 h-16 rounded-full" />
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{fullname || 'ไม่มีข้อมูล'}</h2>
                        <p className="text-gray-600 text-sm">{citizen_id || 'ไม่มีข้อมูล'}</p>
                        {description && <span className="text-gray-500">{description}</span>}
                    </div>
                </div>
            </CardBody>
        </Card>
    </div>);
}


export default function PromiseForm() {
    const insertSlot = useSelector(state => state.member.insertSlot)
    const router = useRouter()
    const dispatch = useDispatch()
    useEffect(() => {
        if (!insertSlot.member) {
            router.push('/dashboard')
        }

    }, [insertSlot])
    const [formData, setFormData] = useState({
        citizen_id: '',
        running_number: '',
        promise_year: '',
        datetime: dayjs().format('YYYY-MM-DD'),
        reason: '',
        amount: '',
        deposit_amount: '',
        expired_date: '',
        period: '',
        interest: '',
        multiple_deposit: 5,
        manager_citizen_id: '',
        employee_citizen_id: '',
        witness1_citizen_id: '',
        witness2_citizen_id: '',
        witness3_citizen_id: '',
        guarantee_type: 'guarantor',
        guarantee_value: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const maximumLoanType = [
        {
            type: 'long',
            maximum: 50000,
            isHedgeFund: true,
            hedgeFundPercent: 0.01
        },
        {
            type: 'short',
            maximum: 40000,
            isHedgeFund: true,
            hedgeFundPercent: 0.01
        },
        {
            type: 'business',
            maximum: -1,
            isHedgeFund: false
        }
    ]

    const typeTxt = {
        long: 'กู้ระยะยาว',
        short: 'กู้ระยะสั้น',
        business: 'กู้ฉุกเฉิน/ธุรกิจ'
    }
    function loanValue() {
        return maximumLoanType.find(i => i.type === router.query.type)?.maximum || 0
    }

    const [promiseList, setPromiseList] = useState([])
    function ifMaxSplitTypeToBusiness() {
        if (router.query.type === 'business') {
            setPromiseList([
                {
                    type: router.query.type,
                    addon: false,
                    value: formData.amount,
                    hedge_fund: 0,
                    interest: ''
                }
            ])
        } else {
            if (formData.amount - loanValue() > 0) {
                setPromiseList([
                    {
                        type: router.query.type,
                        addon: false,
                        value: loanValue(),
                        hedge_fund: loanValue() * maximumLoanType.find(i => i.type === router.query.type).hedgeFundPercent
                    },
                    {
                        type: router.query.type,
                        addon: true,
                        value: formData.amount - loanValue(),
                        hedge_fund: 0,
                        interest: ''
                    }
                ])
            } else {
                setPromiseList([
                    {
                        type: router.query.type,
                        addon: false,
                        value: formData.amount,
                        hedge_fund: formData.amount * maximumLoanType.find(i => i.type === router.query.type)?.hedgeFundPercent || 0,
                        interest: ''
                    }
                ])
            }
        }
    }

    const maximumLoan = formData.deposit_amount * formData.multiple_deposit;
    useEffect(() => {
        if (formData.amount > (maximumLoan)) {
            setFormData({
                ...formData,
                amount: maximumLoan
            })
        }
    }, [formData.amount])

    useEffect(() => {
        ifMaxSplitTypeToBusiness()
    }, [formData.amount])
    const receiveTxt = {
        member: "ผู้กู้",
        guarantorFirst: "ผู้ค้ำประกันคนที่ 1",
        guarantorSecond: "ผู้ค้ำประกันคนที่ 2",
        approver: "ผู้อนุมัติ",
    }
    const typeQuery = router.query.type
    const [instDataTo, setInstDataTo] = useState('guarantorFirst')
    const [isInsertCardOpen, setIsInsertCardOpen] = useState(false)
    function handleInsertCard(insertDataTo) {
        setIsInsertCardOpen(true)
        setInstDataTo(insertDataTo)
    }
    function setInsertDataSlot(data) {
        dispatch(setInsertSlot({
            [instDataTo]: data
        }))
    }
    useEffect(() => {
        if (router.isReady) {
            dispatch(showToast('กรุณาทำรายการโดยไม่รีเฟรชหน้านี้', 'bg-sky-500', 5000))
        }
    }, [router.isReady])
    function memberCheckQuota(citizen_id, slot) {
        dispatch(checkQuota(citizen_id, () => {
            dispatch(showToast('ผู้ค้ำประกันเกินจำนวนครั้งที่กำหนด', 'bg-red-500', 3000))
            dispatch(setInsertSlot({
                [slot]: null
            }))
        }))
    }
    useEffect(() => {
        if (insertSlot.member) {
            if (insertSlot.guarantorFirst && insertSlot.guarantorSecond) {
                if (insertSlot.guarantorFirst?.citizen_id === insertSlot.guarantorSecond?.citizen_id) {
                    dispatch(showToast('ไม่สามารถใช้ผู้ค้ำประกันคนเดียวกันได้', 'bg-red-500', 3000))
                    dispatch(setInsertSlot({
                        guarantorFirst: null,
                        guarantorSecond: null
                    }))
                    return;
                }
            } else if (insertSlot.member?.citizen_id === insertSlot.guarantorFirst?.citizen_id) {
                dispatch(showToast('ไม่สามารถใช้ผู้กู้เป็นผู้ค้ำประกันได้', 'bg-red-500', 3000))
                dispatch(setInsertSlot({
                    guarantorFirst: null
                }))
                return;
            } else if (insertSlot.member?.citizen_id === insertSlot.guarantorSecond?.citizen_id) {
                dispatch(showToast('ไม่สามารถใช้ผู้กู้เป็นผู้ค้ำประกันได้', 'bg-red-500', 3000))
                dispatch(setInsertSlot({
                    guarantorSecond: null
                }))
                return;
            }
        }
    }, [insertSlot])
    useEffect(() => {
        if (insertSlot.guarantorFirst) {
            memberCheckQuota(insertSlot.guarantorFirst?.citizen_id, 'guarantorFirst')
        }
    }, [insertSlot.guarantorFirst])
    useEffect(() => {
        if (insertSlot.guarantorSecond) {
            memberCheckQuota(insertSlot.guarantorSecond?.citizen_id, 'guarantorSecond')
        }
    }, [insertSlot.guarantorSecond])
    const age = insertSlot.member && dayjs().diff(dayjs(insertSlot.member?.birth_date), 'year')

    function savePromiseDocument() {
        const checkInterestForm = promiseList.find(i => i.interest === '')
        if (!formData.deposit_amount || !formData.multiple_deposit || !formData.amount || !formData.period || checkInterestForm) {
            dispatch(showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'bg-red-500', 3000))
            return;
        }
        dispatch(showConfirm(`คุณได้ตรวจสอบข้อมูลอย่างถูกต้องและกำลังดำเนินการสร้างสัญญาฉบับนี้ของ ${insertSlot.member ? insertSlot.member.first_name + ' ' + insertSlot.member.last_name : ''} เป็นจำนวนเงินทั้งหมด ${Helper.formatNumber(formData.amount)} บาท จำนวน ${promiseList.length} สัญญา ใช่หรือไม่?`, () => {
            dispatch(createPromiseDocument({
                promiseList: promiseList,
                promiseData: {
                    ...formData,
                    age: age,
                    citizen_id: insertSlot.member?.citizen_id,
                    witness1_citizen_id: insertSlot.guarantorFirst?.citizen_id,
                    witness2_citizen_id: insertSlot.guarantorSecond?.citizen_id,
                    manager_citizen_id: insertSlot.manager?.citizen_id,
                    employee_citizen_id: insertSlot.employee?.citizen_id,
                    start_date: formData.datetime,
                    maximum_loan: maximumLoan,
                    expired_date: dayjs(formData.datetime).add(formData.period, 'month').format('YYYY-MM-DD'),
                }
            }, ({ data }) => router.push(`/dashboard/promise-final?groupId=${data[0].group_id}`)))
        }))
    }
    useEffect(() => {
        setFormData({
            ...formData,
            amount: ""
        })
    }, [formData.deposit_amount, formData.multiple_deposit])
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL

    // filter by accept type
    const acceptGuaranteeType = guaranteeType.filter(i => i.accept.includes(router.query.type))
    useEffect(() => {
        setFormData({
            ...formData,
            guarantee_value: "",
        })
    }, [formData.guarantee_type])
    return (
        insertSlot?.member ? <div className='p-8'>
            <div className='mb-5'>
                <div className='text-xl bg-green-100 text-green-600 rounded-xl py-5 text-center font-semibold'>
                    การทำสัญญา <span className="underline text-2xl">{typeTxt[typeQuery]}</span>
                </div>
            </div>
            <SectionForm title={"ข้อมูลผู้ทำสัญญา"}>
                <div className="flex gap-4">
                    <div className="h-full">
                        <ImageToBase64Converter imageUrl={insertSlot.member?.citizen_id ? apiUrl + "/member/image/" + insertSlot.member?.citizen_id : ''} height={'200px'} className="w-32 h-32 rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full">
                        <div>
                            <Input label="เลขบัตรประชาชน" placeholder="กรอกเลขบัตรประชาชน" name="citizen_id" value={insertSlot.member?.citizen_id} readOnly />
                        </div>
                        <div>
                            <Input label="คำนำหน้า" placeholder="กรอกคำนำหน้า" name="title_name" value={insertSlot.member?.title_name} readOnly />
                        </div>
                        <div>
                            <Input label="ชื่อจริง" placeholder="กรอกชื่อจริง" name="firstname" value={insertSlot.member?.first_name} readOnly />
                        </div>
                        <div>
                            <Input label="นามสกุล" placeholder="กรอกนามสกุล" name="lastname" value={insertSlot.member?.last_name} readOnly />
                        </div>
                        <div>
                            <Input label="อายุ" placeholder="กรอกอายุ" name="age" value={age} readOnly />
                        </div>
                    </div>
                </div>
            </SectionForm>
            <SectionForm title={"ข้อมูลเงินฝาก"} isRequireTitle={true}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {/* deposit amount */}
                        <Input size='lg' variant='bordered' color='primary' autoFocus label="ยอดเงินฝาก" placeholder="กรอกยอดเงินฝาก" name="deposit_amount" value={formData.deposit_amount} onChange={handleChange} errorMessage="กรุณาระบุข้อมูลส่วนนี้" onScroll={(e) => e.target.blur()} />
                        {/* maximum loan multiple_deposit */}
                    </div>
                    <div>
                        <Input size='lg' variant='bordered' color='primary' type='number' readOnly={router.query.type !== 'business'} min={0} step={1} label="สูงสุดที่สามารถกู้ได้ (กี่เท่าของจำนวนฝาก)" placeholder="กรอกสูงสุดที่สามารถกู้ได้ (กี่เท่าของจำนวนฝาก)" name="multiple_deposit" value={formData.multiple_deposit} onChange={handleChange} />
                    </div>
                </div>
            </SectionForm>
            <SectionForm title={`ข้อมูลการกู้ (กู้ได้สูงสุด ${Helper.formatNumber(maximumLoan || 0)} บาท)`} isRequireTitle={true}>
                <div className="grid grid-cols-3 gap-4" >
                    <div className='col-span-3'>
                        <Input label="ประเภทการกู้" placeholder="กรอกประเภทการกู้" name="loan_type" value={typeTxt[typeQuery]} readOnly />
                    </div>
                    <div className='col-span-3 flex flex-col gap-2'>
                        <Input size='lg' variant='bordered' color='primary' type='number' step={1} min={0} label="ยอดเงินกู้" placeholder="กรอกยอดเงินกู้" name="amount" value={formData.amount} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                        {formData.amount && <div className='px-2 py-1 rounded-xl bg-gray-50 text-sky-500'>
                            ({THBText(formData.amount)})
                        </div>}
                    </div>
                    <div className='col-span-3 flex flex-col gap-2'>
                        {/* reason */}
                        <Input size='lg' variant='bordered' color='primary' label="วัตถุประสงค์การกู้" placeholder="กรอกวัตถุประสงค์การกู้" name="reason" value={formData.reason} onChange={handleChange} />
                    </div>
                    <div>
                        <Input variant='bordered' color='primary' type='number' min={0} step={1} label="จำนวนงวด" placeholder="กรอกจำนวนงวด" name="period" value={formData.period} onChange={handleChange} onWheel={(e) => e.target.blur()} />
                    </div>
                    <div>
                        <Input label="วันที่กู้" placeholder="กรอกวันที่กู้" name="datetime" value={formData.datetime} readOnly />
                    </div>
                    <div>
                        <Input label="วันที่ครบกำหนด" placeholder="กรอกวันที่ครบกำหนด" name="expired_date" value={dayjs(formData.datetime).add(formData.period, 'month').format('YYYY-MM-DD')} readOnly />
                    </div>
                </div>
            </SectionForm>
            <SectionForm title={"ประเภทการค้ำประกัน"} isRequireTitle={true}>
                <div className="flex gap-4">
                    {acceptGuaranteeType.map((i, key) => <div key={key} className={`border-2 cursor-pointer rounded-lg px-3 py-1 ${formData.guarantee_type === i.value ? 'border-success-500 bg-success-50' : ''}`} onClick={() => setFormData({ ...formData, guarantee_type: i.value })}>
                        {i.name}
                    </div>)}
                </div>
                {formData.guarantee_type === "collateral" && <div className="flex gap-4 mt-4">
                    <Input label="รายละเอียดหลักทรัพย์" placeholder="กรอกรายละเอียดหลักทรัพย์" name="guarantee_value" value={formData.guarantee_value} onChange={(e) => setFormData({ ...formData, guarantee_value: e.target.value })} />
                </div>}
            </SectionForm>

            {formData.guarantee_type === "guarantor" && <SectionForm title={"ข้อมูลผู้ค้ำประกัน"} isRequireTitle={true}>
                <div className="grid grid-cols-3 gap-4">
                    <UserSlotComponent onClick={() => handleInsertCard('guarantorFirst')}
                        fullname={insertSlot.guarantorFirst ? insertSlot.guarantorFirst.first_name + ' ' + insertSlot.guarantorFirst.last_name : ''}
                        citizen_id={insertSlot.guarantorFirst ? insertSlot.guarantorFirst.citizen_id : ''}
                    ></UserSlotComponent>
                    <UserSlotComponent onClick={() => handleInsertCard('guarantorSecond')}
                        fullname={insertSlot.guarantorSecond ? insertSlot.guarantorSecond.first_name + ' ' + insertSlot.guarantorSecond.last_name : ''}
                        citizen_id={insertSlot.guarantorSecond ? insertSlot.guarantorSecond.citizen_id : ''}
                    ></UserSlotComponent>
                </div>
            </SectionForm>}
            <SectionForm title={"สรุปข้อมูลการกู้เงิน"} isRequireTitle={true}>
                <div className="grid grid-cols-2 gap-4">
                    {promiseList.map((i, key) => <ReportCardComponent index={key + 1} total={promiseList.length} key={key} typeTxt={typeTxt[i.type] + (i.addon && 'พิเศษ')} value={i.value} hedge_fund={i.hedge_fund}
                        onChange={(e) => {
                            const { value } = e.target;
                            setPromiseList(promiseList.map((item, index) => {
                                if (index === key) {
                                    return {
                                        ...item,
                                        interest: Number(value)
                                    }
                                }
                                return item
                            }))
                        }}
                    ></ReportCardComponent>)}
                </div>
            </SectionForm >
            <SectionForm title={"ข้อมูลผู้จัดการและผู้ทำรายการ"} isRequireTitle={true}>
                <div className="grid grid-cols-2 gap-4">
                    <UserSlotComponent onClick={() => handleInsertCard('manager')}
                        fullname={insertSlot.manager ? insertSlot.manager.first_name + ' ' + insertSlot.manager.last_name : ''}
                        citizen_id={insertSlot.manager ? insertSlot.manager.citizen_id : ''}
                        description="ผู้จัดการ"
                    ></UserSlotComponent>
                    <UserSlotComponent onClick={() => handleInsertCard('employee')}
                        fullname={insertSlot.employee ? insertSlot.employee.first_name + ' ' + insertSlot.employee.last_name : ''}
                        citizen_id={insertSlot.employee ? insertSlot.employee.citizen_id : ''}
                        description="ผู้ทำรายการ"
                    ></UserSlotComponent>
                </div>
            </SectionForm>
            <div className="flex justify-center items-center py-5">
                <Button color="primary" size='lg' onClick={savePromiseDocument} className='flex items-center gap-2'>ตรวจสอบและดำเนินการต่อ<FaChevronRight /></Button>
            </div>
            <ReadCardDialog isOpen={isInsertCardOpen} callback={(data) => setInsertDataSlot(data)} onClose={() => setIsInsertCardOpen(false)} />
        </div > : <div className='flex justify-center'>
            <h3 className='text-xl py-5'>ไม่พบข้อมูล</h3>
        </div>
    )
}

PromiseForm.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}