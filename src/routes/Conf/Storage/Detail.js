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
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightEighties } from 'react-syntax-highlighter/styles/hljs';

import styles from './List.less';

// const FormItem = Form.Item;
// const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// 一个尚未绑定到索赔的免费资源, 该数量与索赔相关, 声明已被删除，但群集尚未回收资源, 卷自动回收失败
const statusMap = {'Available':<Icon type="warning" />, 'Bound':<Icon type="check-circle" />, 'Released': <Icon type="exclamation-circle" />, 'Failed': <Icon type="minus-circle" />};

const {Description} = DescriptionList;
@connect(({ storage }) => ({
  detail: storage.detail,
  loading: storage.loading,
}))
@Form.create()
export default class Detail extends PureComponent {
  state = {
    visible: false,
    title: '',
    content: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'storage/getDetail',
      payload: {
        name: match.params.name
      }
    });
  };

  showModal = (e, key, data) => {
    e.preventDefault();
  };

  handleCancel = () => {
    this.setState({ visible: false, title: '', content: '' });
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
    const {visible, title, content} = this.state;

    if (!detail || !detail.metadata) {
      return ('')
    }
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="名称">{detail.metadata.name}</Description>
        <Description term="注释">{this.lable(detail.metadata.annotations)}</Description>
        <Description term="标签">-</Description>
        <Description term="供应者">{detail.provisioner}</Description>
        <Description term="参数">-</Description>
        <Description term="创建时间">{detail.metadata.creationTimestamp}</Description>
      </DescriptionList>
    );
    const columns = [{
        title: '名称',
        dataIndex: 'spec',
        key: 'name',
        render(val) {
          console.log(val)
          return <a href={`#/conf/storage/${val.claimRef.namespace}/persistentvolume/pvc-${val.claimRef.uid}`}>pvc-{val.claimRef.uid}</a>
        }
    }, {
      title: '总量',
      dataIndex: 'spec',
      key: "spec-capactity",
      render(val) {
        return val.capacity.storage;
      }
    }, {
      title: '访问方式',
      dataIndex: 'spec',
      key: 'spec-accessModes',
      render(val) {
        return val.accessModes[0];
      }
    }, {
      title: '回收策略',
      dataIndex: 'spec',
      key: 'persistentVolumeReclaimPolicy',
      render(val) {
        return val.persistentVolumeReclaimPolicy;
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render(val) {
        return <span>{statusMap[val.phase]} {val.phase}</span>;
      }
    }, {
      title: '声明',
      dataIndex: 'spec',
      key: 'claimRef',
      render(val) {
        return <a href={`#/conf/pvc/${val.claimRef.namespace}/detail/${val.claimRef.name}`}>{val.claimRef.namespace}/{val.claimRef.name}</a>
      }
    }, {
      title: '存储类',
      dataIndex: 'spec',
      key: 'storageClassName',
      render(val) {
        return val.storageClassName;
      }
    }, {
      title: '原因',
      dataIndex: 'spec',
      key: '-',
      render(val) {
        return "-"
      }
    }, {
      title: '创建时间',
      dataIndex: 'metadata',
      key: 'creationTimestamp',
      render(val) {
        return val.creationTimestamp;
      }
    }];

    return (
      <PageHeaderLayout title={detail.metadata.name}
        logo={<img alt="" src="https://niu.yirendai.com/storage.png"/>}
        content={description}
      >
        <Modal
          visible={visible}
          title={title}
          width={600}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
          bodyStyle={{ background: '#EFEFEF', overflow: 'auto', maxHeight: '500px', margin: 0, padding: 0 }}
        >
          <SyntaxHighlighter language='json' style={tomorrowNightEighties}>{content}</SyntaxHighlighter>
        </Modal>
        <Card bordered={false}>
          <div className={styles.tableList}>            
            <Table columns={columns} dataSource={detail.persistent_volume_list} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
