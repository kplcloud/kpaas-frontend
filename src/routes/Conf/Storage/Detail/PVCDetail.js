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
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightEighties } from 'react-syntax-highlighter/styles/hljs';

import styles from '../List.less';

const {Description} = DescriptionList;
@connect(({ storage }) => ({
  detail: storage.pvcDetail,
  loading: storage.loading,
}))
@Form.create()
export default class PVCDetail extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'storage/pvcDetail',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace
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
        <Description term="命名空间">{detail.metadata.namespace}</Description>
        <Description term="注释">{this.lable(detail.metadata.annotations)}</Description>
        <Description term="状态">{detail.status.phase}</Description>
        <Description term="存储卷"><a href={`#/conf/storage/${detail.metadata.namespace}/persistentvolume/${detail.spec.volumeName}`}>{detail.spec.volumeName}</a></Description>
        <Description term="访问模式">{detail.spec.accessModes[0]}</Description>
        <Description term="存储类"><a href={`#/conf/storage/${detail.spec.storageClassName}`}>{detail.spec.storageClassName}</a></Description>
        <Description term="创建时间">{detail.metadata.creationTimestamp}</Description>
      </DescriptionList>
    );

    const list = [];
    list.push({
        name: "Storage",
        storage: detail.spec.resources.requests.storage
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
            title="总量"
        >
        <Table columns={columns} dataSource={list} pagination={false} rowKey={record => record.name} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
