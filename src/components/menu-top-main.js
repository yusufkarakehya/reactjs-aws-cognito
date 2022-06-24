import React, { useEffect, useState } from 'react';
import { Menu, notification } from "antd";
import { Link, useHistory } from "react-router-dom";
import { Hub, Logger } from "@aws-amplify/core";
import { AuthService } from "../services/auth-service";
import { Auth } from "aws-amplify";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";

export function MyMenuTopMain() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    const logger = new Logger('AuthService');
    const history = useHistory();

    useEffect(() => {
        Hub.listen(AuthService.CHANNEL, onHubCapsule, 'MyListener');
        Auth.currentAuthenticatedUser({
            bypassCache: true
        }).then(user => {
            if (user) {
                setLoggedIn(true);
                setUsername(user.attributes.email);
            }
            else
                setLoggedIn(false);
        }).catch(err => {
            setLoggedIn(false);
        });

        return function cleanup() {
            logger.info("Removing HUB subscription to " + AuthService.CHANNEL);
            Hub.remove(AuthService.CHANNEL, onHubCapsule);
        };
    })

    const onHubCapsule = (capsule) => {
        const { channel, payload } = capsule;
        if (channel === AuthService.CHANNEL &&
            payload.event === AuthService.AUTH_EVENTS.LOGIN) {
            if (payload.success) {
                setLoggedIn(true);
                setUsername(payload.username);
            }
        } else if (channel === AuthService.CHANNEL &&
            payload.event === AuthService.AUTH_EVENTS.SIGN_OUT) {
            if (payload.success) {
                setLoggedIn(false);
                setUsername("");
                notification.open({
                    type: 'info',
                    message: 'You have logged out',
                    duration: 10
                });
            }
        }
    };


    const logout = async () => {
        await AuthService.signOut();
        history.push("/login");
    }

    return <Menu theme="light" mode="horizontal" style={{ lineHeight: '64px', textAlign: 'right' }} >
        <Menu.Item key="username:1">{username}</Menu.Item>
        {loggedIn && <Menu.Item key="auth:1" onClick={logout}><LogoutOutlined /> Log Out</Menu.Item>}
        {!loggedIn && <Menu.Item key="auth:2"><Link to="login"><LoginOutlined /> Log In</Link></Menu.Item>}
    </Menu>
}
