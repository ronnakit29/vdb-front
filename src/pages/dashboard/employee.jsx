import EmployeeTable from '@/components/EmployeeTable'
import Layout from '@/components/Layout'
import { getUserList } from '@/store/actions/userAction'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StatCard } from '.'
import { FaUserSecret } from 'react-icons/fa'
import { setDialog } from '@/store/slices/utilSlice'
import { showDialog } from '@/store/actions/dialogAction'

export default function Employee() {
    const dispatch = useDispatch();
    const router = useRouter();
    function getUserListByVillageId(vid) {
        dispatch(getUserList(vid))
    }
    const userList = useSelector(state => state.user.userList)
    function init() {
        getUserListByVillageId(router.query.vid)
    }
    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.isReady])
    function handleCreateUser() {
        dispatch(showDialog("user", "เพิ่มพนักงาน"))
    }
    return (
        <div>
            <div className="p-8">
                <div className="grid grid-cols-3 gap-4">
                    <StatCard title={"จำนวนพนักงาน"} value={userList.length} color={'bg-sky-500'} icon={<FaUserSecret />}></StatCard>
                </div>
            </div>
            <div className="px-8 py-2 flex justify-end">
                <Button color='success' className='text-white' onClick={handleCreateUser}>เพิ่มพนักงาน</Button>
            </div>
            <div className="py-2 px-8">
                <EmployeeTable data={userList} onReload={init} />
            </div>
        </div>
    )
}

Employee.getLayout = function getLayout(page) {
    return <Layout>
        {page}
    </Layout>
}