/**
 * Created by huyunting on 2018/5/17.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Table, Icon, Pagination, Input, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const Search = Input.Search;
import AddModal from '../../components/System/addMember';

class Member extends PureComponent {
  state = {
    loading: true,
    id: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/memberlist',
    });

  }

  onUpdate = (id) => {
    const { dispatch } = this.props;
    this.setState({ id: id });
    dispatch({
      type: 'system/rolelist',
    });
    dispatch({
      type: 'user/namespacesList',
    });
    dispatch({
      type: 'system/oneMember',
      payload: {
        'id': id,
      },
    });
    dispatch({
      type: 'system/showAddRoleModeal',
    });
  };

  onAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/rolelist',
    });
    dispatch({
      type: 'user/namespacesList',
    });
    dispatch({
      type: 'system/showRoleModal',
    });
  };
  searchChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/memberlist',
      payload: {
        email: value,
      },
    });
  };

  rolesData = (data) => {
    var items = [];
    if (data && data.length > 0) {
      data.map((item, key) => {
        items.push(
          <Tag color="#2db7f5" key={key}>{data[key]['name']}</Tag>,
        );
      });
    }
    return items;

  };


  render() {
    const { list, loading, roleModalVisible, btnLoading, dispatch, modalType, oneMember, roleList, namespaceList, memberPage } = this.props;
    const checkId = this.state.id;
    const AddModalProps = {
      visible: roleModalVisible,
      btnLoading: btnLoading,
      modalType: modalType,
      oneMember: oneMember,
      roleList: roleList,
      namespaceList: namespaceList,
      onOk(data) {
        if (modalType) {
          dispatch({
            type: 'system/updateMember',
            payload: {
              ...data,
              id: checkId,
            },
          });
        } else {
          dispatch({
            type: 'system/createMember',
            payload: data,
          });
        }
        console.log(data);
      },
      onCancel() {
        dispatch({
          type: 'system/hideModal',
        });
      },
    };
    const columns = [{
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '所属角色',
      key: 'roles',
      render: (text, record) => (
        <span>
          {this.rolesData(text.roles)}
    </span>
      ),

    }, {
      title: '所属空间',
      key: 'namespaces',
      render: (text, record) => (
        <span>
          {this.rolesData(text.namespaces)}
    </span>
      ),
    }, {
      title: '状态',
      key: 'state',
      render: (text, record) => (
        <span>
          {text.state == 0 ? (<Tag color="#2db7f5">已创建</Tag>) : (text.state == 1 ? (
            <Tag color="#87d068">已激活</Tag>) : (text.state == 2 ? (<Tag color="#f50">已关闭</Tag>) : ''))}
        </span>
      ),

    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
      <a key={text.id + 100} onClick={() => this.onUpdate(text.id)}>编辑</a>
    </span>
      ),
    }];
    const extraContent = (
      <div>
        <Search
          placeholder="搜索用户邮箱..."
          onSearch={value => this.searchChange(value)}
          enterButton
        />
      </div>
    );
    const onShowSizeChange = (current) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'system/memberlist',
        payload: {
          'p': current,
        },
      });
    };
    return (
      <PageHeaderLayout>
        <Card title="用户列表" extra={extraContent}>
          <Button type="dashed" style={{ width: '100%', marginBottom: 20 }} onClick={this.onAdd}>
            <Icon type="plus"/> 添加用户
          </Button>
          <Table loading={loading} columns={columns} rowKey="id" dataSource={list} pagination={false}/>
          <Pagination style={{ marginTop: 20, float: 'right' }}
                      title=""
                      current={memberPage ? memberPage.page : 0}
                      defaultCurrent={memberPage.page}
                      total={memberPage.total}
                      pageSize={memberPage.pageSize}
                      showTotal={total => `共 ${memberPage.total} 条数据`}
                      onChange={onShowSizeChange}/>
        </Card>
        <AddModal {...AddModalProps}/>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ system, loading, user }) => ({
  roleModalVisible: system.roleModalVisible,
  list: system.memberList,
  loading: system.loading,
  btnLoading: system.btnLoading,
  modalType: system.modalType,
  oneRole: system.oneRole,
  oneMember: system.oneMember,
  roleList: system.roleList,
  namespaceList: user.allNamespacesList,
  memberPage: system.memberPage,
}))(Member);
