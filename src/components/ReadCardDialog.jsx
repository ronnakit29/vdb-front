import { client } from '@/classes'
import { Button, Card, CardBody } from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa';

export default function ReadCardDialog({ isOpen, onClose, callback }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            try {
                const response = await client.getMemberFromCard()
                if (response.data) {
                    clearInterval(intervalId);
                    setData(response.data);
                    callback && callback(response.data)
                    onClose && onClose()
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isOpen) {
            setData(null)
            intervalId = setInterval(fetchData, 1000);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='fixed top-0 left-0 w-screen h-screen flex justify-center items-end pb-3 z-[999]'>
                <Card className='border-2 border-success-500'>
                    <CardBody className='flex items-center gap-2'>
                        <span>{!data ? "กำลังอ่านข้อมูลบัตร..." : data.title_name + data.first_name + " " + data.last_name}</span> <Button color="danger" size='sm' variant='light' onClick={() => onClose && onClose()}><FaTimes /></Button>
                    </CardBody>
                </Card>
            </motion.div>}
        </AnimatePresence>
    )
}
