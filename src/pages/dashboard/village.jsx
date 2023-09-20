import Layout from '@/components/Layout'
import VillageTable from '@/components/VillageTable'
import { getVillageList } from '@/store/actions/villageAction'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StatCard } from '.'
import { FaBuilding } from 'react-icons/fa'
import { Button } from '@nextui-org/react'
import { setDialog } from '@/store/slices/utilSlice'
import { showDialog } from '@/store/actions/dialogAction'
import { setVillage } from '@/store/slices/villageSlice'

export default function Village() {
  const dispatch = useDispatch()
  const villageList = useSelector(state => state.village.villageList)
  function init() {
    dispatch(getVillageList())
  }
  function handleOpenVillageDialog() {
    dispatch(setVillage(null))
    dispatch(showDialog("village", "เพิ่มหมู่บ้าน"))
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
      <div className="flex justify-end px-8 py-2">
        <Button color='success' className='text-white' onClick={() => handleOpenVillageDialog()}>เพิ่มหมู่บ้าน</Button>
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