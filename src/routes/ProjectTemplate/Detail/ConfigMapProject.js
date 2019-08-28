import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Tooltip,
  InputNumber,
  Form,
  Button,
  Input,
  Radio,
  Icon,
  Card,
  Table,
  Pagination,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import EnvDataProjectModal from './EnvDataProjectModal';

class ConfigMapProject extends PureComponent {
  state = {
    envDataVisible: false,
    envDataTitle: '',
    envDataType: 'add',
    envDataInfo: {},
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'project/getConfigMap',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
      },
    });
    dispatch({
      type: 'project/getConfigMapData',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
      },
    });
  }

  onAdd = () => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'project/addConfigMap',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
        type: 1,
      },
    });
  };

  showEnvDataModal = (title) => {
    // e.preventDefault();
    this.setState({
      envDataVisible: true,
      envDataTitle: title,
      envDataType: 'add',
      envDataInfo: {},
    });
  };
  showEnvDataModalClose = () => {
    this.setState({
      envDataVisible: false,
    });
  };
  onUpdate = (v) => {
    const { dispatch } = this.props;
    this.setState({
      envDataInfo: v,
      envDataVisible: true,
      envDataTitle: '编辑配置数据',
      envDataType: 'edit',
    });
  };
  onDelete = (id, config_map_id) => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'project/deleteConfigMapData',
      payload: {
        id: id,
        config_map_id: config_map_id,
        name: match.params.name,
        namespace: match.params.namespace,
      },
    });
  };

  render() {
    const { configMapInfo, configMapDataList, configMapDataPage, dispatch, match, name, namespace } = this.props; //console.log(222222222,configMapDataList)
    if (configMapInfo && configMapInfo.id) {
      var btnDisplay = 'none';
    } else {
      var btnDisplay = '';
    }

    const columns = [{
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      width: 150,
    }, {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text, record) => (
        <span>
	          <a onClick={() => this.onUpdate(text)}>编辑</a>
	          <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(text.id, text.config_map_id)}
                        okText="Yes" cancelText="No">
	            <a style={{ marginLeft: 10 }}>删除</a>
	          </Popconfirm>

	        </span>
      ),
    }];
    const onShowSizeChange = (current) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'msgs/noticelist',
        payload: {
          type: this.state.type,
          is_read: this.state.is_read,
          title: this.state.title,
          p: current,
        },
      });
    };

    return (
      <div>
        <Card
          key="detail"
          title="配置详情"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={(<Button style={{ display: btnDisplay }} onClick={() => this.onAdd()} type="primary" ghost><Icon
            type="plus"/>创建</Button>)}
        >
          {configMapInfo && configMapInfo.id ? (
            <div>
              <p>名称: {configMapInfo.name ? configMapInfo.name : ''}</p>
              <p>命名空间: {configMapInfo.namespace ? configMapInfo.namespace : ''}</p>
              <p>创建时间: {configMapInfo.created_at ? configMapInfo.created_at : ''}</p>
            </div>
          ) : ('')}

        </Card>
        {configMapInfo && configMapInfo.id ? (
          <Card
            key="mapData"
            title="数据列表"
            style={{ marginBottom: 24 }}
            bordered={false}
            extra={(<Button onClick={() => this.showEnvDataModal('添加配置数据')} type="primary" ghost><Icon
              type="plus"/>创建</Button>)}
          >
            <Table columns={columns} rowKey="id" dataSource={configMapDataList} pagination={false}/>
            <Pagination style={{ marginTop: 20, float: 'right' }}
                        title=""
                        current={configMapDataPage ? configMapDataPage.page : 0}
                        defaultCurrent={configMapDataPage.page}
                        total={configMapDataPage.total}
                        pageSize={configMapDataPage.pageSize}
                        showTotal={total => `共 ${configMapDataPage.total} 条数据`}
                        onChange={onShowSizeChange}/>
          </Card>
        ) : ('')}
        <EnvDataProjectModal visible={this.state.envDataVisible} title={this.state.envDataTitle}
                             onCancel={this.showEnvDataModalClose} match={match} name={name} namespace={namespace}
                             envDataInfo={this.state.envDataInfo} envDataType={this.state.envDataType}
                             configMapInfo={configMapInfo}/>
      </div>
    );
  }
}

export default connect(({ project }) => ({
  configMapInfo: project.configMapInfo,
  configMapDataList: project.configMapDataList,
  configMapDataPage: project.configMapDataPage,
}))(ConfigMapProject);
