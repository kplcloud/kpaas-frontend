import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';
import Cookie from 'js-cookie';

class Step4 extends React.PureComponent {
  state = {
    username: '',
    namespace: 'default',
    projectName: '',
    projectNameEn: '',
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'user/fetchNamespaces',
    });
    this.setState({
      username: Cookie.get('username') ? Cookie.get('username') : '',
      namespace: Cookie.get('namespace') ? Cookie.get('namespace') : '',
      projectName: Cookie.get('projectName') ? Cookie.get('projectName') : '',
      projectNameEn: Cookie.get('projectNameEn') ? Cookie.get('projectNameEn') : '',
    });
  }

  render() {
    const { dispatch, namespaces } = this.props;
    if (namespaces) {
      namespaces.map((item, _) => {
        if (item.name_en == this.state.namespace) {
          this.setState({ namespace: item.name });
        }
      });
    }
    const onList = () => {
      dispatch(routerRedux.push('/project/list'));
    };

    const onStart = () => {
      dispatch(routerRedux.push('/project/create'));
    };

    const information = (
      <div className={styles.information}>
        <Row>
          <Col span={12} className={styles.label}>
            业务空间：{this.state.namespace}
          </Col>
        </Row>
        <Row>
          <Col span={12} className={styles.label}>
            申请项目：{this.state.projectName}
          </Col>
        </Row>
        <Row>
          <Col span={12} className={styles.label}>
            申请人：{this.state.username}
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onStart}>
          再申请一个
        </Button>
        <Button onClick={onList}>查看列表</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="预计两小时内审核完成"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ user }) => ({
  namespaces: user.namespaces,
}))(Step4);
