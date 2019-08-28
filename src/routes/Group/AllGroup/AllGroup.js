import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Table, Icon, Popconfirm, Pagination, Select, Input, Tooltip } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CollectionCreateForm from './addGroup'
import UpdateGroupModal from './updateGroup'
import AddGroupProjectModal from './addGroupProject'
import AddGroupMemberModal from './addGroupMember'
import { Link } from 'react-router-dom';
import AddGroupCronjobModal from './addGroupCronjob';
import Cookie from 'js-cookie';

const Search = Input.Search;


const sstyle = {
  display:'none',
};

const expandedRowRenders = record => <p style={sstyle}>{record}</p>;

class AllGroup extends PureComponent {
  state = {
    loading: true,
    visible: false,
    updateGroupVisible: false,
    addGroupMemberVisible: false,
    addGroupProjectVisible: false,
    updateRecord: {},
    addGroupMemberRecord: {},
    addGroupProjectRecord: {},

    ns: 'default',
    searchValue: "",

    addGroupCronjobVisible: false,
    addGroupCronjobRecord:{},


    expandVisible: {},

    expandedRowRenders,
    subTabData:{},

    expandedRowKeys:[],

  };

  componentWillMount() {
    const namespace = Cookie.get('namespace');
    if (namespace !== "" && namespace !== undefined) {
      this.setState({ ns: namespace });
    }

    const { dispatch } = this.props;

    dispatch({
      type: 'group/grouplist',
      payload: {
        'name': this.state.searchValue,
        'ns': namespace,
      },
    })
    dispatch({
      type: 'group/memberList',
    });
    dispatch({
      type: 'group/ownNamespacesList',
    });
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': "",
        'ns': this.state.ns,
      },
    });

  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const {form,dispatch} = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'group/adminAddGroup',
        payload: {
          ...values,
        },
      }).then(() => {
        dispatch({
          type: 'group/grouplist',
          payload: {
            'name': this.state.searchValue,
            'ns': this.state.ns,
          },
        });
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ visible: false });

    });

  };
  //
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  updateFormRef = (formRef) => {
    this.formRef2 = formRef;
  };
  addGroupMemberFormRef = (formRef) => {
    this.groupMemberFormRef = formRef;
  };
  addGroupProjectFormRef = (formRef) => {
    this.groupProjectFormRef = formRef;
  };

  addGroupCronjobFormRefs = (formRef) => {
    this.groupCronjobFormRefs = formRef;
  };

  handleUpdateGroupCancel = () =>  {
    this.setState({ updateGroupVisible: false,updateRecord: {} });
  };

  handleUpdateGroupCreate = () =>  {
    const {form,dispatch} = this.formRef2.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'group/adminUpdateGroup',
        groupId: values.id,
        payload: {
          ...values,
        },
      }).then(() => {
        dispatch({
          type: 'group/grouplist',
          payload: {
            'name': this.state.searchValue,
            'ns': this.state.ns,
          },
        });
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ updateGroupVisible: false });
    });

  };

  handleAddGroupMemberCancel = () => {
    this.setState({ addGroupMemberVisible: false,addGroupMemberRecord: {} });
  };

  handleAddGroupMemberCreate = () =>  {
    const {form,dispatch} = this.groupMemberFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'group/adminAddMember',
        groupId: values.group_id,
        memberId: values.member_id,
      }).then(() => {
        dispatch({
          type: 'group/grouplist',
          payload: {
            'name': this.state.searchValue,
            'ns': this.state.ns,
          },
        });
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ addGroupMemberVisible: false });

    });

  };

  handleAddGroupProjectCancel = () => {
    this.setState({ addGroupProjectVisible: false,addGroupProjectRecord: {} });
  };

  handleAddGroupCronjobCancel = () => {
    this.setState({ addGroupCronjobVisible: false,addGroupCronjobRecord: {} });
  };

  handleAddGroupProjectCreate = () => {
    const {form,dispatch} = this.groupProjectFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'group/adminAddProject',
        groupId: values.group_id,
        projectId: values.project_id,
      }).then(() => {
        dispatch({
          type: 'group/grouplist',
          payload: {
            'name': this.state.searchValue,
            'ns': this.state.ns,
          },
        });
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ addGroupProjectVisible: false });

    });

  };

  handleAddGroupCronjobCreate = () => {
    const {form,dispatch} = this.groupCronjobFormRefs.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'group/adminAddCronjob',
        groupId: values.group_id,
        cronjobId: values.cronjob_id,
      }).then(() => {
        dispatch({
          type: 'group/grouplist',
          payload: {
            'name': this.state.searchValue,
            'ns': this.state.ns,
          },
        });
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ addGroupCronjobVisible: false });

    });

  };

    // 组信息修改
  onGroupUpdate = (value) => {
    this.setState({ updateGroupVisible: true,updateRecord:value});
    const { dispatch } = this.props;

    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': value.owner.email,
        'ns': value.namespace.name,
      },
    }).then(() => {
      dispatch({
        type: 'group/grouplist',
        payload: {
          'name': this.state.searchValue,
          'ns': this.state.ns,
        },
      });
      this.setState({expandedRowKeys:[]})
    });
  };

  // 组删除
  onGroupDelete = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/adminDeleteGroup',
      groupId: value.id,
    }).then(() => {
      dispatch({
        type: 'group/grouplist',
        payload: {
          'name': this.state.searchValue,
          'ns': this.state.ns,
        },
      });
      this.setState({expandedRowKeys:[]})
    });
  };

  onDeleteMemberConfirm = (value,id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/adminDelMember',
      groupId: value.id,
      memberId: id,
    }).then(() => {
      dispatch({
        type: 'group/grouplist',
        payload: {
          'name': this.state.searchValue,
          'ns': this.state.ns,
        },
      });
      this.setState({expandedRowKeys:[]})
    });
  };

  onDeleteProjectConfirm = (value,pId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/adminDelProject',
      groupId:  value.id,
      projectId: pId,
    }).then(() => {
      dispatch({
        type: 'group/grouplist',
        payload: {
          'name': this.state.searchValue,
          'ns': this.state.ns,
        },
      });
      this.setState({expandedRowKeys:[]})
    });
  };
  onDeleteCronjobConfirm = (value,cId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/adminDelCronjob',
      groupId:  value.id,
      cronjobId: cId,
    }).then(() => {
      dispatch({
        type: 'group/grouplist',
        payload: {
          'name': this.state.searchValue,
          'ns': this.state.ns,
        },
      });
      this.setState({expandedRowKeys:[]})
    });
  };

  onAdminAddMember = (value) => {
    this.setState({ addGroupMemberVisible: true,addGroupMemberRecord:value,ns:value.namespace.name});
    const { dispatch } = this.props;
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': "",
        'ns': value.namespace.name,
      },
    });
  };

  onAdminAddProject = (value) => {
    this.setState({ addGroupProjectVisible: true,addGroupProjectRecord:value,ns:value.namespace.name});
    const { dispatch } = this.props;
    dispatch({
      type: 'group/namespaceProjectList',
      ns: value.namespace.name,
    });
  };

  onAdminAddCronjob = (value) => {
    this.setState({ addGroupCronjobVisible: true,addGroupCronjobRecord:value,ns: value.namespace.name});
    const { dispatch } = this.props;
    dispatch({
      type: 'group/namespaceCronjobList',
      ns: value.namespace.name,
    });
  };



  handleNsChanges = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/grouplist',
      payload: {
        // 'name': this.state.searchValue,
        'ns': value,
      },
    }).then(() => {
      this.setState({expandedRowKeys:[]})
    });
    this.setState({ns:value,searchValue:''})
  };

  projectTo = (ns,name) => {
    this.props.history.push(`/project/detail/${ns}/${name}`)
  };

  cronjobTo = (ns,name) => {
    this.props.history.push(`/project/cornjob/detail/${ns}/${name}`)
  };


  emitEmpty = () => {
    this.groupNameInput.focus();
    this.setState({ searchValue: '' });
  };
  onChangeGroupName = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  render() {
    const {
      grouplist,
      groupPage,
      loading,
      ownNamespacesList,
      memberlike,
      namespaceProjectList,
      namespaceCronjobList,
    } = this.props;


    const gridStyle = {
      width: '33.3%',
      textAlign: 'center',
    };
    const cardStyle = {
      marginTop: '20px',
    };
    const expandStyle = {
      textOverflow: 'ellipsis',
      overflow:'hidden',
      whitespace:'nowrap',
      width: '100%',
    };
    const onShowSizeChange = (value) => {
      const {dispatch} = this.props
      dispatch({
        type: 'group/grouplist',
        payload: {
          'name': this.state.searchValue,
          'ns': this.state.ns,
          "p": value,
        },
      });
    };
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '别名',
        dataIndex: 'display_name',
        key: 'display_name',
      },
      {
        title: '名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '业务空间',
        dataIndex: 'namespace',
        key: 'namespace',
        render: namespace => `${namespace.display_name}`,
      },
      {
        title: '创建者',
        dataIndex: 'owner',
        key: 'owner',
        render: owner => `${owner.username}`,
      },
      {
        title: '创建者邮箱',
        dataIndex: 'owner',
        key: 'ownerEmail',
        render: owner => `${owner.email}`,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <a onClick={() => this.onGroupUpdate(record)}>修改</a> |
              <Popconfirm
                title="确定删除吗？不可逆,谨慎操作!"
                onConfirm={() => this.onGroupDelete(record)}
                icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
              >
                <a href='#'> 删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    // const myCardOfMember = (record) => {
    //   console.log(record,"这是社么");
    //   const options = [];
    //   if (record.members.length) {
    //     record.members.map((item) => options.push(
    //       <Card.Grid
    //         style={gridStyle}
    //         key={item.id}
    //       >
    //         {item.email} | {item.username} |
    //         <Popconfirm
    //           title="确定删除吗？不可逆,谨慎操作!"
    //           onConfirm={() => this.onDeleteMemberConfirm(record,item.id)}
    //           icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
    //         >
    //           <a href="#">删除</a>
    //         </Popconfirm>
    //       </Card.Grid>
    //     ))
    //   }
    //   return options
    // };
    // const myCardOfProject = (record) => {
    //   const options = [];
    //   if (record.projects && record.projects.length) {
    //     record.projects.map((item) => options.push(
    //       <Card.Grid
    //         style={gridStyle}
    //         key={item.id}
    //       >
    //         {item.name} | {item.language} |
    //
    //         <Popconfirm
    //           title="确定删除吗？不可逆,谨慎操作!"
    //           onConfirm={() => this.onDeleteProjectConfirm(record,item.id)}
    //           icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
    //         >
    //           <a href='#'> 删除</a>
    //         </Popconfirm>
    //       </Card.Grid>
    //     ))
    //   }
    //   return options
    // };

    const myCardOfMember = (expandRecord,record) => {
      const options = [];
      if (Object.keys(record).length !== 0 &&  record.members &&  record.members.length ) {
        record.members.map((item) => options.push(
          <Card.Grid
            style={gridStyle}
            key={item.id}
          >
            {item.email.split("@")[0]} | {item.username} |
            <Popconfirm
              title="确定删除吗？不可逆,谨慎操作!"
              onConfirm={() => this.onDeleteMemberConfirm(expandRecord,item.id)}
              icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Card.Grid>
        ))
      }
      return options
    };
    const myCardOfProject = (expandRecord,record) => {
      const options = [];
      if (Object.keys(record).length !== 0 && record.projects && record.projects.length) {
        record.projects.map((item) => options.push(
          <Card.Grid
            style={gridStyle}
            key={item.id}
          >
            <Link to="#" onClick={()=>this.projectTo(item.namespace,item.name)}>{item.name}</Link> | {item.language} |

            <Popconfirm
              title="确定删除吗？不可逆,谨慎操作!"
              onConfirm={() => this.onDeleteProjectConfirm(expandRecord,item.id)}
              icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
            >
              <a href='#'> 删除</a>
            </Popconfirm>
          </Card.Grid>
        ))
      }
      return options
    };
    const myCardOfCronjob = (expandRecord,record) => {
      const options = [];
      if (Object.keys(record).length !== 0 && record.cronjobs && record.cronjobs.length) {
        record.cronjobs.map((item) => options.push(
          <Card.Grid
            style={gridStyle}
            key={item.id}
          >
            <Link to="#" onClick={()=>this.cronjobTo(item.namespace,item.name)}><span style={expandStyle}>{item.name}</span></Link>  |

            <Popconfirm
              title="确定删除吗？不可逆,谨慎操作!"
              onConfirm={() => this.onDeleteCronjobConfirm(expandRecord,item.id)}
              icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
            >
              <a href='#'> 删除</a>
            </Popconfirm>
          </Card.Grid>
        ))

      }
      return options
    };
    const Expand = (expandRecord,grouponedata) => {
      return  (
        <div>
          <Card title="成员"  extra={<a onClick={() => this.onAdminAddMember(expandRecord)}>添加成员</a>}>
            {myCardOfMember(expandRecord,grouponedata[expandRecord.id])}
          </Card>
          <Card title="项目" style={cardStyle} extra={<a onClick={() => this.onAdminAddProject(expandRecord)}>添加项目</a>}>
            {myCardOfProject(expandRecord,grouponedata[expandRecord.id])}
          </Card>
          <Card title="定时任务" style={cardStyle} extra={<a onClick={() => this.onAdminAddCronjob(expandRecord)}>添加定时任务</a>}>
            {myCardOfCronjob(expandRecord,grouponedata[expandRecord.id])}
          </Card>
        </div>
      )
    };

    const onExpandedRowRender = (expanded,record) => {
      const { dispatch } = this.props;

      if (expanded) {
        dispatch({
          type: 'group/grouponedata',
          groupId: record.id,
        }).then((groupOneData) => {
          const res = {
            ...this.state.subTabData,
            [record.id]: groupOneData,
          };

          this.setState({
            expandVisible:{
              ...this.state.expandVisible,
              [record.id]: true,
            },
            subTabData:res,
            expandedRowRenders: {
              ...this.state.expandedRowRenders,
              [record.id]: Expand(record,res),
            },
          });
        });
      } else {
        this.setState({expandVisible:{
            ...this.state.expandVisible,
            [record.id]: false,
          }});
      }
    };

    const searchChange = (value) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'group/grouplist',
        payload: {
          'name': value,
          'ns': this.state.ns,
        },
      }).then(() => {
        this.setState({expandedRowKeys:[],searchValue:value})
      });
    };

    const suffix = this.state.searchValue ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;


    return (
      <PageHeaderLayout>
        <Card
          title="组列表"
          extra={
            <span>
              <Button type="primary" ghost style={{ width: '120px' }} onClick={this.showModal}>
                <Icon type="plus" /> 添加组
              </Button>
              &nbsp;&nbsp;
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder="可以选择业务空间"
                optionFilterProp="children"
                onChange={this.handleNsChanges}
                defaultValue={this.state.ns}
              >
                <Select.Option key="" value="">全部</Select.Option>
                {ownNamespacesList.map(item => <Select.Option key={item.name}>{item.display_name}</Select.Option>)}
              </Select>
              &nbsp;&nbsp;
              <Search
                style={{ width: 200, }}
                placeholder="搜索组名称..."
                onSearch={value => searchChange(value)}
                suffix={suffix}
                value={this.state.searchValue}
                onChange={this.onChangeGroupName}
                ref={node => this.groupNameInput = node}
                enterButton
              />
            </span>
          }
        >

          <Table
            loading={loading}
            columns={columns}
            rowKey="id"
            dataSource={grouplist}
            onExpand={onExpandedRowRender}
            expandedRowKeys={this.state.expandedRowKeys.length===0 ? [] : this.state.expandedRowKeys}
            onExpandedRowsChange={(res) => {
              this.setState({expandedRowKeys:res})
            }}
            expandedRowRender={(record) =>  this.state.expandVisible[record.id] === true ? this.state.expandedRowRenders[record.id] : true}
            // expandedRowRender={
            //   record => (
            //     <div>
            //       <Card title="成员" extra={<a onClick={() => this.onAdminAddMember(record)}>添加成员</a>}>
            //         {myCardOfMember(record)}
            //       </Card>
            //       <Card title="项目" style={cardStyle} extra={<a onClick={() => this.onAdminAddProject(record)}>添加项目</a>}>
            //         {myCardOfProject(record)}
            //       </Card>
            //     </div>
            //   )}
            pagination={false}
          />

          <Pagination
            style={{marginTop: 20, float: "right"}}
            title=""
            current={groupPage ? groupPage.page : 0}
            defaultCurrent={groupPage.page}
            total={groupPage.total}
            showTotal={total => `共 ${groupPage.total} 条数据`}
            onChange={onShowSizeChange}
          />
        </Card>
        <div>
          <CollectionCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            ownNamespacesList={ownNamespacesList}
            memberlike={memberlike}
          />
        </div>
        <div>
          <UpdateGroupModal
            wrappedComponentRef={this.updateFormRef}
            visible={this.state.updateGroupVisible}
            onCancel={this.handleUpdateGroupCancel}
            onCreate={this.handleUpdateGroupCreate}
            ownNamespacesList={ownNamespacesList}
            memberlike={memberlike}
            updateRecord={this.state.updateRecord}
          />
        </div>
        <div>
          <AddGroupCronjobModal
            wrappedComponentRef={this.addGroupCronjobFormRefs}
            visible={this.state.addGroupCronjobVisible}
            onCancel={this.handleAddGroupCronjobCancel}
            onCreate={this.handleAddGroupCronjobCreate}
            nsCronjobList={namespaceCronjobList}
            addGroupCronjobRecord={this.state.addGroupCronjobRecord}
          />
        </div>
        <div>
          <AddGroupProjectModal
            wrappedComponentRef={this.addGroupProjectFormRef}
            visible={this.state.addGroupProjectVisible}
            onCancel={this.handleAddGroupProjectCancel}
            onCreate={this.handleAddGroupProjectCreate}
            nsProjectList={namespaceProjectList}
            ns={this.state.ns}
            addGroupProjectRecord={this.state.addGroupProjectRecord}
          />
        </div>
        <div>
          <AddGroupMemberModal
            wrappedComponentRef={this.addGroupMemberFormRef}
            visible={this.state.addGroupMemberVisible}
            onCancel={this.handleAddGroupMemberCancel}
            onCreate={this.handleAddGroupMemberCreate}
            memberlike={memberlike}
            ns={this.state.ns}
            addGroupMemberRecord={this.state.addGroupMemberRecord}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ group }) => ({
  grouplist: group.grouplist,
  groupPage: group.groupPage,
  modalType: group.modalType,
  ownNamespacesList: group.ownNamespacesList,
  memberlike: group.memberlike,
  adminDeleteGroup: group.adminDeleteGroup,
  adminUpdateGroup: group.adminUpdateGroup,
  adminAddProject: group.adminAddProject,
  adminAddCronjob: group.adminAddCronjob,
  adminAddMember: group.adminAddMember,
  adminDelMember: group.adminDelMember,
  adminDelProject: group.adminDelProject,
  adminDelCronjob: group.adminDelCronjob,
  namespaceProjectList: group.namespaceProjectList,
  namespaceCronjobList:group.namespaceCronjobList,

}))(AllGroup);
