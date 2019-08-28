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
} from 'antd';
import StandardTable from './StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../../components/Security/namespaceSelect';
import styles from './Index.less';
import { routerRedux } from 'dva/router';

const Search = Input.Search;

const TextArea = Input;

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      // handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="从Yaml创建"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<TextArea placeholder="请输入"/>)}
      </FormItem>
    </Modal>
  );
});

@connect(({ services }) => ({
  list: services.list,
  loading: services.loading,
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
      type: 'services/list',
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
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };
  onCreate = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/project/discovery/services/create'));
  };
  onEdit = (namespace, name) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/project/discovery/services/edit/' + namespace + '/' + name));
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
    // Determining condition before show the popconfirm.
    console.log(this.state.condition);
    if (this.state.condition) {
      this.confirm(); // next step
    } else {
      this.setState({ visible }); // show the popconfirm
    }
  };

  confirm = () => {
    this.setState({ visible: false });
    message.success('Next step.');
  };

  cancel = () => {
    this.setState({ visible: false });
    message.error('Click on cancel.');
  };

  onDelete = (name, namespace) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'services/delete',
      payload: {
        name: name,
        namespace: namespace,
      },
    });
  };

  render() {
    const { list, loading, dispatch } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const that = this;
    const columns = [
      {
        title: '服务',
        dataIndex: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        render(val, record) {
          return (
            <Badge
              status="success"
              text={<a onClick={() => that.onDetail(val, record)}>{val}</a>}
            />
          );
        },
      },
      {
        title: '标签',
        dataIndex: 'labels',
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
        title: '集群IP ',
        dataIndex: 'cluster_ip',
        align: 'right',
        render: val => <Tag>{val}</Tag>,
        // mark to display a total number
        needTotal: true,
      },
      {
        title: '内部端点',
        dataIndex: 'inside_endpoint',
        render(val, record) {
          var res = [];
          for (var i = 0; i < val.length; i++) {
            res.push(
              <div key={`div-${record.name}${i}`}>
                <Tag key={`tag-${record.name}${i}`}>
                  {record.name}.{record.namespace}:{val[i].port}
                </Tag>{' '}
                {val[i].protocol}
              </div>,
            );
          }
          return res.length > 0 ? res : '-';
        },
      },
      {
        title: '外部端点',
        dataIndex: 'external_endpoint',
        render(val, record) {
          var res = [];
          for (var i = 0; i < val.length; i++) {
            res.push(
              <div key={`external-div-${record.name}${i}`}>
                <Tag key={`external-tag-${record.name}${i}`}>
                  {record.name}.{record.namespace}:{val[i].port}
                </Tag>{' '}
                {val[i].protocol}
              </div>,
            );
          }
          return res.length > 0 ? res : '-';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Tooltip placement="topLeft" title="编辑" arrowPointAtCenter>
              <a key={text.id + 100} onClick={() => this.onEdit(record.namespace, record.name)}>
                <Icon type="edit"/>
              </a>
            </Tooltip>
            {/*| */}
            {/*<Popconfirm title="您确定要删除这个服务?" onConfirm={() => this.onDelete(text.name, text.namespace)}>*/}
            {/*<a href="javascript:;"> <Icon type="delete"/></a>*/}
            {/*</Popconfirm>*/}
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
          type: 'services/list',
          payload: {
            namespace: value,
          },
        });
        that.setState({ defaultNamespace: value });
      },
    };
    const searchChange = val => {
      dispatch({
        type: 'services/list',
        payload: {
          namespace: this.state.defaultNamespace,
          name: val,
        },
      });
    };

    return (
      <PageHeaderLayout title="服务发现与负载">
        <Card
          title={`服务`}
          bordered={false}
          extra={
            <span>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.onCreate()}
                style={{ marginRight: 10 }}
              >
                新建
              </Button>
              &nbsp;&nbsp;
              {/* <Button style={{marginRight: 20}} onClick={()=>console.log("pull")}>更新</Button> */}
              <NamespaceSelect {...namespaceSelectPros} />
              <Search
                style={{ width: 200, marginLeft: 20 }}
                placeholder="搜索服务名称..."
                onSearch={value => searchChange(value)}
                enterButton
              />
            </span>
          }
        >
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
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
