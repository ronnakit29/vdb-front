import CheckQuota from '@/components/CheckQuota'
import Layout from '@/components/Layout'
import ReadCardDialog from '@/components/ReadCardDialog'
import { Button, Divider } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkQuota as checkPromiseQuota, getPromiseDocumentList, getPromiseDocumentListByCitizenId } from '@/store/actions/promiseDocumentAction'
import { useRouter } from 'next/router'
import PromiseListTable from '@/components/PromiseListTable'
import { setGuarantee, setPromiseDocumentList } from '@/store/slices/promiseDocumentSlice'
export default function CheckQuotaPage() {
    const [readCardIsOpen, setReadCardIsOpen] = React.useState(false)
    const dispatch = useDispatch()
    const [quotaData, setQuotaData] = React.useState({})
    const [personalData, setPersonalData] = React.useState({})
    function checkQuota(data) {
        setReadCardIsOpen(false)
        setPersonalData(data)
        dispatch(checkPromiseQuota(data.citizen_id, null, (response) => setQuotaData(response)))
        dispatch(getPromiseByCitizenId(data.citizen_id))
    }
    function getPromiseByCitizenId(citizen_id) {
        dispatch(getPromiseDocumentListByCitizenId(citizen_id))
    }
    const documentPromiseList = useSelector(state => state.promiseDocument.promiseDocumentList)
    const guaranteeList = useSelector(state => state.promiseDocument.promiseGuarantee)
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            setQuotaData({})
            setPersonalData({})
            dispatch(setPromiseDocumentList([]))
            dispatch(setGuarantee([]))
        }
    }, [router.isReady])
    return (
        <div className='p-8'>
            <h1 className="text-center text-2xl font-semibold mb-4">เช็คโควต้า / รายการสัญญา</h1>
            <Divider></Divider>
            <div className="flex justify-center py-8">
                <Button size='lg' color='success' onClick={() => setReadCardIsOpen(true)}>ตรวจสอบสัญญาและโควต้าในการค้ำประกัน</Button>
            </div>
            <div className='flex flex-col'>
                {quotaData?.data && <div className='px-4 py-4 border-2 rounded-xl border-success-400 text-success-700 mb-4'>
                    {personalData?.first_name} {personalData?.last_name} | หมายเลขบัตรนี้สามารถค้ำประกันได้อีก <span className="text-xl font-bold">{quotaData?.data}</span> คน
                </div>}
                <PromiseListTable data={documentPromiseList}></PromiseListTable>
                <div className="py-8">
                    <h1 className='text-2xl font-semibold mb-2'>รายการสัญญาที่กำลังค้ำประกัน</h1>
                    <PromiseListTable data={guaranteeList}></PromiseListTable>
                </div>
            </div>
            <div></div>
            <ReadCardDialog isOpen={readCardIsOpen} onClose={() => setReadCardIsOpen(false)} callback={(e) => checkQuota(e)} />
        </div>
    )
}

CheckQuotaPage.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}