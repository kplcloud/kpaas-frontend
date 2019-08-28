import React, {Fragment} from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Divider, Row, Col, Icon, InputNumber} from 'antd';
import styles from './style.less';
import Result from 'components/Result';
import Cookie from 'js-cookie';
import {routerRedux} from 'dva/router';
@Form.create()
class Step4 extends React.PureComponent {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetchNamespaces',
    });
  }

  render() {
    const {dispatch, match, virtualservice, virtual} = this.props;
    const {submitStatus, responseCode, responseMsg} = virtualservice;
    const onSubmit = () => {
      dispatch({
        type: 'virtualservice/pushCreate',
        payload: {
          name: match.params.name,
          namespace: match.params.namespace,
          status: Cookie.get("virtualServiceEdit") ? true : false,
        },
      });
    };
    const onList = () => {
      dispatch({
        type: 'virtualservice/choseSubmit'
      });
      dispatch(routerRedux.push('/security/virtual/service/list'));
    };

    const onStart = () => {
      dispatch({
        type: 'virtualservice/choseSubmit'
      });
      dispatch(routerRedux.push('/security/virtual/service/create'));
    };

    const information = (
      <div className={styles.information}>
        <Row>
          <Col span={12} className={styles.label}>
            业务空间：{this.props.match.params.namespace}
          </Col>
        </Row>
        <Row>
          <Col span={12} className={styles.label}>
            名称：{this.props.match.params.name}
          </Col>
        </Row>
        <Row>
          <Col span={12} className={styles.label}>
            申请人：{Cookie.get('username') ? Cookie.get('username') : ''}
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
      <Fragment>
        {submitStatus && (<Result
          type={responseCode == 0 ? "success" : "error"}
          title={responseMsg}
          extra={information}
          actions={actions}
          className={styles.result}
        />)}

        {!submitStatus && (
          <Button type="primary" style={{width: "20%", margin: "120px 30%"}} onClick={onSubmit}>
            <Icon type="to-top"/> 提交
          </Button>)}
        <Divider style={{margin: '40px 0 24px'}}/>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>如有不清楚请联系管理员</h4>
          <p>请根据自己的需求设置合适的参数。</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({virtualservice, user}) => ({
  virtualservice,
  namespaces: user.namespaces,
}))(Step4);
