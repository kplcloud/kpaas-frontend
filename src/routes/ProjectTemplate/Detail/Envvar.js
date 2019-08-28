import React, {PureComponent, Fragment} from 'react';
import { Modal, Tooltip, InputNumber, Form, Button, Input, Radio, Icon,Card, Table, Pagination, Popconfirm} from 'antd';
import {connect} from 'dva';
import EnvvarModal from './EnvvarModal';

import { routerRedux } from 'dva/router';
class Envvar extends PureComponent {
	state = {
	    envvarVisible: false,
	    envvarTitle: "",
	    envType:"add",
	    envInfo:{},
	};

	componentDidMount() {
	    const { dispatch, match } = this.props;
	    dispatch({
	      type: 'cronjob/getConfigEnv',
	      payload: {
	        name: match.params.name,
	        namespace: match.params.namespace,
	      },
	    });
	}

	showEnvvarModal = (title) => {
	   // e.preventDefault();
	    this.setState({
	      envvarVisible: true,
	      envvarTitle: title,
	      envType:"add",
	      envInfo:{},
	    });
	};
	showEnvvarModalClose = () => {
	    this.setState({
	      envvarVisible: false,
	    });
	};
	onUpdate = (v) => {
	    const {dispatch} = this.props;
	    this.setState({
	      envInfo:v,
	      envvarVisible: true,
	      envvarTitle: "编辑自定义环境变量",
	      envType:"edit",
	    });
	    

	};
	onDelete = (id) => {
	    const {dispatch,match} = this.props;
	    dispatch({
	      type: "cronjob/deleteConfigEnv",
	      payload: {
	        id: id,
	        name: match.params.name,
	        namespace: match.params.namespace,
	      }
	    })
	};


    render() {
        const {configEnvList, configEnvPage, dispatch, match, name, namespace} = this.props;  //console.log(111111,this.props)

        const showModal = () => {
	      dispatch({
	        type: 'cronjob/addEnvvar',
	        payload: {
	          visible: true,
	          editStatus: false,
	        },
	      });
	    };

	    const columns = [{
	      title: '变量名',
	      dataIndex: 'env_key',
	      key: 'env_key',
	    },{
	      title: '变量值',
	      dataIndex: 'env_var',
	      key: 'env_var',
	    },{
	      title: '说明',
	      dataIndex: 'env_desc',
	      key: 'env_desc',
	    }, {
	      title: '操作',
	      key: 'action',
	      render: (text, record) => (
	        <span>
	          <a onClick={() => this.onUpdate(text)}>编辑</a>
	          <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(text.id)}
	                      okText="Yes" cancelText="No">
	            <a style={{marginLeft: 10}}>删除</a>
	          </Popconfirm>

	        </span>
	      ),
	    }];
	    const onShowSizeChange = (current) => {
	      const { dispatch } = this.props;
	      dispatch({
	        type: "msgs/noticelist",
	        payload: {
	          type: this.state.type,
	          is_read: this.state.is_read,
	          title: this.state.title,
	          p: current,
	        },
	      })
	    }

        return (
          <div>
	        <Card
	          key="detail"
	          title="自定义环境变量"
	          style={{ marginBottom: 24 }}
	          bordered={false}
	          extra={(<Button onClick={() => this.showEnvvarModal('添加自定义环境变量')} type="primary" ghost><Icon type="plus"/>创建</Button>)}
	        >
	         <Table columns={columns} rowKey="Id" dataSource={configEnvList} pagination={false}/>
              <Pagination style={{marginTop: 20, float: "right"}}
                        title=""
                        current={configEnvPage ? configEnvPage.page : 0}
                        defaultCurrent={configEnvPage.page}
                        total={configEnvPage.total}
                        showTotal={total => `共 ${configEnvPage.total} 条数据`}
                        onChange={onShowSizeChange}/>
	        </Card>
	        <EnvvarModal visible={this.state.envvarVisible} title={this.state.envvarTitle} onCancel={this.showEnvvarModalClose} match={match} name={name} namespace={namespace} envInfo={this.state.envInfo} envType={this.state.envType}/>
	      </div>
        );
    }
}

export default connect(({cronjob}) => ({
	configEnvList: cronjob.configEnvList,
	configEnvPage: cronjob.configEnvPage,
  }))(Envvar);
