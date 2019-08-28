import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  message,
  InputNumber,
} from 'antd';
import StandardTable from './StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../../components/Security/namespaceSelect';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
// const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, setSelectAfter, storageClass } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const selectAfter = (
    <Select defaultValue="Mi" style={{ width: 80 }} onChange={setSelectAfter}>
      <Option value="Mi">Mi</Option>
      <Option value="Gi">Gi</Option>
      <Option value="Ti">Ti</Option>
    </Select>
  );

  const selectAccessModes = function(val) {
    form.setFieldsValue({
      access_modes: val,
    });
  };

  return (
    <Modal
      title="新建存储卷"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="持久化卷名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入持久化卷名称...' }],
        })(<Input placeholder="请输入持久化卷名称"/>)}
      </FormItem>

      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="容量">
        {form.getFieldDecorator('storage', {
          rules: [{ required: true, message: '请输容量...' }],
        })(
          <span><InputNumber min={1} max={1000}/> &nbsp;{selectAfter}</span>,
        )}
      </FormItem>

      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="访问模式">
        {form.getFieldDecorator('access_modes', {
          initialValue: 'ReadWriteOnce',
          rules: [{ required: true, message: '请选择 访问模式' }],
        })(<div>
          <Select style={{ width: 180 }} onChange={selectAccessModes}>
            <Option value="ReadWriteOnce">ReadWriteOnce</Option>
            <Option value="ReadOnlyMany">ReadOnlyMany</Option>
            <Option value="ReadWriteMany">ReadWriteMany</Option>
          </Select>
        </div>)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="存储类">
        {form.getFieldDecorator('storage_class_name', {
          rules: [{ required: true, message: '请选择存储类...' }],
        })(<Select style={{ width: 180 }}>
          {storageClass && storageClass.map((item, key) => {
            return <Option value={item.name} key={key}>{item.name}</Option>;
          })}
        </Select>)}
      </FormItem>
    </Modal>
  );
});

@connect(({ storage }) => ({
  pvcList: storage.pvcList,
  loading: storage.loading,
  pagination: storage.pagination,
  list: storage.list,
}))
@Form.create()
export default class PersistentVolumeClaim extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    formValues: {},
    defaultNamespace: '',
    unit: 'Mi',
    accessMode: 'ReadWriteOnce',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'storage/pvcList',
    });
  }

  handleModalVisible = flag => {
    let modalVisible = !!flag;
    this.setState({
      modalVisible: !!flag,
    });
    if (modalVisible) {
      this.getStorage();
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    fields.unit = this.state.unit;
    let access_modes = [];
    access_modes.push(fields.access_modes);
    fields.access_modes = access_modes;
    dispatch({
      type: 'storage/pvcAdd',
      payload: fields,
    });

    this.setState({
      modalVisible: false,
    });
  };

  setSelectAfter = (val) => {
    this.setState({ unit: val });
  };

  getStorage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storage/listByNamespace',
      params: {
        namespace: this.state.defaultNamespace,
      },
      payload: {
        namespace: this.state.defaultNamespace,
      },
    });
  };

  onChange = (pagination, filters, sorter) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'storage/pvcList',
      payload: {
        page: pagination.current,
        limit: pagination.pageSize
      }
    });
  }

  render() {
    const { pvcList, loading, dispatch, list, pagination } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const that = this;
    const columns = [
      {
        title: '名称',
        key: 'metadata-name',
        dataIndex: 'metadata',
        render(val) {
          return <a href={`#/conf/pvc/${val.namespace}/detail/${val.name}`}>{val.name}</a>;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render(val) {
          return val.phase;
        },
      },
      {
        title: '存储卷',
        dataIndex: 'spec',
        key: 'volumeName',
        render(val) {
          return val.volumeName;
        },
      },
      {
        title: '总容量',
        dataIndex: 'spec',
        key: 'storage',
        render(val) {
          return val.resources && val.resources.requests && val.resources.requests.storage;
        },
      },
      {
        title: '访问模式',
        dataIndex: 'spec',
        key: 'accessModes',
        render(val) {
          return val && val.accessModes && val.accessModes[0];
        },
      },
      {
        title: '存储类',
        dataIndex: 'spec',
        key: 'storageClassName',
        render(val) {
          return val.storageClassName;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'metadata',
        sorter: true,
        render: val => <span>{moment(val.creationTimestamp).format('YYYY/MM/DD HH:mm:ss')}</span>,
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const namespaceSelectPros = {
      onOk(value) {
        dispatch({
          type: 'storage/pvcList',
          payload: {
            namespace: value,
          },
        });
        that.setState({ defaultNamespace: value });
      },
    };

    return (
      <PageHeaderLayout title="存储卷"
                        logo={<img alt="" src="https://niu.yirendai.com/storage.png"/>}
        // content={description}
      >
        <Card bordered={false} title="持久化存储卷声明"
              extra={
                <span>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={this.handleModalVisible}
                    style={{ marginRight: 10 }}
                  >
                    新建
                  </Button>
                  &nbsp;&nbsp;
                  <NamespaceSelect {...namespaceSelectPros} />
                </span>
              }
        >
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={pvcList ? pvcList : []}
              columns={columns}
              onChange={this.onChange}
              pagination={pagination}
            />
            
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} setSelectAfter={this.setSelectAfter}
                    storageClass={list}/>
      </PageHeaderLayout>
    );
  }
}
