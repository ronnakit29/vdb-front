import React from "react";
import TableComponent from "./TableComponent";
import Helper from "@/classes/Helper.class";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import moment from "moment";

export default function PromiseListTable({ data, onReload }) {
  const typeTxt = {
    short: "ระยะสั้น",
    long: "ระยะยาว",
    business: "ฉุกเฉิน/ธุรกิจ",
  };
  const router = useRouter();
  const headers = [
    {
      key: "timestamp",
      label: "วันเวลา",
      format: ({ value, item }) => (
        <div className="flex flex-col gap-2">
          <div>{moment(value).format("DD/MM/YYYY HH:mm:ss")}</div>
          <div>
            <Button
              color="primary"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/promise-final?groupId=${item.group_id}`)
              }
            >
              ดูรายละเอียด
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "running_number",
      label: "หมายเลขสัญญา",
      format: ({ value, item }) => (
        <div className="flex flex-col">
          <div>
            {value}/{item.promise_year}
          </div>
        </div>
      ),
    },
    {
      key: "start_date_end",
      label: "วันที่เริ่มสัญญา",
      format: ({ value, item }) => (
        <div className="flex flex-col">
          <div className="font-semibold">
            เริ่ม: {moment(item.start_date).format("DD/MM/YYYY")}
          </div>
          <div className="text-green-600">
            สิ้นสุด: {moment(item.expired_date).format("DD/MM/YYYY")}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "สถานะ",
      format: ({ value }) =>
        value === 1 ? (
          <span className="text-green-500">อยู่ในสัญญา</span>
        ) : value === 0 ? (
          <span className="text-yellow-500">สัญญาไม่สมบูรณ์</span>
        ) : value === 2 ? (
          <span className="text-red-500">สัญญาสิ้นสุด</span>
        ) : (
          <span className="text-gray-500">ยกเลิกสัญญา</span>
        ),
    },
    {
      key: "x",
      label: "ชื่อผู้กู้",
      format: ({ value, item }) => (
        <div className="flex flex-col">
          <div>{item.title_name + item.first_name + " " + item.last_name}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "ประเภทสัญญา",
      format: ({ value }) => typeTxt[value],
    },
    {
      key: "amount",
      label: "จำนวนเงิน",
      format: ({ value }) => Helper.formatNumber(value),
    },
    {
      key: "hedge_fund",
      label: "ประกันความเสี่ยง",
      format: ({ value }) => Helper.formatNumber(value),
    },
    {
      key: "period",
      label: "ระยะเวลาผ่อนชำระ",
      format: ({ value }) => Helper.formatNumber(value) + " งวด",
    },
    {
      key: "interest",
      label: "อัตราดอกเบี้ย",
      format: ({ value }) => Helper.formatNumber(value) + "%",
    },
    {
      key: "xinterest",
      label: "ดอกเบี้ยต่อเดือน",
      format: ({ value, item }) =>
        Helper.formatNumber((item.amount * item.interest) / 100),
    },
    {
      key: "citizen_id",
      label: "เลขปชช.",
      format: ({ value }) => value,
    },
  ];
  const dataExport = data?.map((i) => {
    return {
      ...i,
      running_number: `${i.running_number}/${i.promise_year}`,
      timestamp: moment(i.timestamp).format("DD/MM/YYYY HH:mm:ss"),
      start_date_end: `เริ่ม: ${moment(i.start_date).format(
        "DD/MM/YYYY"
      )} สิ้นสุด: ${moment(i.expired_date).format("DD/MM/YYYY")}`,
      status:
        i.status === 1
          ? "อยู่ในสัญญา"
          : i.status === 0
          ? "สัญญาไม่สมบูรณ์"
          : i.status === 2
          ? "สัญญาสิ้นสุด"
          : "ยกเลิกสัญญา",
      x: `${i.title_name}${i.first_name} ${i.last_name}`,
      type: typeTxt[i.type],
      amount: Helper.formatNumber(i.amount),
      hedge_fund: Helper.formatNumber(i.hedge_fund),
      period: Helper.formatNumber(i.period) + " งวด",
      citizen_id: i.citizen_id,
      interest: Helper.formatNumber(i.interest) + "%",
      xinterest: Helper.formatNumber((i.amount * i.interest) / 100),
    };
  });
  return (
    <TableComponent
      columns={headers}
      rows={data || []}
      onReload={onReload}
      excelData={dataExport}
    ></TableComponent>
  );
}
