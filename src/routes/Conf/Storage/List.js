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
} from 'antd';
import StandardTable from './StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

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
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建存储类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称...' }],
        })(<Input placeholder="请输入名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Provisioner">
        {form.getFieldDecorator('provisioner', {
          rules: [{ required: true, message: '请输入Provisioner...' }],
        })(<Input placeholder="请输入Provisioner" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="ReclaimPolicy">
        {form.getFieldDecorator('reclaim_policy', {
          initialValue: "Delete",
          rules: [{ required: true, message: '请选择 ReclaimPolicy' }],
        })(<div>
          <Select defaultValue="Delete" style={{ width: 120 }}>
            <Option value="Recycle">Recycle</Option>
            <Option value="Delete">Delete</Option>
            <Option value="Retain">Retain</Option>
          </Select>
        </div>)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="VolumeBindingMode">
        {form.getFieldDecorator('volume_binding_mode', {
          initialValue: "Immediate",
          rules: [{ required: true, message: '请选择 VolumeBindingMode' }],
        })(<div>
          <Select defaultValue="Immediate" style={{ width: 120 }}>
            <Option value="Immediate">Immediate</Option>
            <Option value="WaitForFirstConsumer">WaitForFirstConsumer</Option>
          </Select>
        </div>)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ storage }) => ({
  list: storage.list,
  loading: storage.loading,
}))
@Form.create()
export default class List extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'storage/list',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storage/add',
      payload: fields,
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { list, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: '名称',
        key: "name",
        dataIndex: 'name',
        render(val) {
          return <a href={`#/conf/storage/${val}`}>{val}</a>
        }
      },
      {
        title: '供应者 ',
        key: 'provisioner',
        dataIndex: 'provisioner',
      },
      {
        title: '参数',
        dataIndex: 'params',
        key: 'params',
        render(val) {
          return "-";
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY/MM/DD HH:mm:ss')}</span>,
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="存储类"
        logo={<img alt="" src="https://niu.yirendai.com/storage.png"/>}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list ? list : []}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
