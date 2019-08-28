import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Modal,
  message,
  Badge,
  Tag,
  Tooltip,
  Popconfirm,
  Select,
  InputNumber,
} from 'antd';
import StandardTable from './StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../../components/Security/namespaceSelect';
import { routerRedux } from 'dva/router';

const Search = Input.Search;
const Option = Select.Option;

const TextArea = Input;

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const handleSelectChange = (value) => {
    form.setFieldsValue({
      name: value,
    });
  };

  return (
    <Modal
      title="创建基础资源"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="资源类型">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请选择生成的资源类型' }],
        })(<div>
          <Select defaultValue="redis" style={{ width: 120 }} onChange={handleSelectChange}>
            <Option value="redis">Redis</Option>
            <Option value="mysql">Mysql</Option>
            <Option value="zookeeper">Zookeeper</Option>
            <Option value="rocketmq">RocketMQ</Option>
            <Option value="rabbitmq">RabbitMQ</Option>
          </Select>
        </div>)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="启动数量">
        {form.getFieldDecorator('replicas', {
          initialValue: 1,
          rules: [{ required: true, message: '请输入启动资源的数量' }],
        })(<InputNumber min={1} max={10} step={1}/>)}
      </FormItem>

    </Modal>
  );
});

@connect(({ resource }) => ({
  list: resource.list,
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/list',
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/generate',
      payload: { ...fields },
    });
    this.setState({
      modalVisible: false,
    });
  };

  onDetail = (text, record) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/project/discovery/services/detail/${record.namespace}/${text}`));
  };

  handleVisibleChange = visible => {
    if (!visible) {
      this.setState({ visible });
      return;
    }
  };

  onDelete = (name, namespace) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/delete',
      payload: {
        name: name,
        namespace: namespace,
      },
    });
  };

  render() {
    const { list, loading, dispatch } = this.props;
    const { modalVisible } = this.state;
    const that = this;
    const columns = [
      {
        title: '资源详情',
        dataIndex: 'name',
        key: 'name',
        // sorter: (a, b) => a.name.length - b.name.length,
        render(val, record) {
          return (
            <Tooltip placement="topLeft" title="待实现" arrowPointAtCenter>
              <a>{val}</a>
            </Tooltip>
          );
        },
      },
      {
        title: '服务详情',
        dataIndex: 'name',
        key: 'service-name',
        // sorter: (a, b) => a.name.length - b.name.length,
        render(val, record) {
          return (
            <a onClick={() => that.onDetail(val, record)}>{val} service</a>
          );
        },
      },
      {
        title: '标签',
        dataIndex: 'labels',
        key: 'labels',
        render(val) {
          var res = [];
          for (var i in val) {
            res.push(
              <div key={`label-tag-${i}`}>
                <Tag key={`label-tag-${i}`}>
                  {i}: {val[i]}
                </Tag>
              </div>,
            );
          }
          return res.length > 0 ? res : '-';
        },
      },
      {
        title: '启动数量',
        dataIndex: 'replicas',
        key: 'replicas',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render(val) {
          return <Badge
            status={val}><Icon type={val}/></Badge>;
        },
      },
      {
        title: '创建人',
        dataIndex: 'member',
        key: 'member',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        // sorter: (a, b) => a.name.length - b.name.length,
        // render: val => <span>{moment(val).format('YYYY/MM/DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            {/* <Tooltip placement="topLeft" title="编辑" arrowPointAtCenter>
              <a key={text.id + 100} onClick={() => this.onEdit(record.namespace, record.name)}>
                <Icon type="edit" />
              </a>
            </Tooltip>
            |
            <Popconfirm title="您确定要删除这个资源?" onConfirm={() => this.onDelete(text.name, text.namespace)}>
                <a href="javascript:;"> <Icon type="delete"/></a>
            </Popconfirm> */}
          </span>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const namespaceSelectPros = {
      onOk(value) {
        dispatch({
          type: 'resource/list',
          payload: {
            namespace: value,
          },
        });
        that.setState({ defaultNamespace: value });
      },
    };
    const searchChange = val => {
      dispatch({
        type: 'resource/list',
        payload: {
          namespace: this.state.defaultNamespace,
          name: val,
        },
      });
    };

    return (
      <PageHeaderLayout title="生成资源工具">
        <Card
          title={`资源`}
          bordered={false}
          extra={
            <span>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
                style={{ marginRight: 10 }}
              >
                新建
              </Button>
              &nbsp;&nbsp;
              {/* <Button style={{marginRight: 20}} onClick={()=>console.log("pull")}>更新</Button> */}
              <NamespaceSelect {...namespaceSelectPros} />
              <Search
                style={{ width: 200, marginLeft: 20 }}
                placeholder="搜索资源名称..."
                onSearch={value => searchChange(value)}
                enterButton
              />
            </span>
          }
        >
          <div>
            <StandardTable
              loading={loading}
              data={list ? { list: list, pagination: {} } : []}
              columns={columns}
              // onSelectRow={this.handleSelectRows}
              // onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
