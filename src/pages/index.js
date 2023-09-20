import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { BeatLoader } from 'react-spinners';
export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login')
  }, [router.isReady])
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <BeatLoader color="rgb(6, 171, 0)" />
    </div>
  )
}
