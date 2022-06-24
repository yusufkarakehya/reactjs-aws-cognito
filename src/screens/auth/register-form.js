import { Button, Form, Input, notification, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Hub, Logger } from '@aws-amplify/core';
import { AuthService } from "../../services/auth-service";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export function RegisterForm() {
    const [spinning, setSpinning] = useState(false);
    const logger = new Logger("RegisterForm");
    const history = useHistory();
    const styles = {
        loginForm: { "maxWidth": "300px" },
        loginFormForgot: { "float": "right" },
        loginFormButton: { "width": "100%" }
    };

    useEffect(() => {
        Hub.listen(AuthService.CHANNEL, onHubCapsule, 'MyListener');
        return function cleanup() {
            logger.info("Removing HUB subscription to " + AuthService.CHANNEL);
            Hub.remove(AuthService.CHANNEL, onHubCapsule);
        };
    });

    // Default handler for listening events
    const onHubCapsule = (capsule) => {
        const { channel, payload } = capsule;
        if (channel === AuthService.CHANNEL && payload.event === AuthService.AUTH_EVENTS.REGISTER) {
            if (!payload.success) {
                notification.open({
                    type: 'error',
                    message: 'Could not register',
                    description: payload.message,
                    duration: 10
                });
            } else {
                notification.open({
                    type: 'info',
                    message: 'Perfect!',
                    description: 'We have sent the confirmation link to your email address. ',
                    duration: 15
                });
                history.push("/login")
            }
        }
        setSpinning(false);
    };

    const onFinish = values => {
        setSpinning(true);
        AuthService.register(values.username, values.password);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return <div>
        <Spin tip="Loading..." spinning={spinning}>
            <Row style={{ display: 'flex', justifyContent: 'center', margin: "15px" }}> Register </Row>
            <Row>
                <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} style={styles.loginForm}>
                    <Form.Item name="username" rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={styles.loginFormButton}> Register </Button>
                        Already registered? <Link to="login">login</Link>
                    </Form.Item>
                </Form>
            </Row>
        </Spin>
    </div>;
}
