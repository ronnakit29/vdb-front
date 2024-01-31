import ExcelReader from "@/components/ExcelReader";
import Layout from "@/components/Layout";
import { Divider } from "@nextui-org/react";
import moment from "moment";
import React from "react";

export default function Create() {
  const thaiMonth = moment().locale("th").format("M");
  const thaiYear = moment().locale("th").format("YYYY");
  const thaiMonthValue = {
    1: "มกราคม",
    2: "กุมภาพันธ์",
    3: "มีนาคม",
    4: "เมษายน",
    5: "พฤษภาคม",
    6: "มิถุนายน",
    7: "กรกฎาคม",
    8: "สิงหาคม",
    9: "กันยายน",
    10: "ตุลาคม",
    11: "พฤศจิกายน",
    12: "ธันวาคม",
  };
  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">รายรับรายจ่ายประจำเดือน {thaiMonthValue[thaiMonth]}/{Number(thaiYear) + 543}</h1>
      </div>
      <Divider />
      <div>
        <ExcelReader />
      </div>
    </div>
  );
}

Create.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
