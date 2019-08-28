/**
 * Created by huyunting on 2018/5/17.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Table, Icon, List, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddModal from '../../components/System/addRole';
import PermModal from './PermModal';

class Member extends PureComponent {
  state = {
    loading: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/rolelist',
    });
  }

  onAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/showRoleModal',
    });
  };
  onUpdate = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/oneRole',
      payload: {
        id: id,
      },
    });
    dispatch({
      type: 'system/showAddRoleModeal',
    });
  };

  onShowPerm = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/changeVisible',
      payload: {
        visible: true,
        record: record,
      },
    });
    dispatch({
      type: 'system/permissions',
    });
    // todo 获取已有权限
    console.log(record);
    dispatch({
      type: 'system/selectedPerm',
      payload: {
        id: record.id,
      },
    });
  };

  onCheck = checkedKeys => {
    const { dispatch } = this.props;
    dispatch({ type: 'system/saveSelected', payload: checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, selectedPerms, record } = this.props;
    dispatch({
      type: 'system/changeRolePerm',
      payload: {
        permission_ids: selectedPerms,
        id: record.id,
        role_id: record.id,
      },
    });
  };

  render() {
    const {
      list,
      loading,
      roleModalVisible,
      btnLoading,
      dispatch,
      modalType,
      oneRole,
      visible,
      record,
      permissions,
      selectedPerms,
    } = this.props;
    const AddModalProps = {
      visible: roleModalVisible,
      btnLoading: btnLoading,
      modalType: modalType,
      oneRole: oneRole,
      onOk(data) {
        if (modalType) {
          dispatch({
            type: 'system/updateRole',
            payload: data,
          });
        } else {
          dispatch({
            type: 'system/createRole',
            payload: data,
          });
        }
      },
      onCancel() {
        dispatch({
          type: 'system/hideModal',
        });
      },
    };
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      // {
      //   title: 'code',
      //   dataIndex: 'code',
      //   key: 'code',
      // },
      {
        title: 'level',
        dataIndex: 'level',
        key: 'level',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <a onClick={() => this.onUpdate(text.id)}>编辑</a> |
              <a onClick={() => this.onShowPerm(record)}> 权限</a>
            </span>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <Card title="角色列表">
          <Button type="dashed" style={{ width: '100%', marginBottom: 20 }} onClick={this.onAdd}>
            <Icon type="plus" /> 添加角色
          </Button>
          <Table
            loading={loading}
            columns={columns}
            rowKey="id"
            dataSource={list}
            pagination={false}
          />
        </Card>
        <AddModal {...AddModalProps} />
        <PermModal
          {...{
            visible,
            record,
            onCancel: function() {
              dispatch({
                type: 'system/changeVisible',
                payload: {
                  visible: false,
                  record: null,
                },
              });
            },
            permissions: permissions,
            // selectedPerms: selectedPerms
            onCheck: this.onCheck,
            onSelect: this.onSelect,
            handleSubmit: this.handleSubmit,
          }}
          selectedPerms={selectedPerms}
        />
      </PageHeaderLayout>
    );
  }
}
export default connect(({ system, loading }) => ({
  roleModalVisible: system.roleModalVisible,
  list: system.roleList,
  loading: system.loading,
  btnLoading: system.btnLoading,
  modalType: system.modalType,
  oneRole: system.oneRole,
  visible: system.visible,
  record: system.record,
  permissions: system.permissions,
  selectedPerms: system.selectedPerms,
}))(Member);
