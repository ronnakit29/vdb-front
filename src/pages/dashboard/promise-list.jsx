import Layout from "@/components/Layout";
import React, { useEffect } from "react";
import { StatCard } from ".";
import TableComponent from "@/components/TableComponent";
import PromiseListTable from "@/components/PromiseListTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getPromiseDocumentAnalysis,
  getPromiseDocumentList,
} from "@/store/actions/promiseDocumentAction";
import { useRouter } from "next/router";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import moment from "moment";
import { FaChartLine, FaList } from "react-icons/fa";
import Helper from "@/classes/Helper.class";
import { GoArrowBoth } from "react-icons/go";
import { getVillageList } from "@/store/actions/villageAction";

export default function PromiseList() {
  const dispatch = useDispatch();
  const promiseDocumentList = useSelector(
    (state) => state.promiseDocument.promiseDocumentList
  );

  const router = useRouter();
  const type = router.query.type || "";
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  function init() {
    if (startDate && endDate && villageSelect) {
      dispatch(getPromiseDocumentList(type, startDate, endDate, villageSelect));
      dispatch(
        getPromiseDocumentAnalysis(type, startDate, endDate, villageSelect)
      );
    }
    dispatch(getVillageList());
  }
  const analysis = useSelector((state) => state.promiseDocument.analysisReport);
  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [router.isReady]);
  useEffect(() => {
    init();
  }, [type, startDate, endDate]);
  function gotoStartDateRoute(value) {
    setStartDate(value);
    const { query } = router;
    router.push({
      pathname: router.pathname,
      query: { ...query, startDate: value },
    });
  }
  function gotoEndDateRoute(value) {
    setEndDate(value);
    const { query } = router;
    router.push({
      pathname: router.pathname,
      query: { ...query, endDate: value },
    });
  }
  function gotoVillageRoute(value) {
    setVillageSelect(value);
    const { query } = router;
    router.push({
      pathname: router.pathname,
      query: { ...query, village: value },
    });
  }
  useEffect(() => {
    if (router.query.startDate) {
      setStartDate(router.query.startDate);
    }
    if (router.query.endDate) {
      setEndDate(router.query.endDate);
    }
  }, [router.query.startDate, router.query.endDate]);
  const typeList = [
    {
      label: "ทั้งหมด",
      value: "",
    },
    {
      label: "กู้ระยะสั้น",
      value: "short",
    },
    {
      label: "กู้ระยะยาว",
      value: "long",
    },
    {
      label: "กู้ฉุกเฉิน/ธุรกิจ",
      value: "business",
    },
  ];
  const villageList = useSelector((state) => state.village.villageList);
  const [villageSelect, setVillageSelect] = React.useState("");
  //   useEffect(() => {
  //     if (villageList.length > 0 && !villageSelect) {
  //       setVillageSelect(villageList[0].id);
  //     }
  //   }, [villageList]);
  useEffect(() => {
    init();
  }, [villageSelect]);
  useEffect(() => {
    if (router.isReady) {
      if (!router.query.startDate) {
        gotoStartDateRoute(moment().startOf("month").format("YYYY-MM-DD"));
      }
      if (!router.query.endDate) {
        gotoEndDateRoute(moment().endOf("month").format("YYYY-MM-DD"));
      }
      gotoVillageRoute(router.query.village || "");
    }
  }, [router.isReady]);
  return (
    <div>
      <div className="p-8 bg-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            value={Helper.formatNumber(analysis.count, 0)}
            title={"จำนวนสัญญา"}
            icon={<FaList />}
          ></StatCard>
          <StatCard
            value={Helper.formatNumber(analysis.sum)}
            title={"ยอดเงินกู้ทั้งหมด"}
            icon={<FaChartLine />}
            color={"bg-green-500"}
          ></StatCard>
          <StatCard
            value={Helper.formatNumber(analysis.hedge_fund)}
            title={"ยอดเงินประกันความเสี่ยง"}
            icon={<GoArrowBoth />}
            color={"bg-yellow-500"}
          ></StatCard>
        </div>
      </div>
      <div className="px-8 py-2">
        <select
          placeholder="เลือกหมู่บ้าน"
          className="w-full bg-gray-50 transition-all hover:bg-gray-100 px-4 py-2 rounded-xl outline-none"
          value={villageSelect}
          onChange={(e) => gotoVillageRoute(e.target.value)}
        >
          {villageList.map((i, key) => (
            <option key={key} value={i.id}>
              {i.code} | {i.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex px-8 py-4 gap-4">
        {typeList.map((i, key) => (
          <Button
            key={key}
            color={type === i.value ? "primary" : "default"}
            onClick={() =>
              router.push({
                pathname: router.pathname,
                query: { ...router.query, type: i.value },
              })
            }
          >
            {i.label}
          </Button>
        ))}
      </div>
      <div className="px-8 py-4 flex gap-4 items-center">
        <Input
          variant="bordered"
          type="date"
          className="w-full"
          label="วันที่เริ่มต้น"
          value={startDate}
          onChange={(e) => gotoStartDateRoute(e.target.value)}
        />
        <Input
          variant="bordered"
          type="date"
          className="w-full"
          label="วันที่สิ้นสุด"
          value={endDate}
          onChange={(e) => gotoEndDateRoute(e.target.value)}
        />
        <Button size="lg" color="primary" onClick={init}>
          รีเฟรช
        </Button>
      </div>
      <div className="px-8 py-4 overflow-x-auto">
        <PromiseListTable
          data={promiseDocumentList}
          onReload={init}
        ></PromiseListTable>
      </div>
    </div>
  );
}

PromiseList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
