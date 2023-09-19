import React from 'react'
import { useSelector } from 'react-redux'

export default function Navbar() {
  const user = useSelector(state => state.user.user)
  return (
    <nav className='px-8 py-4 bg-green-600 text-white shadow-lg sticky top-0 w-full z-50'>
        <h1 className="text-xl font-semibold">ระบบเงินกู้เครือข่ายธนาคารหมู่บ้าน</h1>
        <p>เพื่อสวัสดิการชุมชน อ.เวียงชัย ({user.village.name})</p>
    </nav>
  )
}
