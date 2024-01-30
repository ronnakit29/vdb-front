import React, { useEffect, useRef } from "react";
import DialogComponent from "./Dialog";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../store/slices/utilSlice";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import ReactPdf, { Document } from "react-pdf";
function PDFDialogDialog({ blobUrl }) {
  const isOpen = useSelector((state) => state.util.dialog.pdfDialog);
  const pdfDialogTitle = useSelector((state) => state.util.title.pdfDialog);
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(setDialog({ pdfDialog: false }));
  }
  function init() {}
  const ref = useRef(null);
  useEffect(() => {
    if (blobUrl) {
      console.log("blobUrl", blobUrl);
      setTimeout(() => {
        ref.current.src = blobUrl;
      }, 1000);
    }
  }, [blobUrl]);
  function handleClose() {
    dispatch(setDialog({ pdfDialog: false }));
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.4, type: "spring" }} className="fixed top-0 left-0 w-screen h-screen flex justify-center items-end pb-3 z-[999]">
          <Card className="border-2 border-success-500 w-full max-w-screen-xl h-full relative">
            <CardBody className="flex items-center gap-2">{isOpen && <iframe ref={ref} className="w-full h-full" />}</CardBody>
            <div className="flex justify-center py-1">
              <button onClick={handleClose} className="bg-red-500 px-4 py-1 rounded-full text-white">
                ปิด
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PDFDialogDialog;
