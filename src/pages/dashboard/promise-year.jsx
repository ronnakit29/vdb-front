import Layout from '@/components/Layout'
import { getPromiseYear, updatePromiseYear } from '@/store/actions/promiseYearAction'
import { Button, Divider, Input } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function PromiseYear() {
    const [year, setYear] = React.useState('')
    const promiseYear = useSelector(state => state.promiseYear.promiseYear)
    const dispatch = useDispatch()
    function init() {
        dispatch(getPromiseYear())
    }
    function handleSave(e) {
        e.preventDefault()
        dispatch(updatePromiseYear(year))
    }
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            init()
        }
    }, [router.isReady])
    useEffect(()=>{
        if(promiseYear){
            setYear(promiseYear.year)
        }
    },[promiseYear])
    return (
        <div className='p-8'>
            <h1 className="text-center text-2xl font-semibold mb-4">ปีสัญญา</h1>
            <Divider></Divider>
            <form className="flex justify-center p-8" onSubmit={handleSave}>
                <Input placeholder='ปีการทำรายการ' className='w-44 text-center' size='lg' value={year} onChange={(e) => setYear(e.target.value)}></Input>
                <Button size='lg' color='success' className='ml-4' type='submit'>บันทึก</Button> 
            </form>
            <div className="text-center">
                <span className="px-4 py-2 rounded-xl text-warning-500 bg-warning-50 border-2 border-warning-500">มีผลทันทีกับการเปลี่ยนแปลงปีสัญญาการทำรายการ</span>
            </div>
        </div>
    )
}

PromiseYear.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}