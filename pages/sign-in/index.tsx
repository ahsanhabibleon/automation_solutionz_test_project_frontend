import { Spin } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import SignInComp from '../../components/SignInComp';
import { getToken } from '../../utils/UserManager';

const SignIn = () => {
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
                    <title>Sign In</title>
                </Head>
                <div className='container'>
                    <div className="login_register_container">
                        <SignInComp redirectUrl={redirect} actionType={actionType} />
                    </div>
                </div>
            </> : <Spin className='full-page-loading' />}
        </MainLayout>
    );
};

export default SignIn;