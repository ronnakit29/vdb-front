import React, { useEffect } from 'react'
import DialogComponent from './Dialog'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../store/slices/utilSlice'
import { Button, CardBody, Input, Select, SelectItem } from '@nextui-org/react'
import { createUser } from '@/store/actions/userAction'
import { useRouter } from 'next/router'
import { showConfirm } from '@/store/actions/confirmAction'
import { hideDialog } from '@/store/actions/dialogAction'
import { getVillageList } from '@/store/actions/villageAction'

function UserDialog() {
    const userDialog = useSelector(state => state.util.dialog.user)
    const userTitle = useSelector(state => state.util.title.user)
    const dispatch = useDispatch()
    const router = useRouter()
    function handleClose() {
        dispatch(hideDialog("user"))
    }
    const initFormData = {
        username: "",
        password: "",
        fullname: "",
        role: "",
        tel: "",
        email: "",
        village_code: ""
    }
    const roles = [
        {
            label: "ผู้จัดการ",
            value: "manager"
        },
        {
            label: "พนักงาน",
            value: "employee"
        }
    ]
    const [formData, setFormData] = React.useState(initFormData)
    function resetForm() {
        setFormData(initFormData)
    }
    async function handleCreateUser() {
        dispatch(showConfirm("ยืนยันการเพิ่มผู้ใช้งาน", () => {
            dispatch(createUser({ ...formData }, () => {
                handleClose()
                resetForm()
            }))
        }))
    }
    const villageList = useSelector(state => state.village.villageList)
    useEffect(() => {
        const findVillage = villageList.find(i => i.id === router.query.vid)
        setFormData({ ...formData, village_code: findVillage?.code })
    }, [villageList])
    function onSubmit(e) {
        e.preventDefault()
        handleCreateUser()
    }
    function init() {
        dispatch(getVillageList())
        resetForm()
    }
    useEffect(() => {
        if (userDialog) {
            init()
        }
    }, [userDialog])
    return (
        <DialogComponent isOpen={userDialog} title={userTitle} onClose={() => handleClose()}>
            <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                <Input label="ชื่อผู้ใช้งาน" placeholder="ชื่อผู้ใช้งาน" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                <Input label="รหัสผ่าน" placeholder="รหัสผ่าน" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <Input label="ชื่อ-นามสกุล" placeholder="ชื่อ-นามสกุล" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
                <Select label="ตำแหน่ง" placeholder="ตำแหน่ง" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    {roles.map((i, key) => <SelectItem key={key} value={i.value} >{i.label}</SelectItem>)}
                </Select>
                <Input label="เบอร์โทร" placeholder="เบอร์โทร" value={formData.tel} onChange={(e) => setFormData({ ...formData, tel: e.target.value })} />
                <Input label="อีเมล" placeholder="อีเมล" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <Select label="หมู่บ้าน" placeholder="หมู่บ้าน" value={formData.village_code} onChange={(e) => setFormData({ ...formData, village_code: e.target.value })}>
                    {villageList.map((i, key) => <SelectItem key={key} value={i.code} >{i.name}</SelectItem>)}
                </Select>
                <Button color='success' type='submit' className='text-white'>บันทึก</Button>
            </form>
        </DialogComponent>
    )
}

export default UserDialog