import {
    Button,
    Checkbox,
    Form,
    Input,
    notification,
} from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getToken, setCookieValue } from '../../utils/UserManager';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const Register = ({ redirectUrl, actionType }: { redirectUrl: string, actionType: string }) => {
    const router = useRouter();
    const [form] = Form.useForm();

    const sendPostRequest = async (payload: any) => {
        try {
            const { data } = await axios.post('/api/users/signup', payload)
            if (data?.token) {
                setCookieValue('token', data?.token || '')
                notification.success({
                    message: 'Successfully registered!',
                })
                router.push('/' + redirectUrl + (actionType ? `?action_type=${actionType}` : ''))
            } else {
                notification.error({
                    message: 'Error',
                    description: data?.message || "Something went wrong"
                })
            }
        } catch (error: any) {
            notification.error({
                message: error?.message || 'Something went wrong!',
            })
        }
    };

    const onFinish = (values: any) => {
        sendPostRequest({
            name: values.name,
            email: values.email,
            password: values.password,
        })
    };

    useEffect(() => {
        const token = getToken()
        if (token) {
            router.push('/' + redirectUrl + (actionType ? `?action_type=${actionType}` : ''))
        }
    }, [])

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '86',
            }}
            scrollToFirstError
            className='login_register_form'
            style={{ maxWidth: '500px' }}
        >
            <h1 className='text-center'>Sing Up for a new account</h1>

            <Form.Item
                name="name"
                label="Full Name"
                tooltip="What do you want others to call you?"
                rules={[{ required: true, message: 'Please input your full name!', whitespace: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="E-mail"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your Password!' }, { min: 6, message: 'Password must be at least 6 characters' }, { max: 20, message: 'Password must be at most 20 characters' }, { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, message: 'Password must contain at least one uppercase letter, one lowercase letter and one number' }]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                    },
                ]}
                {...tailFormItemLayout}
            >
                <Checkbox>
                    I have read the <a href="">agreement</a>
                </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
                <br />
                <br />
                Already have an account? <Link href={'/sign-in' + (actionType ? `?action_type=${actionType}` : '')}>
                    <a>
                        Sign In
                    </a>
                </Link>
            </Form.Item>
        </Form>
    );
};

export default Register;