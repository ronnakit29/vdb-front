import React from 'react'
import UserComponent from './UserComponent'
import { Button, Divider, Listbox, ListboxItem } from '@nextui-org/react'
import routes from '@/routes'
import { useRouter } from 'next/router'
import ItemCounter from './ItemCounter'
import { FaBug, FaChartArea, FaChartPie, FaChevronRight, FaCpanel } from 'react-icons/fa'
import IconWrapper from './IconWrapper'
import { client } from '@/classes'
import { GoSignOut } from 'react-icons/go'

export default function Sidebar() {
    const router = useRouter()
    const iconKey = [
        {
            key: 'dashboard',
            icon: <FaChartPie className="text-lg" />
        }
    ]
    function findIcon(key) {
        const icon = iconKey.find(i => i.key === key)
        return icon?.icon
    }
    function logout() {
        client.setAuth(null)
        router.push('/login')
    }
    const asPath = router.asPath
    return (
        <aside className='h-screen bg-white shadow-xl w-full max-w-[250px]'>
            <div className="p-8">
                <h2 className="text-xl font-semibold text-center mb-5">เมนูหลัก</h2>
                <Divider />
                <div className="pt-5 pb-3">
                    <UserComponent />
                </div>
                <Divider />
            </div>
            {routes.map((i, key) =>
                i?.children ? <div key={key}>
                    {/* <h3 className="text-base font-semibold text-gray-500 text-center py-2">
                        {i.title}
                    </h3> */}
                    <Listbox
                        aria-label="User Menu"
                        className="p-0 gap-0 divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible rounded-none"
                        itemClasses={{
                            base: "px-3 rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                        }}
                    >
                        {(i?.children || []).map((x, xkey) => <ListboxItem
                        // asPath
                            className={asPath === x.path ? 'bg-gray-300/80' : ''}
                            onClick={() => router.push(x.path)}
                            key={xkey} endContent={<div className="flex items-center gap-1 text-default-400">
                                <FaChevronRight />
                            </div>}
                            startContent={
                                <IconWrapper className="bg-success/10 text-success">
                                    {findIcon(x.key)}
                                </IconWrapper>
                            }
                        >
                            {x.title}
                        </ListboxItem>)}
                    </Listbox>
                </div> : <Listbox key={key}
                    aria-label="User Menu"
                    className="p-0 gap-0 divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible rounded-none"
                    itemClasses={{
                        base: "px-3 rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                    }}
                >
                    <ListboxItem
                        onClick={() => router.push(i.path)}
                        className={asPath === i.path ? 'bg-gray-300/80' : ''}
                        endContent={<div className="flex items-center gap-1 text-default-400">
                            <FaChevronRight />
                        </div>}
                        startContent={
                            <IconWrapper className="bg-success/10 text-success">
                                {findIcon(i.key)}
                            </IconWrapper>
                        }
                    >
                        {i.title}
                    </ListboxItem>
                </Listbox>
            )}
            <Listbox
                aria-label="User Menu"
                className="p-0 gap-0 divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible rounded-none"
                itemClasses={{
                    base: "px-3 rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                }}
            >
                <ListboxItem
                    onClick={logout}
                    endContent={<div className="flex items-center gap-1 text-default-400">
                        <FaChevronRight />
                    </div>}
                    startContent={
                        <IconWrapper className="bg-danger/10 text-danger">
                            <GoSignOut />
                        </IconWrapper>
                    }
                >
                    ออกจากระบบ
                </ListboxItem>
            </Listbox>
        </aside>
    )
}
