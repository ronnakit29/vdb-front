import { Button } from "@nextui-org/react";
import React from "react";
import { FaLink } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function SupportProgram() {
  const user = useSelector((state) => state.user.user);
  const village_code = user?.village_code;
  const cdnLink =
    "https://s3cloud999web.sgp1.cdn.digitaloceanspaces.com/vdb-file/smartcard-reader-v1.2_use_for_vdbapp_only_x64.zip";
  function linkToSmartCard() {
    const token = localStorage.getItem("token");
    const link =
      "http://localhost:44121/setToken?village_id=" +
      village_code +
      `&token=${token}&webhook_url=` +
      process.env.NEXT_PUBLIC_SERVER_URL
    window.open(link, "_blank");
  }
  return (
    <div className="fixed bottom-1 z-[999] border border-teal-500 text-teal-600 py-1 shadow-lg left-1 px-3 bg-white rounded-full flex gap-2 items-center">
      <div>
        <a href={cdnLink} className="underline">
          โปรแกรมอ่านบัตร
        </a>
      </div>
      <div>
        <button
          className="text-red-500 underline flex items-center gap-2"
          onClick={() => linkToSmartCard()}
        >
          <FaLink /> เชื่อมต่อโปรแกรม
        </button>
      </div>
    </div>
  );
}
