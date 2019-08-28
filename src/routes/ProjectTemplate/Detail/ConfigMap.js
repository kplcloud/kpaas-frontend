import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card } from 'antd';
import moment from 'moment';
import DescriptionList from '../../../components/DescriptionList';

const { Description } = DescriptionList;

class ConfigMap extends React.PureComponent {
  componentWillMount() {
    const { dispatch, project } = this.props;
    if (project && project.name) {
      dispatch({
        type: 'conf/OneConfPull',
        payload: {
          'name': project.name,
          'namespace': project.namespace,
        },
      });
    }
  }

  render() {
    const { conf: { confMap, confMapCode }, project, dispatch } = this.props;
    let data;
    const noData = '未获取到数据~';
    const addConfMap = function() {
      dispatch(routerRedux.push('/conf/addConfigMap'));
    };
    if (confMap && confMap.data) {
      const confMapOptions = [];
      for (const key in confMap.data) {
        confMapOptions.push(
          <li key={key}><b>{key}: &nbsp;</b>
            <pre style={{ marginLeft: 20 }}>{confMap.data[key]}</pre>
          </li>,
        );
      }
      data = (
        <span>{confMapOptions}</span>
      );
    }
    if (confMapCode !== 0) {
      return (
        <Card bordered={false}>
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={addConfMap}
          >
            添加配置
          </Button>
        </Card>
      );
    }
    return (
      <div>
        <Card key="detail" title="详情" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }} col="1">
            <Description term="名称">{project.name}</Description>
            <Description term="命名空间">{project.namespace}</Description>
            <Description term="创建时间">
              {confMap ? (confMap.metadata ? moment(confMap.metadata.creationTimestamp).format('YYYY-MM-DD HH:mm:ss') : '--') : '--'}
            </Description>
          </DescriptionList>
        </Card>
        <Card key="data" title="数据">
          {confMap ? (confMap.data ? data : noData) : noData}
        </Card>
      </div>

    );

  }
}

export default connect(({ conf }) => ({
  conf,
}))(ConfigMap);
