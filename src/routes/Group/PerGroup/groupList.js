import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select } from 'antd/lib/select';
import { Card, Table, Icon, Popconfirm, Button, Input } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Cookie from 'js-cookie';
import AddGroupMemberModal from '../AllGroup/addGroupMember';
import AddGroupProjectModal from '../AllGroup/addGroupProject'
import AddGroupCronjobModal from '../AllGroup/addGroupCronjob'
import { Link } from 'react-router-dom';
import CollectionCreateForm from './ownerAddGroup';
import UpdateGroupModal from './ownerUpdateGroup';
const Search = Input.Search;


const sstyle = {
  display:'none',
};

const expandedRowRenders = record => <p style={sstyle}>{record}</p>;


class groupList extends PureComponent {

  state = {
    ns: 'default',
    addGroupMemberVisible: false,
    addGroupProjectVisible: false,
    addGroupMemberRecord: {},
    addGroupProjectRecord: {},
    visible: false,

    addGroupCronjobVisible: false,
    addGroupCronjobRecord:{},


    updateGroupVisible: false,
    updateRecord:{},

    expandVisible: {},

    expandedRowRenders,
    subTabData:{},

    expandedRowKeys:[],
  };

  componentWillMount() {
    const que = this.props.location.query;
    if (que ) {
      const g = this.props.location.query.addGroup;
      if ( g === 1 ) {
        this.setState({  visible: true});
      }
    }
  }

    componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'group/ownergrouplistdata',
    });
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': "",
        'ns': 'default',
      },
    });
    dispatch({
      type: 'group/ownernslist',
    });

  };

  onOwnerAddMember = (value) => {
    this.setState({ addGroupMemberVisible: true,addGroupMemberRecord:value,ns: value.namespace.name});
    const { dispatch } = this.props;
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': "",
        'ns': value.ns.name,
      },
    });
  };

  onOwnerAddProject = (value) => {
    this.setState({ addGroupProjectVisible: true,addGroupProjectRecord:value,ns: value.namespace.name});
    const { dispatch } = this.props;
    dispatch({
      type: 'group/namespaceProjectList',
      ns: value.ns.name,
    });
  };

  onOwnerAddCronjob = (value) => {
    this.setState({ addGroupCronjobVisible: true,addGroupCronjobRecord:value,ns: value.namespace.name});
    const { dispatch } = this.props;
    dispatch({
      type: 'group/namespaceCronjobList',
      ns: value.ns.name,
    });
  };


  onDeleteProjectConfirm = (value,pId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/ownerDelProject',
      groupId: value.id,
      projectId:pId,
    }).then(() => {
      this.setState({expandedRowKeys:[]})
    });
  };

  onDeleteMemberConfirm = (value,id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/ownerDelMember',
      groupId: value.id,
      memberId: id,
    }).then(() => {
      this.setState({expandedRowKeys:[]})
    });
  };
  onDeleteCronjobConfirm = (value,id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/ownerDelCronjob',
      groupId: value.id,
      cronjobId: id,
    }).then(() => {
      this.setState({expandedRowKeys:[]})
    });
  };

  addGroupMemberFormRef = (formRef) => {
    this.groupMemberFormRef = formRef;
  };
  addGroupProjectFormRef = (formRef) => {
    this.groupProjectFormRef = formRef;
  };

  addGroupCronjobFormRef = (formRef) => {
    this.groupCronjobFormRef = formRef;
  };

  handleAddGroupMemberCancel = () => {
    this.setState({ addGroupMemberVisible: false,addGroupMemberRecord: {} });
  };

  handleAddGroupProjectCancel = () => {
    this.setState({ addGroupProjectVisible: false,addGroupProjectRecord: {} });
  };

  handleAddGroupCronjobCancel = () => {
    this.setState({ addGroupCronjobVisible: false,addGroupCronjobRecord: {} });
  };

  handleAddGroupMemberCreate = () =>  {
    const {form,dispatch} = this.groupMemberFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'group/ownerAddMember',
        groupId: values.group_id,
        memberId: values.member_id,
      }).then(() => {
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ addGroupMemberVisible: false });

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
        type: 'group/ownerAddGroup',
        payload: {
          ...values,
        },
      }).then(() => {
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ visible: false });

    });

  };

  handleAddGroupProjectCreate = () => {
    const {form,dispatch} = this.groupProjectFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'group/ownerAddProject',
        groupId: values.group_id,
        projectId: values.project_id,
      }).then(() => {
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ addGroupProjectVisible: false });

    });

  };

  handleAddGroupCronjobCreate = () => {
    const {form,dispatch} = this.groupCronjobFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'group/ownerAddCronjob',
        groupId: values.group_id,
        cronjobId: values.cronjob_id,
      }).then(() => {
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ addGroupCronjobVisible: false });

    });

  };

  handleNsChanges = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/ownergrouplistdata',
      payload: {
        'name': "",
        'ns': value,
      },
    });
    // dispatch({
    //   type: 'group/grouplist',
    //   payload: {
    //     'name': "",
    //     'ns': value,
    //   },
    // });
    this.setState({ns:value})
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
        type: 'group/ownerUpdateGroup',
        groupId: values.id,
        payload: {
          ...values,
        },
      }).then(() => {
        this.setState({expandedRowKeys:[]})
      });
      form.resetFields();
      this.setState({ updateGroupVisible: false });
    });

  };

  onGroupUpdate = (value) => {
    this.setState({ updateGroupVisible: true,updateRecord:value});
  };
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };
  updateFormRef = (formRef) => {
    this.formRef2 = formRef;
  };
  // 组删除
  onGroupDelete = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/ownerDeleteGroup',
      groupId: value.id,
    });
  };

  // onExpandedRowRender = (expanded,record) => {
  //   const { dispatch } = this.props;
  //
  //   if (expanded) {
  //     dispatch({
  //       type: 'group/grouponedata',
  //       groupId: record.id,
  //     }).then((groupOneData) => {
  //       const res = {
  //         ...this.state.subTabData,
  //         [record.id]: groupOneData,
  //       };
  //
  //       this.setState({
  //         expandVisible:{
  //           ...this.state.expandVisible,
  //           [record.id]: true,
  //         },
  //         subTabData:res,
  //         expandedRowRenders: {
  //           ...this.state.expandedRowRenders,
  //           [record.id]:<Expand expandVisible expandRecord={record} grouponedata={res} />,
  //         },
  //       });
  //     });
  //   } else {
  //     this.setState({expandVisible:{
  //         ...this.state.expandVisible,
  //         [record.id]: false,
  //       }});
  //   }
  // };
  projectTo = (ns,name) => {
    this.props.history.push(`/project/detail/${ns}/${name}`)
  };

  cronjobTo = (ns,name) => {
    this.props.history.push(`/project/cornjob/detail/${ns}/${name}`)
  };

  render() {
    const {
      ownergrouplistdata,
      loading,
      memberlike,
      namespaceProjectList,
      ownernslist,
      namespaceCronjobList,
    } = this.props;

    const email = Cookie.get('email');

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
        dataIndex: 'ns',
        key: 'namespace',
        render: ns => `${ns.display_name}`,
      },
      {
        title: '创建者',
        dataIndex: 'member',
        key: 'member',
        render: member => `${member.username}`,
      },
      {
        title: '创建者邮箱',
        dataIndex: 'member',
        key: 'ownerEmail',
        render: member => `${member.email}`,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (record.member.email === email) {
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
          }
        },
      },
    ];
    const gridStyle = {
      width: '33.3%',
      textAlign: 'center',
    };

    const expandStyle = {
      textOverflow: 'ellipsis',
      overflow:'hidden',
      whitespace:'nowrap',
      width: '100%',
    };

    const cardStyle = {
      marginTop: '20px',
    };

    const myCardOfMember = (expandRecord,record) => {
      const options = [];
      if (Object.keys(record).length !== 0 &&  record.members &&  record.members.length ) {
        if (expandRecord.member.email === email) {
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
        } else {
          record.members.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              {item.email.split("@")[0]} | {item.username}
            </Card.Grid>
          ))
        }

      }
      return options
    };
    const myCardOfProject = (expandRecord,record) => {
      const options = [];
      if (Object.keys(record).length !== 0 && record.projects && record.projects.length) {
        if (expandRecord.member.email === email) {
          record.projects.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              <Link to="#" onClick={()=>this.projectTo(item.namespace,item.name)}>{item.display_name}</Link> | {item.language} |

              <Popconfirm
                title="确定删除吗？不可逆,谨慎操作!"
                onConfirm={() => this.onDeleteProjectConfirm(expandRecord,item.id)}
                icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
              >
                <a href='#'> 删除</a>
              </Popconfirm>
            </Card.Grid>
          ))
        } else {
          record.projects.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              <Link to="#" onClick={()=>this.projectTo(item.namespace,item.name)}>{item.display_name}</Link> | {item.language}
            </Card.Grid>
          ))
        }

      }
      return options
    };
    const myCardOfCronjob = (expandRecord,record) => {
      const options = [];
      if (Object.keys(record).length !== 0 && record.cronjobs && record.cronjobs.length) {
        if (expandRecord.member.email === email) {
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
        } else {
          record.cronjobs.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              <Link to="#" onClick={()=>this.cronjobTo(item.namespace,item.name)}><span style={expandStyle}>{item.name}</span></Link>
            </Card.Grid>
          ))
        }

      }
      return options
    };
    const Expand = (expandRecord,grouponedata) => {
      return  (
        expandRecord.member.email !== email ?
          <div>
            <Card title="成员">
              {myCardOfMember(expandRecord,grouponedata[expandRecord.id])}
            </Card>
            <Card title="项目" style={cardStyle}>
              {myCardOfProject(expandRecord,grouponedata[expandRecord.id])}
            </Card>
            <Card title="定时任务" style={cardStyle}>
              {myCardOfCronjob(expandRecord,grouponedata[expandRecord.id])}
            </Card>
          </div>
          :
          <div>
            <Card title="成员"  extra={<a onClick={() => this.onOwnerAddMember(expandRecord)}>添加成员</a>}>
              {myCardOfMember(expandRecord,grouponedata[expandRecord.id])}
            </Card>
            <Card title="项目" style={cardStyle} extra={<a onClick={() => this.onOwnerAddProject(expandRecord)}>添加项目</a>}>
              {myCardOfProject(expandRecord,grouponedata[expandRecord.id])}
            </Card>
            <Card title="定时任务" style={cardStyle} extra={<a onClick={() => this.onOwnerAddCronjob(expandRecord)}>添加定时任务</a>}>
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
        type: 'group/ownergrouplistdata',
        payload: {
          'name': value,
          'ns': this.state.ns,
        },
      });
    };
    return (
      <PageHeaderLayout>
        <Card
          title="组列表"
          extra={
            <span>
              <Button type="primary" ghost style={{ width: '120px' }} onClick={this.showModal}>
                <Icon type="plus" /> 添加组
              </Button>

            </span>
          }
        >

          <Table
            loading={loading}
            columns={columns}
            rowKey="id"
            dataSource={ownergrouplistdata}
            onExpand={onExpandedRowRender}
            expandedRowKeys={this.state.expandedRowKeys.length===0 ? [] : this.state.expandedRowKeys}
            onExpandedRowsChange={(res) => {
              this.setState({expandedRowKeys:res})
            }}
            expandedRowRender={(record) =>  this.state.expandVisible[record.id] === true ? this.state.expandedRowRenders[record.id] : true}
            // expandedRowRender={
            //   (record) =>  record.owner.email !== email ?
            //   <div>
            //     <Card title="成员">
            //       {myCardOfMember(record)}
            //     </Card>
            //     <Card title="项目" style={cardStyle}>
            //       {myCardOfProject(record)}
            //     </Card>
            //   </div>
            //     :
            //   <div>
            //     <Card title="成员"  extra={<a onClick={() => this.onOwnerAddMember(record)}>添加成员</a>}>
            //       {myCardOfMember(record)}
            //     </Card>
            //     <Card title="项目" style={cardStyle} extra={<a onClick={() => this.onOwnerAddProject(record)}>添加项目</a>}>
            //       {myCardOfProject(record)}
            //     </Card>
            //   </div>
            // }
            pagination={false}
          />
        </Card>
        <div>
          <AddGroupCronjobModal
            wrappedComponentRef={this.addGroupCronjobFormRef}
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
        <div>
          <CollectionCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            ownernslist={ownernslist}
          />
        </div>
        <div>
          <UpdateGroupModal
            wrappedComponentRef={this.updateFormRef}
            visible={this.state.updateGroupVisible}
            onCancel={this.handleUpdateGroupCancel}
            onCreate={this.handleUpdateGroupCreate}
            updateRecord={this.state.updateRecord}
          />
        </div>
      </PageHeaderLayout>
      )

  }
}

export default connect(({ group }) => ({
  ownergrouplist:group.ownergrouplist,
  ownergrouplistdata:group.ownergrouplistdata,
  memberlike: group.memberlike,
  namespaceProjectList: group.namespaceProjectList,
  ownerDeleteGroup:group.ownerDeleteGroup,
  ownerAddGroup:group.ownerAddGroup,
  ownerUpdateGroup:group.ownerUpdateGroup,
  ownerAddProject:group.ownerAddProject,
  ownerAddMember:group.ownerAddMember,
  ownerDelMember:group.ownerDelMember,
  ownerDelProject:group.ownerDelProject,
  ownernslist: group.ownernslist,
  groupOneData:group.groupOneData,
  namespaceCronjobList:group.namespaceCronjobList,
  ownerAddCronjob:group.ownerAddCronjob,
}))(groupList);
