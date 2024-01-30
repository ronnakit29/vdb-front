import ExcelReader from "@/components/ExcelReader";
import Layout from "@/components/Layout";
import { Divider } from "@nextui-org/react";
import React from "react";

export default function Create() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">รายรับรายจ่ายประจำเดือน</h1>
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
