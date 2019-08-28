/**
 * Created by huyunting on 2018/11/27.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
const {Description} = DescriptionList;
class ConfigMapDetail extends React.PureComponent {

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    if (params && ('name' in params) && params.name !== '' && params.namespace !== '') {
      dispatch({
        type: 'conf/OneConfPull',
        payload: {
          'name': params.name,
          'namespace': params.namespace,
        },
      });
    }
  }


  render() {
    const { confMap,match } = this.props;
    const {params} = match;
    let data;
    const noData = '未获取到数据~';
    const onReturn = () => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push('/conf/configMap'));
    };

    if (confMap && confMap.data) {
      const confMapOptions = [];
      for (const key in confMap.data) {
        confMapOptions.push(
          <li><b>{key}: &nbsp;</b>
            <pre style={{ marginLeft: 20 }}>{confMap.data[key]}</pre>
          </li>,
        );
      }
      data = (
        <span>{confMapOptions}</span>
      );
    }

    const description = (
      <DescriptionList  size="small" col="2">
        <Description term="名称">{params.name}</Description>
        <Description term="创建时间">{confMap ? (confMap.metadata ? confMap.metadata.creationTimestamp : '--') : '--'}</Description>
        <Description term="命名空间">{params.namespace}</Description>
      </DescriptionList>
    );

    return (
      <PageHeaderLayout content={description} title="配置字典详情">
        <Card title="数据">
          {confMap ? (confMap.data ? data : noData) : noData}
        </Card>

      </PageHeaderLayout>
    );
  }
}

export default connect(({ conf, user }) => ({
  confMap: conf.confMap,
  namespaces: user.namespaces,
}))(ConfigMapDetail);
