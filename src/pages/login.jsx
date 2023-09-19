import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Button,
} from '@nextui-org/react';

import packageJson from '../../package.json';
import { client } from '@/classes';
import { useDispatch } from 'react-redux';
import { showToast } from '@/store/actions/toastAction';
import ToastComponent from '@/components/ToastComponent';
import { useRouter } from 'next/router';
import { setUser } from '@/store/slices/userSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if(!username || !password) throw new Error('กรุณากรอกข้อมูลให้ครบ');
      await client.login(username, password);
      router.push('/dashboard')
    } catch (error) {
      dispatch(showToast(error.message || error ||  'เกิดข้อผิดพลาด', 'bg-red-500', 3000));
      setLoading(false);
    }
  }
  async function getProfile() {
    try {
      const userProfile = await client.profile();
      dispatch(setUser(userProfile.data));
      router.push('/dashboard');
    } catch (error) {
    }
  }
  useEffect(()=>{
    if(router.isReady) {
      getProfile();
    }
  },[router.isReady])
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex gap-3">
          <Image
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">เข้าสู่ระบบ</p>
            <p className="text-small text-default-500">ระบบธนาคารหมู่บ้านเพื่อสวัสดิการชุมชน</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <Input type='text' label="ชื่อผู้ใช้งาน" placeholder="กรอกชื่อผู้ใช้งาน" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input type='password' label="รหัสผ่าน" placeholder="กรอกรหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button color="primary" auto type='submit' isLoading={loading}>เข้าสู่ระบบ</Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter className='justify-center'>
          โปรแกรมเวอร์ชั่น {packageJson.version}
        </CardFooter>
      </Card>
      <ToastComponent />
    </div>
  );
}
