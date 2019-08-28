import React from 'react';
import { connect } from 'dva';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs';
import { Card, Tag, Button, Icon, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import * as routerRedux from 'react-router-redux';

const { Description } = DescriptionList;

class AclDetail extends React.PureComponent {

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    if (params && ('name' in params) && params.name !== '' && params.namespace !== '') {
      dispatch({
        type: 'consul/AclDetail',
        payload: {
          'name': params.name,
          'namespace': params.namespace,
        },
      });
    }
  }

  onKVDetail = (name, ns) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/conf/consul/kv/` + ns + `/detail/` + name));
  };

  render() {
    const { match, consul: { detail } } = this.props;
    const { params } = match;
    const component = (codeString) => {
      return (
        <SyntaxHighlighter
          language='yaml'
          style={tomorrowNight}
        >
          {codeString ? codeString : '-'}
        </SyntaxHighlighter>
      );
    };

    const description = (
      <DescriptionList size='small' col='2'>
        <Description term='名称'>{params.name}</Description>
        <Description term='type'>{detail ? (
          <Tag color={detail.type === 'client' ? 'green' : 'gold'}>{detail.type}</Tag>) : '-'}</Description>
        <Description term='命名空间'>{params.namespace}</Description>
        <Description term='token'>{detail ? detail.token : '-'}
          <CopyToClipboard text={detail.fullToken}>
            <a onClick={() => {message.success('复制成功~');}}><Icon type="copy" style={{ marginLeft: 10 }}/> 复制</a>
          </CopyToClipboard>

        </Description>
      </DescriptionList>
    );

    return (
      <PageHeaderLayout
        content={description}
        title='ACL 详情'
        extraContent={(
          <Button type="primary" ghost onClick={() => this.onKVDetail(params.name, params.namespace)}>查看 K/V<Icon
            type="double-right"/>
          </Button>
        )}
      >

        <Card title='Rules' bodyStyle={{ overflow: 'auto', height: 'auto', margin: 0, padding: 0 }}>

          {detail ? component(detail.rules) : ''}
        </Card>

      </PageHeaderLayout>
    );
  }
}

export default connect(({ user, consul }) => ({
  consul,
  namespaces: user.namespaces,
}))(AclDetail);
