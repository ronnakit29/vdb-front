import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../store/slices/utilSlice'
import { CardBody, card } from '@nextui-org/react'
import DialogComponent from './Dialog'
import { getMemberFromCard } from '@/store/actions/memberAction'
import { useRouter } from 'next/router'

function InsertCardDialog() {
    const insertCardDialog = useSelector(state => state.util.dialog.insertCard)
    const insertCardTitle = useSelector(state => state.util.title.insertCard)
    const memberInsertSlot = useSelector(state => state.member.insertSlot)
    const memberInsertSlotType = useSelector(state => state.member.insertSlotType)
    const dispatch = useDispatch()
    function handleClose() {
        dispatch(setDialog({ insertCard: false }))
    }
    const router = useRouter();
    function readSmartCard() {
        dispatch(getMemberFromCard(memberInsertSlotType, callback => {
            // redirect with params
            if (memberInsertSlotType === 'member') {
                router.push('/dashboard/promise-form/?type=' + router.query.type)
            }
            handleClose()
        }))
    }
    function init() {
        return setInterval(() => {
            readSmartCard()
        }, 2000)
    }
    useEffect(() => {
        if (insertCardDialog) {
            const readCard = init()
            return () => {
                clearInterval(readCard)
            }
        }
    }, [insertCardDialog, router.query.type])
    const cardData = memberInsertSlot[memberInsertSlotType]
    return (
        <DialogComponent isOpen={insertCardDialog} title={insertCardTitle} onClose={handleClose} >
            <div className='flex justify-center items-center h-40 bg-gray-100'>
                <p className='text-xl'>
                    {
                        cardData ? cardData.first_name + ' ' + cardData.last_name : 'กำลังอ่านข้อมูลจากบัตรประชาชน...'
                    }
                </p>
            </div>
        </DialogComponent>
    )
}

export default InsertCardDialog