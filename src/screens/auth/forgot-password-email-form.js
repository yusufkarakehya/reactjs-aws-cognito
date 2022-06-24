import { Button, Form, Input, notification, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Hub, Logger } from "@aws-amplify/core";
import { AuthService } from "../../services/auth-service";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export function ForgotPasswordEmailForm() {
    const [spinning, setSpinning] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const logger = new Logger("ForgotPasswordEmailForm");
    const history = useHistory();

    const styles = {
        loginForm: { "maxWidth": "300px" },
        loginFormForgot: { "float": "right" },
        loginFormButton: { "width": "100%" }
    };

    useEffect(() => {
        Hub.listen(AuthService.CHANNEL, onHubCapsule, 'MyListener');
        return function cleanup() {
            Hub.remove(AuthService.CHANNEL, onHubCapsule);
        }
    })

    const onHubCapsule = (capsule) => {
        const { channel, payload } = capsule;
        if (channel === AuthService.CHANNEL && payload.event === AuthService.AUTH_EVENTS.PASSWORD_RESET) {
            logger.info(payload.message);
            if (!payload.success) {
                setCodeSent(false);
                notification.open({
                    type: 'error',
                    message: "Couldn't reset your password.",
                    description: payload.message,
                    duration: 15
                });
            } else {
                setCodeSent(true);
                notification.open({
                    type: 'info',
                    message: 'Check your mail. Use the code to change your password.',
                    duration: 15
                });
            }
        } else if (channel === AuthService.CHANNEL && payload.event === AuthService.AUTH_EVENTS.PASSWORD_RESET_2) {
            logger.info(payload.message);
            if (!payload.success) {
                notification.open({
                    type: 'error',
                    message: "Couldn't change your password.",
                    description: payload.message,
                    duration: 15
                });
            } else {
                notification.open({
                    type: 'success',
                    message: 'Perfect!',
                    description: 'You changed your password successfully. Please login. ',
                    duration: 15
                });
                history.push("/login")
            }
        }
        setSpinning(false);
    };
    const onFinish = values => {
        setSpinning(true);
        AuthService.forgotPassword(values.username);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onFinishResetPassword = values => {
        setSpinning(true);
        AuthService.forgotPasswordSetNew(values.username, values.code, values.password)
    };

    const onFinishFailedResetPassword = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return <div>
        <Spin tip="Loading..." spinning={spinning}>
            {!codeSent && <div> <Row style={{ display: 'flex', justifyContent: 'center', width: "200px" }}>Get a 'reset' code</Row>
                <Row>
                    <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} style={styles.loginForm}>
                        <Form.Item name="username" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={styles.loginFormButton}>Send Reset Code</Button>
                            Or try to <Link to="login">login</Link> </Form.Item>
                    </Form>
                </Row> </div>}
            {codeSent && <div><Row style={{ display: 'flex', justifyContent: 'center', width: "200px" }}>Reset your password</Row>
                <Row>
                    <Form name="basic" onFinish={onFinishResetPassword} onFinishFailed={onFinishFailedResetPassword} style={styles.loginForm}>
                        <Form.Item name="username" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="code" rules={[{ required: true, message: 'Please input your Reset Code!' }]}>
                            <Input prefix={<LockOutlined />} type="string" placeholder="Reset Code" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={styles.loginFormButton}>Change Password</Button>
                            Or try to <Link to="login">login</Link> </Form.Item>
                    </Form>
                </Row>
            </div>}
        </Spin>
    </div>;

}