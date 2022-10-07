import { Layout } from 'antd';
import React from 'react';
import { propTypes } from './MainLayout.types';
const { Header, Content, Footer } = Layout;
import Styles from './MainLayout.module.scss'
import Navbar from '../Navbar';
import Link from 'next/link';

const MainLayout = ({ children }: propTypes) => (
    <Layout>
        <Header>
            <div className="container">
                <div className='d-flex align-items-center justify-content-between'>
                    <Link href={"/"}>
                        <a className={Styles.logo}>
                            Solutionz
                        </a>
                    </Link>
                    <Navbar />
                </div>
            </div>
        </Header>

        <Content className={Styles.site_layout}>
            <div
                className={Styles.main_content_wrapper}
            >
                {children}
            </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
            Automation Solutionz &copy;{new Date().getFullYear()} All rights reserved
        </Footer>
    </Layout>
);

export default MainLayout;