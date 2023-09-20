import React, { useEffect } from 'react'
import DialogComponent from './Dialog'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../store/slices/utilSlice'
import { Button, CardBody, Input } from '@nextui-org/react'
import { hideDialog } from '@/store/actions/dialogAction'
import { createVillage, updateVillage } from '@/store/actions/villageAction'

function VillageDialog() {
    const villageDialog = useSelector(state => state.util.dialog.village)
    const villageTitle = useSelector(state => state.util.title.village)
    const village = useSelector(state => state.village.village)
    const dispatch = useDispatch()
    function handleClose() {
        dispatch(hideDialog("village"))
    }
    const initFormData = {
        code: "",
        name: "",
        working_position: "",
    }
    function resetForm() {
        setFormData(initFormData)
    }
    const [formData, setFormData] = React.useState(initFormData)
    function init() {
        if(village?.id) {
            setFormData({
                id: village.id,
                code: village.code,
                name: village.name,
                working_position: village.working_position,
            })
        } else {
            resetForm()
        }
    }
    function handleCreateVillage() {
        dispatch(createVillage(formData))
    }
    function handleUpdateVillage() {
        dispatch(updateVillage(formData))
    }
    function handleSubmit(e) {
        e.preventDefault()
        if(village?.id) {
            handleUpdateVillage()
        } else {
            handleCreateVillage()
        }
    }
    useEffect(() => {
       if(villageDialog) {
           init()
       }
    }, [villageDialog, village])
    return (
        <DialogComponent isOpen={villageDialog} title={villageTitle} onClose={handleClose} >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input label="รหัสหมู่บ้าน" placeholder="รหัสหมู่บ้าน" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                <Input label="ชื่อหมู่บ้าน" placeholder="ชื่อหมู่บ้าน" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input label="ที่ทำการ" placeholder="ที่ทำการ" value={formData.working_position} onChange={(e) => setFormData({ ...formData, working_position: e.target.value })} />
                <Button color="success" className="text-white" type='submit'>บันทึก</Button>
            </form>
        </DialogComponent>
    )
}

export default VillageDialog