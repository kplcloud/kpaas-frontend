/**
 * Created by huyunting on 2018/7/5.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, message, Icon } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs';
import * as routerRedux from 'react-router-redux';

const { Description } = DescriptionList;

class IngressDetail extends PureComponent {

  componentWillMount() {
    const { dispatch, match } = this.props;
    if (!match.params.name || !match.params.namespace) {
      message.error('当前访问页面有误~');
      return;
    }
    dispatch({
      type: 'ingress/detail',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
      },
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'ingress/clearDtail',
    });
  }


  render() {
    const { ingress: { detail, loading }, match } = this.props;
    const description = (
      <DescriptionList size="small" col="2">
        <Description term="名称">{match ? match.params.name : '-'}</Description>
        <Description term="业务空间">{match ? match.params.namespace : '-'}</Description>
        <Description>
          <a onClick={() => this.props.dispatch(routerRedux.push('/security/ingress/list'))}>
            <Icon type="rollback"/> 返回
          </a>
        </Description>
      </DescriptionList>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div>更新时间</div>
          <div>{detail ? moment(detail.createionTimestamp).format('YY/MM/DD HH:mm:ss') : ''}</div>
        </Col>
      </Row>
    );
    const component = (codeString) => {
      return <SyntaxHighlighter language='yaml' style={tomorrowNight}>{codeString}</SyntaxHighlighter>;
    };
    return (
      <PageHeaderLayout
        title="Ingress 详情"
        logo={<img alt="" src="https://niu.yirendai.com/kpl-logo-blue.png"/>}
        content={description}
        extraContent={extra}
      >
        <Card
          title="Ingress Yaml"
          loading={loading}
          bodyStyle={{ overflow: 'auto', height: 'auto', margin: 0, padding: 0 }}
        >
          {detail && detail.yaml && component(detail.yaml)}
        </Card>
      </PageHeaderLayout>
    );
  }

}

export default connect(({ ingress }) => ({
  ingress,
}))(IngressDetail);
