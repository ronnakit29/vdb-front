import { Button, Card, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

export default function DialogComponent({ title, children, isOpen, onClose, onConfirm, width = "max-w-md" }) {
  return (
    <Modal isOpen={isOpen} hideCloseButton className={`${width}`} >
      <ModalContent>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
                {children}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" type='button' variant="light" onClick={onClose}>
                ปิด
              </Button>
              {onConfirm && <Button type='button' color="primary" onClick={onConfirm}>
                ยืนยัน
              </Button>}
            </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
