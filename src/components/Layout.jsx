import React, { useEffect } from 'react'
import Navbar from './Navbar'
import InsertCardDialog from './InsertCardDialog'
import { client } from '@/classes';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/slices/userSlice';
import MemberCardComponent from './MemberCardComponent';
import ToastComponent from './ToastComponent';
import ConfirmDialog from './ConfirmDialog';
import PDFDialogDialog from './PDFDialog';
import UserDialog from './UserDialog';
import VillageDialog from './VillageDialog';
import SupportProgram from './SupportProgram'
import CidReader from './CidReader'
export default function Layout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  async function getProfile() {
    try {
      const userProfile = await client.profile();
      dispatch(setUser(userProfile.data));
    } catch (error) {
      router.push('/login');
    }
  }
  useEffect(() => {
    if (router.isReady) {
      getProfile();
    }
  }, [router.isReady])
  return (
    user && <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Navbar />
        <div>
          {children}
          <InsertCardDialog />
        </div>
      </div>
      <ToastComponent />
      <ConfirmDialog />
      <PDFDialogDialog />
      <UserDialog />
      <VillageDialog />
      <SupportProgram />
      {/* <CidReader /> */}
    </div>
  )
}
