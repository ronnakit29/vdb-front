import Layout from '@/components/Layout'
import React, { useEffect } from 'react'
import { StatCard } from '.'
import MemberTable from '@/components/MemberTable'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getMemberList } from '@/store/actions/memberAction'
import { FaUsers } from 'react-icons/fa'

export default function Member() {
  const dispatch = useDispatch()
  const memberCount = useSelector(state => state.member.count)
  const memberList = useSelector(state => state.member.memberList)
  function init() {
    dispatch(getMemberList())
  }
  const router = useRouter()
  useEffect(()=>{
    if(router.isReady) {
      init()
    }
  },[router.isReady])
  return (
    <div>
      <div className="p-8 bg-gray-100">
        <div className="grid grid-cols-3">
          <StatCard value={memberCount} title={"จำนวนสมาชิกผู้กู้ / ผู้ค้ำประกัน"} icon={<FaUsers/>}></StatCard>
        </div>
      </div>
      <div className="p-8">
        <MemberTable data={memberList} onReload={init}></MemberTable>
      </div>
    </div>
  )
}

Member.getLayout = function getLayout(page) {
  return <Layout>
    {page}
  </Layout>
}