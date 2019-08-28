/**
 * Created by huyunting on 2018/5/15.
 */
import React, {PureComponent} from 'react';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {List, Card, Button, Tag, Icon} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
const {Description} = DescriptionList;
import AddModal from  '../../components/Security/addNamespace';

class NameSpaceList extends PureComponent {
  state = {
    loading: true,
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'namespace/list',
    });

  }

  render() {
    const {list, dispatch, loading, modalVisible, btnLoading} = this.props;
    const AddModalProps = {
      visible: modalVisible,
      btnLoading: btnLoading,
      onOk (data) {
        dispatch({
          type: 'namespace/addNamespace',
          payload: data,
        })
      },
      onCancel () {
        dispatch({
          type: 'namespace/hideModal',
        })
      }
    };
    const onAdd = () => {
      dispatch({
        type: 'namespace/showModal',
      })
    };
    const statusTag = (data) => {
      var items = []
      for (var key in data) {
        items.push(<Tag color="green" key={key}>{key}:{data[key]}</Tag>)
      }
      return items
    }
    const tagContent = (data) => {
      var items = []
      for (var key in data) {
        items.push(<Tag key={key}>{key}:{data[key]}</Tag>)
      }
      return items
    }

    const ListContent = (status, labels, name) => (
      <div>
        <DescriptionList style={{marginBottom: 24}}>
          <Description term="名称">{name}</Description>
        </DescriptionList>
        <DescriptionList style={{marginBottom: 24}}>
          <Description term="labels">{tagContent(labels)}</Description>
        </DescriptionList>
        <DescriptionList style={{marginBottom: 24}}>
          <Description term="状态">{statusTag(status)}</Description>
        </DescriptionList>
      </div>

    );
    const extra = (
      <Button type="primary" ghost style={{width: "150px", marginRight: "50px"}} onClick={onAdd}>
        <Icon type="plus"/> 创建命名空间
      </Button>
    );
    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          title="命名空间列表"
          style={{marginTop: 16}}
          extra={extra}
        >
          {list && (<List
            rowKey="id"
            loading={loading}
            style={{marginTop: 16}}
            grid={{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}}
            dataSource={list}
            renderItem={item => (
              <List.Item style={{height: 220}}>
                <Card title={item.title} type="inner">{ListContent(item.status, item.labels, item.name)}</Card>
              </List.Item>
            )}
          />)}
        </Card>

        <AddModal {...AddModalProps}/>
      </PageHeaderLayout>
    );
  }
}
export default connect(({namespace, loading}) => ({
  list: namespace.list,
  modalVisible: namespace.modalVisible,
  btnLoading: namespace.btnLoading,
}))(NameSpaceList);
