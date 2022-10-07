import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Styles from "./Navbar.module.scss"
import jwt_decode from "jwt-decode";
import { Dropdown, Menu, notification, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const Navbar = () => {

    const [user, setUser] = useState<any>(null);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("store");
        window.location.reload();
        notification.success({
            message: 'Successfully logged out!',
        })
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const decoded = jwt_decode(token)
            setUser(decoded)
        }
    }, [])

    const menu = (
        <Menu
            items={[
                // {
                //     label: <Link href="/profile">Profile</Link>,
                //     key: '0',
                // },
                {
                    label: 'Logout',
                    key: '3',
                    onClick: logout
                },
            ]}
        />
    );

    return (
        <div className={"d-flex align-items-center"}>
            {!user ? <Link href="/sign-in" passHref>
                <a className={Styles.navbar_item}>
                    Sign In
                </a>
            </Link> : <Dropdown className={Styles.profile_dropdown} overlay={menu} trigger={['click']}>
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        {user?.name}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>}
        </div>
    )
}

export default Navbar
