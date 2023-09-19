import { Avatar, Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import React from 'react'
import ImageToBase64Converter from './ImageToBase64Converter';

export default function MemberCardComponent({ title, fullname, citizenId }) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const imageUrl = serverUrl + '/api/member/image/' + citizenId;
    return (
        <div>
            <Card>
                <CardBody className='flex justify-between gap-4 items-start'>
                    <p className='text-md font-bold'>{title}</p>
                    <div className="flex gap-4 items-center">
                        <ImageToBase64Converter imageUrl={imageUrl} className={'h-24'} />
                        <div className="flex flex-col gap-2">
                            <div>
                                <p className="text-xl text-primary-500 font-semibold">{fullname}</p>
                                <p className="text-sm text-gray-400">{citizenId}</p>
                            </div>
                            <div>
                                <Button size='sm' color='secondary'>ดูข้อมูล</Button>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
