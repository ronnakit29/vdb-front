import Layout from '@/components/Layout'
import React from 'react'

export default function PromiseReport() {
    return (
        <div>PromiseReport</div>
    )
}

PromiseReport.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
