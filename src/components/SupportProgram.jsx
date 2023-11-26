import { Button } from '@nextui-org/react'
import React from 'react'
import { FaLink } from 'react-icons/fa';
import { useSelector } from 'react-redux'

export default function SupportProgram() {
  const user = useSelector((state) => state.user.user);
  const village_code = user?.village_code;
  const link = "http://localhost:44121/setToken?village_id=" + village_code + "&token=1234567890&webhook_url=" + process.env.NEXT_PUBLIC_SERVER_URL
  const cdnLink = "https://cdn.discordapp.com/attachments/1149976743722111036/1178205968732000256/v2.zip"
  return (
    <div className="fixed bottom-1 z-[999] border border-teal-500 text-teal-600 py-1 shadow-lg left-1 px-3 bg-white rounded-full flex gap-2 items-center">

      <div>
        <a href={cdnLink} className="underline" >โปรแกรมอ่านบัตร</a>
      </div>
      <div>
        <a target='_blank' className="text-red-500 underline flex items-center gap-2" href={link}>
          <FaLink /> เชื่อมต่อโปรแกรม
        </a>
      </div>
    </div>
  )
}
