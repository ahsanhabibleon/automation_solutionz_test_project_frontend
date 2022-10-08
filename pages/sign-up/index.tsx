import { Spin } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import MainLayout from '../../components/MainLayout'
import Register from '../../components/RegisterComp'
import { getToken } from '../../utils/UserManager'

const SignUp = () => {
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const redirect = (router?.query?.redirect || '') as string;
    const actionType = (router?.query?.action_type || '') as string;

    useEffect(() => {
        const token = getToken()
        if (token) {
            router.push('/' + redirect + (actionType ? `?action_type=${actionType}` : ''))
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <MainLayout>
            {!loading ? <>
                <Head>
                    <title>Sign Up</title>
                </Head>
                <div className='container'>
                    <div className="login_register_container">
                        <Register redirectUrl={redirect} actionType={actionType} />
                    </div>
                </div>
            </> : <Spin className='full-page-loading' />}
        </MainLayout>
    )
}

export default SignUp
