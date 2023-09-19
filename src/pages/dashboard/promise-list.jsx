import Layout from '@/components/Layout'
import React, { useEffect } from 'react'
import { StatCard } from '.'
import TableComponent from '@/components/TableComponent'
import PromiseListTable from '@/components/PromiseListTable'
import { useDispatch, useSelector } from 'react-redux'
import { getPromiseDocumentAnalysis, getPromiseDocumentList } from '@/store/actions/promiseDocumentAction'
import { useRouter } from 'next/router'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import moment from 'moment'
import { FaChartLine, FaList } from 'react-icons/fa'
import Helper from '@/classes/Helper.class'
import { GoArrowBoth } from 'react-icons/go'
import { getVillageList } from '@/store/actions/villageAction'

export default function PromiseList() {
    const dispatch = useDispatch()
    const promiseDocumentList = useSelector((state) => state.promiseDocument.promiseDocumentList);

    const router = useRouter();
    const type = router.query.type || '';
    const [startDate, setStartDate] = React.useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = React.useState(moment().endOf('month').format('YYYY-MM-DD'));
    function init() {
        dispatch(getPromiseDocumentList(type, startDate, endDate, villageSelect))
        dispatch(getPromiseDocumentAnalysis(type, startDate, endDate, villageSelect))
        dispatch(getVillageList())
    }
    const analysis = useSelector((state) => state.promiseDocument.analysisReport);
    useEffect(() => {
        if (router.isReady) {
            init()
        }
    }, [router.isReady])
    useEffect(() => {
        init()
    }, [type, startDate, endDate])
    const typeList = [
        {
            label: 'ทั้งหมด',
            value: ''
        },
        {
            label: 'กู้ระยะสั้น',
            value: 'short'
        },
        {
            label: 'กู้ระยะยาว',
            value: 'long'
        },
        {
            label: 'กู้ฉุกเฉิน/ธุรกิจ',
            value: 'business'
        }
    ]
    const villageList = useSelector((state) => state.village.villageList);
    const [villageSelect, setVillageSelect] = React.useState('');
    useEffect(() => {
        if (villageList.length > 0){
            setVillageSelect(villageList[0].id)
        }
    }, [villageList])
    useEffect(() => {
        init()
    }, [villageSelect])
    return (
        <div>
            <div className="p-8 bg-gray-100">
                <div className="grid grid-cols-3 gap-4">
                    <StatCard value={Helper.formatNumber(analysis.count, 0)} title={"จำนวนสัญญา"} icon={<FaList />}></StatCard>
                    <StatCard value={Helper.formatNumber(analysis.sum)} title={"ยอดเงินกู้ทั้งหมด"} icon={<FaChartLine />} color={"bg-green-500"}></StatCard>
                    <StatCard value={Helper.formatNumber(analysis.hedge_fund)} title={"ยอดเงินประกันความเสี่ยง"} icon={<GoArrowBoth />} color={"bg-yellow-500"}></StatCard>
                </div>
            </div>
            <div className="px-8 py-2">
                <Select label="เลือกหมู่บ้าน"  className='w-full' value={villageSelect} onChange={(e) => setVillageSelect(e)}>
                    {villageList.map((i, key) => <SelectItem key={key} value={i.id}>{i.name}</SelectItem>)}
                </Select>
            </div>
            <div className='flex px-8 py-4 gap-4'>
                {typeList.map((i, key) => <Button key={key} color={type === i.value ? 'primary' : 'default'} onClick={() => router.push(`/dashboard/promise-list?type=${i.value}`)}>{i.label}</Button>)}
            </div>
            <div className='px-8 py-4 flex gap-4 items-center'>
                <Input variant='bordered' type='date' className='w-full' label="วันที่เริ่มต้น" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Input variant='bordered' type='date' className='w-full' label="วันที่สิ้นสุด" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <Button size='lg' color='primary' onClick={init}>
                    รีเฟรช
                </Button>
            </div>
            <div className="px-8 py-4 overflow-x-auto">
                <PromiseListTable data={promiseDocumentList} onReload={init}></PromiseListTable>
            </div>
        </div>
    )
}

PromiseList.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}