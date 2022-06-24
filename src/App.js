import React from 'react';
import './App.css';
import { Layout } from 'antd';
import MyHeader from "./components/header";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomeScreen } from "./screens/secure-home/home-screen";
import { AuthScreen } from "./screens/auth/auth-screen";
import Amplify from '@aws-amplify/core'
import awsConfig from "./configs/aws-configs";

const { Content, Footer } = Layout;

Amplify.configure(awsConfig);

Amplify.Logger.LOG_LEVEL = 'INFO';

function App() {
    return <Router>
        <Layout>
            <MyHeader />
            <Content style={{ padding: '0 50px', marginTop: 60, width: "100%" }}>
                <div style={{ background: '#fff', padding: 20, width: "100%", marginTop: "20px", height: "calc(100vh - 150px)"  }}>
                    <Route exact path='/' component={HomeScreen} />
                    <Route path={"/home"} component={HomeScreen} />
                    <Route path={"/login"} component={AuthScreen} />
                    <Route path={"/register"} component={AuthScreen} />
                    <Route path={"/forgotpassword"} component={AuthScreen} />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Karakehya.com © 2022 </Footer>
        </Layout>
    </Router>
}

export default App;
