import React, {PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default class UserLanding extends PureComponent  {
  render() {
    const {user: {currentUser, level}} = this.props;

    var canonicalName
    if (currentUser && currentUser.attrs) {
      let name = currentUser.attrs.canonicalName;
      let names = name.split("/");
      canonicalName = (names.slice(2, 6)).join("/")
    }
    if (!canonicalName) {
      canonicalName = "无"
    }
    return (
      <Row wrap gutter="20">
        <Col l="18">
          <div
            className={styles.container}                                                 
            style={{
              alignItems: 'center',
              height: 100,
            }}
          >
            <div className={styles.avatarWrapper}>
              <a href="#">
                <img
                  width={64}
                  height={64}
                  src={require('./images/avatar.jpg')}
                  className={styles.avatar}
                />
              </a>
              <img
                alt="用户等级"
                src={require('./images/level.png')}
                className={styles.level}
              />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userDetail}>
                <a href="#">
                  <span className={styles.userName}>{currentUser && currentUser.username}</span>
                </a>
                {currentUser && currentUser.roles && (currentUser.roles).map(item => {
                  return <div key={item.id} className={styles.userLabel}>{item.name}</div>
                })}
              </div>
              <div className={styles.userOther}>机构：{canonicalName}</div>
              <div className={styles.userOther}>认证：精英认证！</div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
};