import Helper from "@/classes/Helper.class";
import Layout from "@/components/Layout";
import { acceptPromiseDocument, cancelPromiseDocument, checkQuota, endPromiseDocument, getPromiseDocumentByGroupId, updatePromiseDocument } from "@/store/actions/promiseDocumentAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SectionForm, UserSlotComponent, guaranteeType } from "./promise-form";
import { Button, Divider } from "@nextui-org/react";
import { setDialog, setTitle } from "@/store/slices/utilSlice";
import { setInsertSlot, setInsertSlotType } from "@/store/slices/memberSlice";
import { FaCheck, FaCheckDouble, FaFilePdf, FaTimes } from "react-icons/fa";
import { showConfirm } from "@/store/actions/confirmAction";
import { showToast } from "@/store/actions/toastAction";
import readTemplatePDF from "../../../plugins/export-pdf";
import ReadCardDialog from "@/components/ReadCardDialog";
import { client } from "@/classes";
import { checkOld } from "@/helper/helper";
import moment from "moment";
import PDFDialogDialog from "@/components/PDFDialog";

export default function PromiseFinal() {
  const router = useRouter();
  const typeTxt = {
    short: "กู้ระยะสั้น",
    long: "กู้ระยะยาว",
    business: "กู้ฉุกเฉิน/ธุรกิจ",
  };
  const groupId = router.query.groupId;
  const dispatch = useDispatch();
  const memberDocs = useSelector((state) => state.promiseDocument.memberDocs);
  function init() {
    dispatch(getPromiseDocumentByGroupId(groupId));
  }
  const insertSlot = useSelector((state) => state.member.insertSlot);
  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [router.isReady]);
  const receiveTxt = {
    member: "ผู้กู้",
    guarantorFirst: "ผู้ค้ำประกันคนที่ 1",
    guarantorSecond: "ผู้ค้ำประกันคนที่ 2",
    approver: "ผู้อนุมัติ",
  };
  const [instDataTo, setInstDataTo] = useState("guarantorFirst");
  const [isInsertCardOpen, setIsInsertCardOpen] = useState(false);
  function handleInsertCard(insertDataTo) {
    setIsInsertCardOpen(true);
    setInstDataTo(insertDataTo);
  }
  function setInsertDataSlot(data) {
    dispatch(
      setInsertSlot({
        [instDataTo]: data,
      })
    );
  }

  function handleUpdateCitizenData() {
    dispatch(
      showConfirm("ยืนยันการอัพเดทข้อมูลบัตรประชาชน", () => {
        console.log(insertSlot);
        dispatch(
          updatePromiseDocument(groupId, {
            witness1_citizen_id: insertSlot.guarantorFirst ? insertSlot.guarantorFirst.citizen_id : null,
            witness2_citizen_id: insertSlot.guarantorSecond ? insertSlot.guarantorSecond.citizen_id : null,
            manager_citizen_id: insertSlot.manager ? insertSlot.manager.citizen_id : null,
            employee_citizen_id: insertSlot.employee ? insertSlot.employee.citizen_id : null,
          })
        );
      })
    );
  }
  function memberCheckQuota(citizen_id, slot) {
    dispatch(
      checkQuota(citizen_id, () => {
        dispatch(showToast("ผู้ค้ำประกันเกินจำนวนครั้งที่กำหนด", "bg-red-500", 3000));
        dispatch(
          setInsertSlot({
            [slot]: null,
          })
        );
      })
    );
  }
  useEffect(() => {
    if (insertSlot.guarantorFirst && insertSlot.guarantorSecond) {
      if (insertSlot.guarantorFirst?.citizen_id === insertSlot.guarantorSecond?.citizen_id) {
        dispatch(showToast("ไม่สามารถใช้ผู้ค้ำประกันคนเดียวกันได้", "bg-red-500", 3000));
        dispatch(
          setInsertSlot({
            guarantorFirst: null,
            guarantorSecond: null,
          })
        );
        return;
      } else if (memberDocs[0]?.citizen_id === insertSlot.guarantorFirst?.citizen_id) {
        dispatch(showToast("ไม่สามารถใช้ผู้กู้เป็นผู้ค้ำประกันได้", "bg-red-500", 3000));
        dispatch(
          setInsertSlot({
            guarantorFirst: null,
          })
        );
        return;
      } else if (memberDocs[0]?.citizen_id === insertSlot.guarantorSecond?.citizen_id) {
        dispatch(showToast("ไม่สามารถใช้ผู้กู้เป็นผู้ค้ำประกันได้", "bg-red-500", 3000));
        dispatch(
          setInsertSlot({
            guarantorSecond: null,
          })
        );
        return;
      } else if (insertSlot.guarantorFirst) {
        memberCheckQuota(insertSlot.guarantorFirst.citizen_id, "guarantorFirst");
      }
    }
  }, [insertSlot]);

  useEffect(() => {
    if (insertSlot.guarantorFirst) {
      memberCheckQuota(insertSlot.guarantorFirst?.citizen_id, "guarantorFirst");
    }
  }, [insertSlot.guarantorFirst]);
  useEffect(() => {
    if (insertSlot.guarantorSecond) {
      memberCheckQuota(insertSlot.guarantorSecond?.citizen_id, "guarantorSecond");
    }
  }, [insertSlot.guarantorSecond]);

  function handleAcceptPromise() {
    dispatch(
      showConfirm("ยืนยันการอนุมัติสัญญานี้", () => {
        dispatch(acceptPromiseDocument(groupId));
      })
    );
  }
  function handleEndPromise() {
    dispatch(
      showConfirm("ยืนยันการสิ้นสุดสัญญานี้", () => {
        dispatch(endPromiseDocument(groupId));
      })
    );
  }
  async function managerConfirmCitizenId(citizen_id) {
    try {
      const check = await client.checkManager(citizen_id);
      if (check) {
        handleEndPromise();
      }
    } catch (error) {
      dispatch(showToast(error, "bg-red-500", 3000));
    }
  }
  function handleCancelPromise() {
    dispatch(
      showConfirm("ยืนยันการยกเลิกสัญญานี้", () => {
        dispatch(cancelPromiseDocument(groupId));
      })
    );
  }
  async function handleOpenPdfDialog() {
    const pdf = await readTemplatePDF(memberDocs, "เอกสารสัญญาของ " + memberDocs[0].loaner.first_name + " " + memberDocs[0].loaner.last_name + " เลขที่ " + memberDocs[0].id + "/" + memberDocs[0].promise_year);
    pdf.export();
  }
  const [pdfUrl, setPdfUrl] = useState("");
  async function openPdfDialog() {
    const pdf = await readTemplatePDF(memberDocs, "เอกสารสัญญาของ " + memberDocs[0].loaner.first_name + " " + memberDocs[0].loaner.last_name + " เลขที่ " + memberDocs[0].id + "/" + memberDocs[0].promise_year);
    const data = pdf.blobUrl;
    console.log(data)
    setPdfUrl(data);
    dispatch(setDialog({ pdfDialog: true }));
  }
  const [isInsertCardConfirmEndOpen, setIsInsertCardConfirmEndOpen] = useState(false);
  const findGuaranteeType = (type) => guaranteeType.find((i) => i.value === type);
  return (
    <div>
      <div className="p-8 bg-gray-100">
        <h3 className="text-2xl text-default-900 font-semibold">รายงานสถานะสัญญา</h3>
      </div>
      {memberDocs.length > 0 && (
        <div className="p-8">
          <div className="text-xl text-default-900 font-semibold mb-3">
            รายละเอียด <span className="px-3 py-1 text-sm rounded-full bg-green-500 text-white">{groupId}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-3xl mb-4">
            <ul className="flex flex-col gap-2">
              <li className="flex items-center">
                <div className="w-44">ผู้กู้:</div> {memberDocs[0].citizen_id} - {memberDocs[0]?.loaner?.first_name} {memberDocs[0]?.loaner?.last_name} {`(${checkOld(moment(memberDocs[0]?.loaner?.birth_date))} ปี)`} - ที่อยู่ {memberDocs[0]?.loaner?.address}
              </li>
              <li className="flex items-center">
                <div className="w-44">ผู้ค้ำประกัน 1:</div> {memberDocs[0].witness1_citizen_id || "ยังไม่ได้ระบุข้อมูล"} - {memberDocs[0]?.witness1?.first_name} {memberDocs[0]?.witness1?.last_name} {`(${checkOld(moment(memberDocs[0]?.witness1?.birth_date))} ปี)`} - ที่อยู่ {memberDocs[0]?.witness1?.address}
              </li>
              <li className="flex items-center">
                <div className="w-44">ผู้ค้ำประกัน 2:</div> {memberDocs[0].witness2_citizen_id || "ยังไม่ได้ระบุข้อมูล"} - {memberDocs[0]?.witness2?.first_name} {memberDocs[0]?.witness2?.last_name} {`(${checkOld(moment(memberDocs[0]?.witness2?.birth_date))} ปี)`} - ที่อยู่ {memberDocs[0]?.witness2?.address}
              </li>
              <li className="flex items-center">
                <div className="w-44">ผู้จัดการ:</div> {memberDocs[0].manager_citizen_id || "ยังไม่ได้ระบุข้อมูล"} - {memberDocs[0]?.manager?.first_name} {memberDocs[0]?.manager?.last_name}
              </li>
              <li className="flex items-center">
                <div className="w-44">พนักงาน:</div> {memberDocs[0].employee_citizen_id || "ยังไม่ได้ระบุข้อมูล"} - {memberDocs[0]?.employee?.first_name} {memberDocs[0]?.employee?.last_name}
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {memberDocs.map((i, key) => (
              <div className="mb-4 p-4 rounded-3xl bg-gray-100">
                <h3 className="text-lg font-semibold text-green-500 mb-2">
                  สัญญาที่ {key + 1}/{memberDocs.length}
                </h3>
                <Divider />
                <ul className="flex flex-col gap-2 mt-2" key={key}>
                  <li className="flex items-center">
                    <div className="w-44">เลขที่:</div> {i.running_number}/{i.promise_year}
                  </li>
                  <li className="flex items-center">
                    <div className="w-44">ประเภทสัญญา:</div> {typeTxt[i.type]}
                  </li>
                  <li className="flex items-center">
                    <div className="w-44">วันที่ทำสัญญา:</div> {Helper.formatDate(i.timestamp)}
                  </li>
                  <li className="flex items-center">
                    <div className="w-44">วันที่ครบกำหนด:</div> {Helper.formatDate(i.expired_date)}
                  </li>
                  <li className="flex items-center">
                    <div className="w-44">จำนวนเงินกู้:</div> <span className="underline">{Helper.formatNumber(i.amount)}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-44">เหตุผลการกู้ยืม:</div> <span className="underline">{i.reason}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-44">ประเภทการค้ำประกัน:</div> <span className="underline">{findGuaranteeType(i.guarantee_type)?.name || "-"}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-44">รายละเอียดการค้ำ:</div> <span className="underline">{i.guarantee_value}</span>
                  </li>
                  <li>
                    <li className="flex items-center font-semibold text-lg">
                      <div className="w-44">สถานะ:</div> <span className="underline">{i.status === 1 ? <span className="text-green-500">อยู่ในสัญญา</span> : i.status === 0 ? <span className="text-yellow-500">สัญญาไม่สมบูรณ์</span> : i.status === 2 ? <span className="text-red-500">สัญญาสิ้นสุด</span> : <span className="text-gray-500">ยกเลิกสัญญา</span>}</span>
                    </li>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          {memberDocs[0].guarantee_type === "guarantor" && (
            <SectionForm title={"ข้อมูลผู้ค้ำประกัน"}>
              <div className="grid grid-cols-2 gap-4">
                {!memberDocs[0].witness1_citizen_id && <UserSlotComponent onClick={() => handleInsertCard("guarantorFirst")} description={"ผู้ค้ำประกันคนที่ 1"} fullname={insertSlot.guarantorFirst ? insertSlot.guarantorFirst.first_name + " " + insertSlot.guarantorFirst.last_name : ""} citizen_id={insertSlot.guarantorFirst ? insertSlot.guarantorFirst.citizen_id : ""}></UserSlotComponent>}
                {!memberDocs[0].witness2_citizen_id && <UserSlotComponent onClick={() => handleInsertCard("guarantorSecond")} description={"ผู้ค้ำประกันคนที่ 2"} fullname={insertSlot.guarantorSecond ? insertSlot.guarantorSecond.first_name + " " + insertSlot.guarantorSecond.last_name : ""} citizen_id={insertSlot.guarantorSecond ? insertSlot.guarantorSecond.citizen_id : ""}></UserSlotComponent>}
              </div>
            </SectionForm>
          )}
          <SectionForm title={"ข้อมูลผู้จัดการ/พนักงาน"}>
            <div className="grid grid-cols-2 gap-4">
              {!memberDocs[0].manager_citizen_id && <UserSlotComponent onClick={() => handleInsertCard("manager")} description={"ผู้จัดการ"} fullname={insertSlot.manager ? insertSlot.manager.first_name + " " + insertSlot.manager.last_name : ""} citizen_id={insertSlot.manager ? insertSlot.manager.citizen_id : ""}></UserSlotComponent>}
              {!memberDocs[0].employee_citizen_id && <UserSlotComponent onClick={() => handleInsertCard("employee")} description={"พนักงาน"} fullname={insertSlot.employee ? insertSlot.employee.first_name + " " + insertSlot.employee.last_name : ""} citizen_id={insertSlot.employee ? insertSlot.employee.citizen_id : ""}></UserSlotComponent>}
            </div>
            {memberDocs[0].manager_citizen_id && memberDocs[0].employee_citizen_id && <div>- ได้รับข้อมูลของผู้จัดการและพนักงานแล้ว -</div>}
          </SectionForm>
          <div className="flex justify-center gap-4">
            <Button color="primary" size="lg" onClick={() => router.push("/dashboard/promise-list")} className="items-center gap-2 w-full">
              กลับไปหน้ารายการสัญญา
            </Button>
            {memberDocs[0]?.status === 0 && (
              <Button color="success" size="lg" onClick={handleUpdateCitizenData} className="items-center gap-2 w-full text-white">
                <FaCheck /> บันทึกข้อมูลของสัญญานี้
              </Button>
            )}
            {memberDocs[0]?.status === 0 && (
              <Button color="success" size="lg" onClick={handleAcceptPromise} className="items-center gap-2 w-full text-white">
                <FaCheck /> อนุมัติสัญญานี้
              </Button>
            )}
            {memberDocs[0]?.status === 1 && (
              <Button color="success" variant="flat" size="lg" onClick={setIsInsertCardConfirmEndOpen} className="items-center gap-2 w-full">
                <FaCheckDouble /> สิ้นสุดสัญญา
              </Button>
            )}
            {memberDocs[0]?.status === 1 ||
              (memberDocs[0]?.status === 0 && (
                <Button color="danger" variant="ghost" size="lg" onClick={handleCancelPromise} className="items-center gap-2 w-full">
                  <FaTimes /> ยกเลิกสัญญาฉบับนี้
                </Button>
              ))}
            {memberDocs[0]?.status === 1 && (
              <Button color="danger" variant="ghost" size="lg" onClick={openPdfDialog} className="items-center gap-2 w-full">
                <FaFilePdf /> ดูเอกสาร
              </Button>
            )}
            {memberDocs[0]?.status === 1 && (
              <Button color="danger" variant="ghost" size="lg" onClick={handleOpenPdfDialog} className="items-center gap-2 w-full">
                <FaFilePdf /> ดาวน์โหลดเอกสารสัญญา
              </Button>
            )}
          </div>
        </div>
      )}
      <ReadCardDialog isOpen={isInsertCardOpen} callback={(data) => setInsertDataSlot(data)} onClose={() => setIsInsertCardOpen(false)} />
      <ReadCardDialog isOpen={isInsertCardConfirmEndOpen} callback={(data) => managerConfirmCitizenId(data.citizen_id)} onClose={() => setIsInsertCardConfirmEndOpen(false)} />
      <PDFDialogDialog blobUrl={pdfUrl} />
    </div>
  );
}

PromiseFinal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
