import Layout from '@/components/Layout'
import { Button } from '@nextui-org/react'
import React from 'react'
import readTemplatePDF from '../../../plugins/export-pdf'

export default function TestPage() {
    return (
        <div>
            <Button color="success" onClick={()=> readTemplatePDF()}>Hello</Button>
        </div>
    )
}

TestPage.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
