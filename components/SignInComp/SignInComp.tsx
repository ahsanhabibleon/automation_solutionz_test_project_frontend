import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setCookieValue } from '../../utils/UserManager';

const SignInComp = ({ redirectUrl, actionType }: { redirectUrl: string, actionType: string }) => {

    const router = useRouter();

    const onFinish = (values: any) => {
        sendPostRequest(values);
    };

    const sendPostRequest = async (payload: any) => {
        try {
            await fetch('/api/users/signin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data?.token) {
                        setCookieValue('token', data?.token || '')
                        notification.success({
                            message: 'Successfully signed in!',
                        })
                        router.push('/' + redirectUrl + (actionType ? `?action_type=${actionType}` : ''))
                    } else {
                        notification.error({
                            message: 'Error',
                            description: data?.message || "Something went wrong"
                        })
                    }
                })
                .catch((error) => {
                    notification.error({
                        message: error?.message || 'Something went wrong!',
                    })
                })

        } catch (error: any) {
            notification.error({
                message: error?.message || 'Something went wrong!',
            })
        }
    };


    return (
        <Form
            name="normal_login"
            className="login_register_form"
            onFinish={onFinish}
            style={{ maxWidth: '320px' }}
        >
            <h1>Sign In</h1>
            <Form.Item
                name="email"
                rules={[{
                    type: 'email',
                    message: 'The input is not valid email address',
                },
                {
                    required: true,
                    message: 'Fill up email address',
                },]}
            >
                <Input type="email" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                <br />
                <br />
                Or, <Link href={'/sign-up' + (actionType ? `?action_type=${actionType}` : '')}>
                    <a>
                        Signup for a new account!
                    </a>
                </Link>
            </Form.Item>
        </Form>
    );
};

export default SignInComp;