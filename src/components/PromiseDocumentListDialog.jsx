import React, { useEffect } from 'react'
import DialogComponent from './Dialog'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../store/slices/utilSlice'
import { CardBody } from '@nextui-org/react'

function PromiseDocumentListDialog() {
    const promiseDocumentListDialog = useSelector(state => state.util.dialog.promiseDocumentList)
    const promiseDocumentListTitle = useSelector(state => state.util.title.promiseDocumentList)
    const dispatch = useDispatch()
    function handleClose() {
        dispatch(setDialog({ promiseDocumentList: false }))
    }
    function init() {

    }
    useEffect(() => {
       if(promiseDocumentListDialog) {
           init()
       }
    }, [promiseDocumentListDialog])
    return (
        <DialogComponent isOpen={promiseDocumentListDialog} title={promiseDocumentListTitle} onClose={handleClose} >
            <CardBody>
               
            </CardBody>
        </DialogComponent>
    )
}

export default PromiseDocumentListDialog