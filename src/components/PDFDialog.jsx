import React, { useEffect } from 'react'
import DialogComponent from './Dialog'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../store/slices/utilSlice'
import { CardBody } from '@nextui-org/react'

function PDFDialogDialog() {
    const pdfDialogDialog = useSelector(state => state.util.dialog.pdfDialog)
    const pdfDialogTitle = useSelector(state => state.util.title.pdfDialog)
    const dispatch = useDispatch()
    function handleClose() {
        dispatch(setDialog({ pdfDialog: false }))
    }
    function init() {

    }
    useEffect(() => {
       if(pdfDialogDialog) {
           init()
       }
    }, [pdfDialogDialog])
    return (
        <DialogComponent isOpen={pdfDialogDialog} title={pdfDialogTitle} onClose={handleClose} >
            <CardBody>
               
            </CardBody>
        </DialogComponent>
    )
}

export default PDFDialogDialog