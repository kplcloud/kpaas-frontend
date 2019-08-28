import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Card, Table, Icon, Pagination, Input, Tag} from 'antd';
import { routerRedux, Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const Search = Input.Search;
import AddModal from  '../../components/Proclaim/addProclaim';

class Proclaim extends PureComponent {
  state = {
    loading: true,
    id: 0,
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'proclaim/proclaimlist',
    });

  }


  onAdd = () => {
    const {dispatch} = this.props

    //直接跳转，原为弹层，改为跳转新页打开
    dispatch(routerRedux.push('/system/addproclaim'));

    // dispatch({
    //   type: "proclaim/userList"
    // })
    // dispatch({
    //   type: "proclaim/namespacesList"
    // })
    // dispatch({
    //   type: 'proclaim/showAddModal',
    // })
  };

  onView = (id) => {
    const {dispatch} = this.props

    //直接跳转，原为弹层，改为跳转新页打开
    dispatch(routerRedux.push('/system/viewproclaim/'+id));
  }

  searchChange = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'proclaim/proclaimlist',
      payload: {
        title: value
      },
    });
  }

  render() {
    const {list, loading,btnLoading, dispatch,proclaimList, proclaimPage,modalVisible, allNamespacesList,userList} = this.props; //console.log(9999,this.props)
    const AddModalProps = {
      namespaceList:allNamespacesList,
      userList:userList,
      visible:modalVisible,
      onOk (data) {
      	//增公告
        dispatch({
            type: 'proclaim/addProclaim',
            payload: data,
          })
        console.log(data)
      },
      onCancel () {
        dispatch({
          type: 'proclaim/hideModal',
        })
      }
    };
    const columns = [{
      title: '标题',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => this.onView(record.id)}>{text.title}</a>
      ),
    }, {
      title: '内容',
      key: 'content',
      render: (text, record) => (
        <p dangerouslySetInnerHTML={{ __html: text.content}} />
      ),
    }, {
      title: '类型',
      key: 'proclaim_type',
      render: (text, record) => (
        <Tag color="#2db7f5">{text.proclaim_type}</Tag>
      ),
    }, {
      title: '接收对象',
      key: 'proclaim_receive_text',
      render: (text, record) => (
        <Tag color="#2db7f5">{text.proclaim_receive_text}</Tag>
      ),
    }, {
      title: '发布者',
      dataIndex: 'member_name',
      key: 'member_name',
    }, {
      title: '发布时间',
      dataIndex: 'created_at',
      key: 'created_at',
    }];
    const extraContent = (
      <div >
        <Search
          placeholder="搜索标题..."
          onSearch={value => this.searchChange(value)}
          enterButton
        />
      </div>
    );
    const onShowSizeChange = (current) => {
      const {dispatch} = this.props
      dispatch({
        type: 'proclaim/proclaimlist',
        payload: {
          "p": current,
        },
      });
    }
    return (
      <PageHeaderLayout>
        <Card title="公告列表" extra={extraContent}>
          <Button type="dashed" style={{width: "100%", marginBottom: 20}} onClick={this.onAdd}>
            <Icon type="plus"/> 添加公告
          </Button>
          <Table loading={loading} columns={columns} rowKey="id" dataSource={list} pagination={false}/>
          <Pagination style={{marginTop: 20, float: "right"}}
                      title=""
                      current={proclaimPage ? proclaimPage.page : 0}
                      defaultCurrent={proclaimPage.page}
                      total={proclaimPage.total}
                      showTotal={total => `共 ${proclaimPage.total} 条数据`}
                      onChange={onShowSizeChange}/>
        </Card>
  		<AddModal {...AddModalProps}/>
      </PageHeaderLayout>
    );
  }
}
export default connect(({proclaim, loading}) => ({
  userList: proclaim.userList,
  allNamespacesList: proclaim.allNamespacesList,
  modalVisible: proclaim.modalVisible,
  list: proclaim.proclaimList,
  loading: proclaim.loading,
  proclaimPage: proclaim.proclaimPage,
}))(Proclaim);
