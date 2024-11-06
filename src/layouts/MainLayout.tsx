import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import { Layout, Spin } from "antd";
import Logo from "../components/Logo";
import UserInfo from "../components/UserInfo";

const { Header, Content, Footer } = Layout;

const MainLayout: FC = () => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}><UserInfo /></div>
      </Header>
      <Layout className={styles.main}>
        <Content>
          {/* {waitingUserData ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Spin />
          </div>
        ) : (
          <Outlet />
        )} */}
          <Outlet />
        </Content>
      </Layout>
      <Footer className={styles.footer}>
        小慕问卷 &copy;2023 - present. Created by 双越老师
      </Footer>
    </Layout>
  );
};

export default MainLayout;
