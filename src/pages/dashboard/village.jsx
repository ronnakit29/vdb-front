import Layout from '@/components/Layout'
import VillageTable from '@/components/VillageTable'
import { getVillageList } from '@/store/actions/villageAction'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StatCard } from '.'
import { FaBuilding } from 'react-icons/fa'

export default function Village() {
  const dispatch = useDispatch()
  const villageList = useSelector(state => state.village.villageList)
  function init() {
    dispatch(getVillageList())
  }
  const router = useRouter()
  useEffect(()=>{
    if(router.isReady) {
      init();
    }
  },[router.isReady])
  return (
    <div>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-4">
          <StatCard title={"จำนวนหมู่บ้าน"} value={villageList.length} color={'bg-green-500'} icon={<FaBuilding/>}></StatCard>
        </div>
      </div>
      <div className="px-8">
        <VillageTable data={villageList} onReload={init} />
      </div>
    </div>
  )
}

Village.getLayout = function getLayout(page) {
  return <Layout>
    {page}
  </Layout>
}