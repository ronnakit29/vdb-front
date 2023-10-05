import Helper from '@/classes/Helper.class'
import Layout from '@/components/Layout'
import { setInsertSlot, setInsertSlotType } from '@/store/slices/memberSlice'
import { setDialog, setTitle } from '@/store/slices/utilSlice'
import { Button, Card, CardBody, CardHeader, Divider, Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaArrowDown, FaDownload, FaFile, FaFileInvoice, FaList, FaUsers } from 'react-icons/fa'
import { GiChart } from 'react-icons/gi'
import { GoHash } from 'react-icons/go'
import ReadCardDialog from '@/components/ReadCardDialog'
import { client } from '@/classes'
import { showToast } from '@/store/actions/toastAction'
import { getAnalysis } from '@/store/actions/analysisAction'
import { getVillageList } from '@/store/actions/villageAction'
export function StatCard({ title, value, icon, color }) {
    return (<div className="flex items-center justify-between bg-white shadow-md rounded-3xl p-5">
        <div className="flex items-center">
            <div className={`rounded-full p-3 text-white ${color || "bg-blue-500"}`}>
                {icon || <FaArrowDown />}
            </div>
            <div className="ml-3">
                <p className="text-gray-600 text-sm">{title}</p>
                <p className="text-gray-900 text-lg font-semibold">{value}</p>
            </div>
        </div>
    </div>);
}


