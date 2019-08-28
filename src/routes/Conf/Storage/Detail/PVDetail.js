import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Tag,
  Modal,
  Table,
  Icon
} from 'antd';
// import StandardTable from './StandardTable';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/DescriptionList';

import styles from '../List.less';

const {Description} = DescriptionList;
@connect(({ storage }) => ({
  detail: storage.pvDetail,
  loading: storage.loading,
}))
@Form.create()
export default class PVDetail extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'storage/pvDetail',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
        volumeName: match.params.volumeName
      }
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
          tag = (<Tag key={key} color="blue" onClick={(e) => that.showModal(e, key, data[key])}>
            {key}
          </Tag>)
      }
      items.push(tag)
    }
    return items;
  };

  render() {
    const { detail } = this.props;
    if (!detail || !detail.metadata) {
      return ('')
    }
    
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="名称">{detail.metadata.name}</Description>
        <Description term="注释">{this.lable(detail.metadata.annotations)}</Description>
        <Description term="状态">{detail.status.phase}</Description>
        <Description term="访问模式">{detail.spec.accessModes[0]}</Description>
        <Description term="回收策略">{detail.spec.persistentVolumeReclaimPolicy}</Description>
        <Description term="声明"><a href={`#/conf/pvc/${detail.spec.claimRef.namespace}/detail/${detail.spec.claimRef.name}`}>{detail.spec.claimRef.namespace}/{detail.spec.claimRef.name}</a></Description>
        <Description term="存储类"><a href={`#/conf/storage/${detail.spec.storageClassName}`}>{detail.spec.storageClassName}</a></Description>
        <Description term="创建时间">{detail.metadata.creationTimestamp}</Description>
      </DescriptionList>
    );

    const list = [];
    list.push({
        name: "Storage",
        storage: detail.spec.capacity.storage
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
      <PageHeaderLayout title={detail.metadata.name}
        logo={<img alt="" src="https://niu.yirendai.com/storage.png"/>}
        content={description}
      >
        <Card bordered={false}
            title="来源"
            style={{marginBottom: 24}}
        >
        <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="">NFS</Description>
            <Description term="服务器">{detail.spec.nfs.server}</Description>
            <Description term="路径">{detail.spec.nfs.path}</Description>
            <Description term="只读">-</Description>
            
        </DescriptionList>
        </Card>

        <Card bordered={false} 
            title="总量"
        >
        <Table columns={columns} dataSource={list} pagination={false} rowKey={record => record.name} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
