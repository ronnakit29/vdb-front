import Layout from '@/components/Layout'
import React from 'react'

export default function PromiseReporting() {
    return (
        <div>
            <div className="p-8 bg-gray-100">
                <div className="grid grid-cols-3 gap-4">
                    
                </div>
            </div>
        </div>
    )
}

PromiseReporting.getLayout = function getLayout(page) {
    return <Layout>
        {page}
    </Layout>
}