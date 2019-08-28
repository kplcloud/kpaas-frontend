/**
 * Created by huyunting on 2018/6/4.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import { Button, Card, Table, Icon, Pagination, Popconfirm, Select, Divider,Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../components/Security/namespaceSelect';
import moment from 'moment';
import Cookie from "js-cookie";
import { Link, routerRedux } from 'dva/router';
import styles from '../ProjectTemplate/BasicList.less';

const { Option, OptGroup } = Select;

class CronJob extends PureComponent {
  state = {
    loading: true,
    modalType: false,
    defaultNamespace: '',
    id: 0,

    group: '',
  };

  componentWillMount() {
    var namespace = Cookie.get("namespace");
    this.setState({defaultNamespace: namespace})

  }

  componentDidMount() {
    var namespace = Cookie.get("namespace");
    const {dispatch} = this.props
    dispatch({
      type: 'cronjob/list',
      payload: {
        "namespace": namespace,
      }
    });
    dispatch({
      type: "user/fetchNamespaces"
    });

    dispatch({
      type: 'group/ownergrouplist',
      payload: {
        'ns': namespace,
      },
    });
  }

  onDetail = (name, namespace) => {
    console.log("detail=", name, namespace)
    this.props.dispatch(routerRedux.push('/project/cornjob/detail/' + namespace + '/' + name));
  };
  onUpdate = (name) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push('/project/cornjob/edit/' + name))

  };
  onDelete = (name, namespace) => {
    const {dispatch} = this.props;
    dispatch({
      type: "cronjob/delete",
      payload: {
        name: name,
        namespace: namespace,
      }
    })
  };

  onAdd = () => {
    const {dispatch} = this.props
    this.setState({modalType: false})
    dispatch(routerRedux.push('/project/cornjob/addcjob'));
  };


  render() {
    const {list, loading, namespaces, dispatch,ownergrouplist} = this.props;  //console.log("list",list)
    const namespacesMap = [];
    if (namespaces && namespaces.length > 0) {
      namespaces.map((item, key) => {
        namespacesMap[item.name_en] = item.name
      })
    }

    const groupChange = (value) => {
      const v = value === undefined ? '' : value;
      this.setState({
        group: v,
      });
      const nss = Cookie.get("namespace");
      dispatch({
        type: 'cronjob/list',
        payload: {
          "namespace": nss,
          "group":value,
        },
      })
      // this.auditListParam('group', v);
    };
    const groupOption = () => {
      const options = [];
      if (ownergrouplist.length) {
        ownergrouplist.map((item, key) => options.push(
          <Option
            value={`${item.id}`}
            key={`${item.id}`}
          >{item.name}
          </Option>));
      }
      options.push(
        <OptGroup label="add Group" key="add Group">
          <Option value="" key="add Group2">
            <div>
              <Link to={{ pathname: '/group/list', query: { addGroup: 1 } }}>
                <div style={{ cursor: 'pointer' }}>
                  <Icon type="plus"/> 点击添加组
                </div>
              </Link>
            </div>
          </Option>
        </OptGroup>,
      );
      return options;
    };
    const clearGroupOptions = (value) => {
      this.setState({
        group: '',
      });
      dispatch({
        type: 'group/ownergrouplist',
        payload: {
          'ns': value,
        },
      });
    };
    const namespaceSelectPros = {
      disabledStatus: false,
      onOk(value){
        dispatch({
          type: 'cronjob/list',
          payload: {
            "namespace": value,
          },
        }).then(() => {
          clearGroupOptions(value)
        })
      },
    };

    const extraContent = (
      <div>
        <Button type="primary" ghost style={{width: "150px", marginRight: "50px"}} onClick={this.onAdd}>
          <Icon type="plus"/> 创建定时任务
        </Button>
        业务空间：
        <NamespaceSelect {...namespaceSelectPros}/>

        <Select
          value={`${this.state.group ? this.state.group : '请选择组'}`}
          showSearch
          style={{ width: 150 ,marginLeft: '16px'}}
          placeholder="请选择组"
          onChange={groupChange}
          allowClear
          notFoundContent={
            <div>
              <Divider style={{ margin: '4px 0' }}/>
              <Link to={{ pathname: '/group/list', query: { addGroup: 1 } }}>
                <div style={{ padding: '8px', cursor: 'pointer' }}>
                  <Icon type="plus"/> 点击添加组
                </div>
              </Link>
            </div>
          }
        >
          {ownergrouplist && groupOption()}
        </Select>
      </div>
    );
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      page: list ? (list.page ? list.page.page : 1) : 1,
      pageSize: list ? (list.page ? list.page.pageSize : 0) : 0,
      total: list ? (list.page ? list.page.total : 0) : 0,
    };

    const columns = [{
      title: '名称',
      key: 'name',
      render: (text, record) => (
        <span>
          <a onClick={() => this.onDetail(text.name, text.namespace)}>{text.name}</a>
        </span>
      ),
    }, {
      title: '计划',
      dataIndex: 'schedule',
      key: 'schedule',
    }, {
      title: '模式类型',
      key: 'add_type',
      render: (text, record) => (
        <Tag color="#2db7f5">{text.add_type}</Tag>
      ),
    }, {
      title: '挂起',
      key: 'suspend',
      render: (text, record) => (
        <span>{text.suspend ? "true" : "false"}</span>
      ),
    }, {
      title: '活跃中',
      dataIndex: 'active',
      key: 'active',
    }, {
      title: '最近调度',
      key: 'lastScheduleTime',
      render: (text, record) => (
        <span>{moment(text.lastScheduleTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    }, {
      title: '创建时间',
      key: 'created_at',
      render: (text, record) => (
        <span>{moment(text.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.onUpdate(text.name, text.namespace)}>编辑</a>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(text.name, text.namespace)}
                      okText="Yes" cancelText="No">
            <a style={{marginLeft: 10}}>删除</a>
          </Popconfirm>

        </span>
      ),
    }];
    const onShowSizeChange = (current) => {
      const {dispatch} = this.props
      dispatch({
        type: 'conf/list',
        payload: {
          "p": current,
          "namespace": this.state.defaultNamespace,
        },
      });
    };
    const onShowSizeChange22 = (current) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'cronjob/list',
        payload: {
          "p": current,
          "namespace": this.state.defaultNamespace,
          "group": this.state.group,
        },
      });
    };
    return (
      <PageHeaderLayout title="定时任务">
        <Card title="定时任务列表" extra={extraContent}>
          <Table loading={loading} columns={columns} rowKey="name" dataSource={list.list} pagination={false}/>
          <Pagination
            current={paginationProps.page}
            defaultCurrent={paginationProps.page}
            total={paginationProps.total}
            pageSize={paginationProps.pageSize}
            showTotal={total => `共 ${paginationProps.total} 条数据`}
            onChange={onShowSizeChange22}
            style={{ textAlign:'right' , marginTop: '20px'}}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default connect(({cronjob, user, group}) => ({
  list: cronjob.list,
  loading: cronjob.loading,
  page: cronjob.page,
  namespaces: user.namespaces,
  ownergrouplist: group.ownergrouplist,

}))(CronJob);