export default function Index() {
    const dispatch = useDispatch()
    const router = useRouter()
    const type = {
        short: 'กู้ระยะสั้น',
        long: 'กู้ระยะยาว',
        business: 'กู้ฉุกเฉิน/ธุรกิจ'
    }
    const [isInsertCardDialogOpen, setIsInsertCardDialogOpen] = React.useState(false)
    async function checkDataAndNextStep(data) {
        try {
            const checkQuota = await client.checkLoanQuota(data.citizen_id);
            if (checkQuota) {
                dispatch(setInsertSlot({
                    member: data,
                }))
                router.push('/dashboard/promise-form/?type=' + router.query.type)
            }
        } catch (error) {
            dispatch(showToast(error, "bg-red-500", 3000))
        }
    }
    const user = useSelector(state => state.user.user)
    const [villageCodeSelect, setVillageCodeSelect] = React.useState(user.village_code)
    const villageList = useSelector(state => state.village.villageList)
    const analysis = useSelector(state => state.analysis.analysis)
    function init() {
        dispatch(getAnalysis(villageCodeSelect || user.village_code))
        dispatch(getVillageList())
    }
    function handleOpenInsertCardDialog() {
        setIsInsertCardDialogOpen(true)
        dispatch(setInsertSlot({
            member: null,
            guarantorFirst: null,
            guarantorSecond: null,
            manager: null,
            employee: null,
        }))
    }
    useEffect(() => {
        if (router.isReady) {
            init()
        }
    }, [router.isReady, villageCodeSelect])
    useEffect(() => {
        if (router.query.type) {
            handleOpenInsertCardDialog(router.query.type)
        }
    }, [router.query.type, router.query])
    
    return (<div>
        <ReadCardDialog isOpen={isInsertCardDialogOpen} onClose={() => setIsInsertCardDialogOpen(false)} callback={(data) => checkDataAndNextStep(data)} />
        <div className=" py-8 bg-gray-100">
            <div className="grid  gap-4 container mx-auto px-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title={"ยอดปล่อยกู้ทั้งหมด"} value={Helper.formatNumber(analysis?.totalPromiseAmount || 0, 2)} icon={<FaArrowDown />}></StatCard>
                {/* 1 percent  */}
                <StatCard title={"ยอดเงินจากการหัก 1%"} value={Helper.formatNumber(analysis?.totalHedgeFundAmount || 0)} icon={<FaArrowDown />} color="bg-green-500"></StatCard>
                {/* total user count */}
                <StatCard title={"จำนวนสมาชิกทั้งหมด"} value={Helper.formatNumber(analysis?.totalMember || 0, 0)} icon={<FaUsers />} color="bg-yellow-500"></StatCard>
                {/* total promise */}
                <StatCard title={"จำนวนสัญญาทั้งหมด"} value={Helper.formatNumber(analysis?.totalPromise || 0, 0)} icon={<FaFileInvoice />} color="bg-red-500"></StatCard>
            </div>
        </div>
        <Divider />
        <div className="px-8 py-2">
            <select value={villageCodeSelect} label="เลือกหมู่บ้าน" className='w-full bg-gray-50 transition-all hover:bg-gray-100 px-4 py-2 rounded-xl outline-none' onChange={(e) => setVillageCodeSelect(e.target.value)}>
                <option value="">- เลือกหมู่บ้าน -</option>
                {villageList.map((i, key) => <option key={key} value={i.code}>
                    {i.code} | {i.name}
                </option>)}
            </select>
        </div>
        <Divider />
        <div className="container mx-auto">
            <div className='p-8 flex flex-col items-center'>
                <div className="w-full">
                    <Card className='p-8 rounded-3xl mb-5' shadow='sm'>
                        <CardBody>
                            <div className="text-center mb-4">
                                <h1 className='text-2xl font-semibold'>ทำสัญญา</h1>
                                <p className='text-gray-500'>เสียบบัตรเพื่อทำสัญญาตามรายการต่อไปนี้</p>
                            </div>
                            <div className='flex gap-4 mb-5'>
                                <Button variant='flat' size='lg' className='w-full py-8' color='primary' onClick={() => router.push('/dashboard?type=short')}>กู้ระยะสั้น</Button>
                                <Button variant='flat' size='lg' className='w-full py-8' color='secondary' onClick={() => router.push('/dashboard?type=long')}>กู้ระยะยาว</Button>
                                <Button variant='flat' size='lg' className='w-full py-8' color='danger' onClick={() => router.push('/dashboard?type=business')}>กู้ฉุกเฉิน/ธุรกิจ</Button>
                            </div>
                        </CardBody>
                    </Card>

                    <div className='p-8 rounded-3xl mb-5'>
                        <h1 className='text-2xl font-semibold mb-4 flex gap-2 items-center'><GoHash />รายงานการทำสัญญา</h1>
                        <div className='flex gap-4 mb-5'>
                            {Object.keys(type).map((i, key) => <Button
                                onClick={() => router.push('/dashboard/promise-list?type=' + i)}
                                className='w-full' variant='flat' size='lg' color='warning'>
                                {type[i]}
                            </Button>)}

                        </div>
                    </div>
                    <h1 className='text-2xl font-semibold mb-4'>รายงานการกู้เงิน/ยอดเงินเข้ากองทุนประกันความเสี่ยง</h1>
                    <div className='flex gap-4 mb-5'>
                        <Card shadow='sm' className='w-full'>
                            <CardHeader>
                                <div className='flex flex-col'>
                                    <p className='text-md'>ยอดเงินกู้ทั้งหมด</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className='flex-col flex justify-center gap-4 items-center'>
                                <p className="text-3xl text-green-500 font-semibold">{Helper.formatNumber(analysis.totalPromiseAmount)} บาท</p>
                                <Button color='primary' onClick={() => router.push('/dashboard/promise-list?type=short')}>ดูรายการ</Button>
                            </CardBody>
                        </Card>
                        <Card shadow='sm' className='w-full'>
                            <CardHeader>
                                <div className='flex flex-col'>
                                    <p className='text-md'>ยอดเงินจากการหัก 1%</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className='flex-col flex justify-center gap-4 items-center'>
                                <p className="text-3xl text-orange-500 font-semibold">{Helper.formatNumber(analysis.totalHedgeFundAmount)} บาท</p>
                                <Button color='primary' onClick={() => router.push('/dashboard/promise-list')}>ดูรายการ</Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

Index.getLayout = function getLayout(page) {
    return <Layout>
        {page}
    </Layout>
}
