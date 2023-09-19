import { Button, Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { closeConfirm } from '@/store/actions/confirmAction'
import { FaTimes } from 'react-icons/fa'
export default function ConfirmDialog() {
    const isOpen = useSelector(state => state.util.confirm.isOpen)
    const message = useSelector(state => state.util.confirm.message)
    const onConfirm = useSelector(state => state.util.confirm.onConfirm)
    const dispatch = useDispatch()
    function handleClose() {
        dispatch(closeConfirm())
    }
    function handleConfirm() {
        if(onConfirm) {
            onConfirm()
            handleClose()
        }
    }
    return (
        <AnimatePresence>
            {isOpen && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex w-full fixed bg-black bg-opacity-20 z-[99] h-screen top-0 left-0 items-center justify-center'>
                <motion.div initial={{ opacity: 0, translateY: -100 }} animate={{ opacity: 1, translateY: 0 }} exit={{ opacity: 0, translateY: -100 }} className='w-full max-w-md'>
                    <Card>
                        <CardBody>
                            <div>
                                <p className='text-xl font-semibold text-center'>{message}</p>
                            </div>
                            <div className='flex justify-center gap-4 mt-5'>
                                <Button color='primary' type='button' variant='flat' onClick={handleConfirm}>ยืนยัน</Button>
                                <Button color='danger' type='button' variant='flat' onClick={handleClose}>ยกเลิก</Button>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            </motion.div>}
        </AnimatePresence>
    )
}
