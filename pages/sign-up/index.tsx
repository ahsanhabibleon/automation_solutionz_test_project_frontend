import Head from 'next/head'
import React from 'react'
import MainLayout from '../../components/MainLayout'
import Register from '../../components/RegisterComp'

const SignUp = () => {
    return (
        <MainLayout>
            <Head>
                <title>Sign Up</title>
            </Head>
            <div className="container">
                <div className="login_register_container">
                    <Register />
                </div>
            </div>
        </MainLayout>
    )
}

export default SignUp
