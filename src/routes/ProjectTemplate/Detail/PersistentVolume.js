import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Tag, Table, Button } from 'antd';
import { findDOMNode } from 'react-dom';
import DescriptionList from '../../../components/DescriptionList';
import AddPersistentVolume from './AddPersistentVolume'

const { Description } = DescriptionList;
class PersistentVolume extends React.PureComponent {
    state = {
        addPvcVisible: false,
    };
  componentWillMount() {
    const { dispatch, deployment } = this.props;
    if (deployment && deployment.metadata.name) {
      dispatch({
        type: 'project/getPersistentVolume',
        payload: {
          namespace: deployment.metadata.namespace,
          name: deployment.metadata.name
        },
      });
    }
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
      //clearPersistentVolume
      dispatch({
        type: 'project/clearPersistentVolume',
    });
  };

  lable = data => {
    const that = this;
    var items = [];
    for (var key in data) {
      var len = data[key].length;
      let tag = (<Tag key={key}>
      {key}:{data[key]}
    </Tag>);
      if (len >= 40) {
          tag = (<Tag key={key} color="blue" onClick={(e) => {console.log(e)}}>
            {key}
          </Tag>)
      }
      items.push(tag)
    }
    return items;
  };

  handleCancel = (e) => {
    e.preventDefault();
    this.setState({
        addPvcVisible: false
    })
  };

  handleOk = (values) => {
    const {dispatch, deployment} = this.props;
    dispatch({
        type: 'project/bindPvc',
        payload: {
            ...values,
            namespace: deployment.metadata.namespace,
            name: deployment.metadata.name,
        },
    });

    this.setState({
        addPvcVisible: false
    })
  };

  showModal = (e) => {
    e.preventDefault();
    const {dispatch, deployment} = this.props;
    this.setState({
        addPvcVisible: true
    })
    dispatch({
        type: 'storage/pvcList',
        payload: {
            namespace: deployment.metadata.namespace
        },
    });
  };

  render() {
    const {persistentVolume, deployment, storage} = this.props;
    const {addPvcVisible} = this.state;
    const {pv, pvc,volumeName, pvcName, volumePath} = persistentVolume;
    const pvDetail = pv;

    if (!pvDetail || !pvDetail.metadata) {
        return (<Card style={{ marginBottom: 24 }} bordered={false}>
            <AddPersistentVolume
                visible={addPvcVisible}
                loading={false}
                handleCancel={this.handleCancel}
                handleOk={this.handleOk}
                deployment={deployment}
                storage={storage}
                />

            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
          </Card>)
    }

    const list = [];
    list.push({
        name: "Storage",
        storage: pvDetail.spec.capacity.storage
    })

    const columns = [{
        title: '资源名称',
        key: "name",
        dataIndex: 'name'
    }, {
      title: '数量',
      dataIndex: 'storage',
      key: "storage"
    }];

    return (
        <div>
            <Card title="详情" style={{ marginBottom: 24 }} bordered={false}>
                <DescriptionList  size="small" col="2">
                    <Description term="挂载名称">{volumeName}</Description>
                    <Description term="挂载路径">{volumePath}</Description>
                    <Description term="名称">{pvDetail.metadata.name}</Description>
                    <Description term="注释">{this.lable(pvDetail.metadata.annotations)}</Description>
                    <Description term="状态">{pvDetail.status.phase}</Description>
                    <Description term="访问模式">{pvDetail.spec.accessModes[0]}</Description>
                    <Description term="回收策略">{pvDetail.spec.persistentVolumeReclaimPolicy}</Description>
                    <Description term="声明"><a href={`#/conf/pvc/${pvDetail.spec.claimRef.namespace}/detail/${pvDetail.spec.claimRef.name}`}>{pvDetail.spec.claimRef.namespace}/{pvDetail.spec.claimRef.name}</a></Description>
                    <Description term="存储类"><a href={`#/conf/storage/${pvDetail.spec.storageClassName}`}>{pvDetail.spec.storageClassName}</a></Description>
                    <Description term="创建时间">{pvDetail.metadata.creationTimestamp}</Description>
                </DescriptionList>
            </Card>
            <Card title="NFS" style={{ marginBottom: 24 }} bordered={false}>
                <DescriptionList  size="small" col="2">
                    <Description term="服务器">{pvDetail.spec.nfs.server}</Description>
                    <Description term="路径">{pvDetail.spec.nfs.path}</Description>
                    <Description term="只读">-</Description>
                </DescriptionList>
            </Card>

            <Card bordered={false} 
                title="总量"
            >
                <Table columns={columns} dataSource={list} pagination={false} rowKey={record => record.name} />
            </Card>
        </div>
    );
  }
}

export default connect(({ project, storage }) => ({
    persistentVolume: project.persistentVolume,
    storage
}))(PersistentVolume);
