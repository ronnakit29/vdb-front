import { hideToast } from '@/store/actions/toastAction';
import { Button } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

export default function ToastComponent() {
    const { visible, message, color, duration } = useSelector((state) => state.toast.toast);
    const dispatch = useDispatch();
    // useEffect(() => {
    //     if (visible) {
    //         const timer = setTimeout(() => {
    //             dispatch(hideToast());
    //         }, duration);

    //         return () => clearTimeout(timer);
    //     }
    // }, [visible, duration, dispatch]);
    return (
        <>
            <AnimatePresence>
                {visible && <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
                    className='fixed top-0 left-0 w-full flex justify-center py-3 z-[999]'>
                    <div className={`px-4 py-3 rounded-xl shadow-xl ${color || "bg-sky-500"} text-white flex items-center justify-between gap-4`}>
                        {message} <button onClick={() => dispatch(hideToast())} className="text-white bg-transparent border-none px-2"><FaTimes /></button>
                    </div>
                </motion.div>}
            </AnimatePresence>
        </>
    )
}
