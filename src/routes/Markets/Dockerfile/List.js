import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  List,
  Tooltip,
  Row,
  Col, Icon,
  Avatar,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../components/StandardFormRow/index';
import TagSelect from '../../../components/TagSelect/index';
import * as routerRedux from 'react-router-redux';

const FormItem = Form.Item;
const { Option } = Select;
const colorList = {
  Python: '#f0bb12',
  Golang: '#69c4dc',
  Java: '#205aae',
  NodeJs: '#7cc239',
};
const CreateForm = Form.create()(props => {
  const { modalVisible, editModal, detailInfo, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="Dockerfile"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {editModal && (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="名称" style={{ display: 'none' }} s>
          {form.getFieldDecorator('id', {
            initialValue: (editModal && detailInfo) ? detailInfo.id : '',
          })(<Input placeholder=""/>)}
        </FormItem>
      )}
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: (editModal && detailInfo) ? detailInfo.name : '',
          rules: [{ required: true, message: '请输入名称...' }],
        })(<Input placeholder="请输入名称"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="版本">
        {form.getFieldDecorator('version', {
          initialValue: (editModal && detailInfo) ? detailInfo.version : '',
          rules: [{ required: true, message: '请输入版本...' }],
        })(<Input placeholder="请输入版本"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="语言">
        {form.getFieldDecorator('language', {
          initialValue: (editModal && detailInfo) ? detailInfo.language : 'Golang',
          rules: [{ required: true, message: '请选择 语言' }],
        })(
          <Select style={{ width: 120 }}>
            <Option value="Golang">Golang</Option>
            <Option value="Java">Java</Option>
            <Option value="Python">Python</Option>
            <Option value="NodeJs">NodeJs</Option>
          </Select>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="Dockerfile">
        {form.getFieldDecorator('dockerfile', {
          initialValue: (editModal && detailInfo) ? detailInfo.dockerfile : '',
          rules: [{ required: true, message: '请输入Dockerfile 内容' }],
        })(<Input.TextArea
          placeholder="Dockerfile内容"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="全路径">
        {form.getFieldDecorator('full_path', {
          initialValue: (editModal && detailInfo) ? detailInfo.full_path : '',
          rules: [{ required: true, message: '请输入全路径' }],
        })(<Input.TextArea
          placeholder="全路径 eg: hub.kpaas.nsini.com/golang/goalng-1.11.2:v1.0"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="使用例子">
        {form.getFieldDecorator('detail', {
          initialValue: (editModal && detailInfo) ? detailInfo.detail : '',
          rules: [{ required: true, message: '请填写使用例子' }],
        })(<Input.TextArea placeholder="请填写使用例子"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          initialValue: (editModal && detailInfo) ? detailInfo.desc : '',
          rules: [{ message: 'Please input some description...' }],
        })(<Input.TextArea placeholder="请输入描述"/>)}
      </FormItem>
    </Modal>
  );
});

@connect(({ dockerfile }) => ({
  list: dockerfile.list,
  detailInfo: dockerfile.detailInfo,
  loading: dockerfile.loading,
}))
@Form.create()
export default class DockerFileList extends PureComponent {
  state = {
    modalVisible: false, /**弹框展示**/
    editModal: false,
    language: [],
    checkStatus: '',
    searchName: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dockerfile/list',
      payload: {},
    });
  }

  handleModalVisible = (flag, edit, id) => {
    this.setState({
      modalVisible: !!flag,
      editModal: !!edit,
    });
    if (edit && id > 0) {
      this.props.dispatch({
        type: 'dockerfile/detail',
        payload: {
          id: id,
        },
      });
    }
  };

  downloadDockerfile = (id) => {
    window.open('/market/dockerfile/'+id+'/download');
  };

  dockerfileDetail = (id) => {
    this.props.dispatch(routerRedux.push('/markets/dockerfile/detail/' + id));
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    if (this.state.editModal) {
      dispatch({
        type: 'dockerfile/updateDockerFile',
        payload: fields,
      });
    } else {
      dispatch({
        type: 'dockerfile/addDockerFile',
        payload: fields,
      });
    }
    this.setState({
      modalVisible: false,
    });
  };

  iconColor = language => {
    for (const k in  colorList) {
      if (k === language && colorList[k]) {
        return colorList[k];
      }
    }
    return '#99ddcc';
  };

  render() {
    const { loading, list, detailInfo } = this.props;
    const { modalVisible, editModal } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const extraContent = (
      <div style={{ marginTop: '-60px', marginRight: '200px' }}>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, false)}>
          创建Dockerfile
        </Button>
      </div>
    );
    const changeLanguage = (value) => {
      this.setState({ language: value });
    };
    const changeCheckStatus = (value) => {
      this.setState({ checkStatus: value });
    };
    const searchName = (e) => {
      this.setState({ searchName: e.target.value });
    };

    const search = () => {
      console.log(this.state);
      this.props.dispatch({
        type: 'dockerfile/list',
        payload: {
          language: this.state.language,
          status: this.state.checkStatus,
          name: this.state.searchName,
        },
      });
    };

    return (
      <PageHeaderLayout
        title={(<span><Icon type="shop"/>  Dockerfile 市场</span>)}
        extraContent={extraContent}
      >
        <Card bordered={false}>
          <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
            <TagSelect expandable onChange={(e) => changeLanguage(e)}>
              <TagSelect.Option value="Java">Java</TagSelect.Option>
              <TagSelect.Option value="Golang">Golang</TagSelect.Option>
              <TagSelect.Option value="Python">Python</TagSelect.Option>
              <TagSelect.Option value="NodeJs">NodeJs</TagSelect.Option>
            </TagSelect>
          </StandardFormRow>
          <StandardFormRow title="其它选项" grid last>
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <Input placeholder="名称" onBlur={(value) => searchName(value)} style={{ maxWidth: 200, width: '100%' }}/>
              </Col>
              <Col lg={8} md={10} sm={10} xs={24}>
                {/* <Select
                  placeholder="状态"
                  style={{ maxWidth: 200, width: '100%' }}
                  onChange={(e) => changeCheckStatus(e)}
                >
                  <Option value="1">审核通过</Option>
                  <Option value="0">未审核</Option>
                </Select> */}
              </Col>
              <Col lg={4} md={10} sm={10} xs={24}>
                <Button icon="search" type="primary" onClick={() => search()}>
                  搜索
                </Button>
              </Col>
            </Row>
          </StandardFormRow>
        </Card>
        {list && list.length > 0 && (
          <List
            rowKey="id"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            loading={loading}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={[
                    <Tooltip title="下载" onClick={() => this.downloadDockerfile(item.id)}>
                      <Icon type="download"/>
                    </Tooltip>,
                    <Tooltip title="编辑" onClick={() => this.handleModalVisible(true, true, item.id)}>
                      <Icon type="edit"/>
                    </Tooltip>,
                    <Tooltip title="详情">
                      <Icon type="ellipsis"/>
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar
                      style={{ backgroundColor: this.iconColor(item.language) }}>{item.language.substring(0, 1)}</Avatar>}
                    title={(<span onClick={() => this.dockerfileDetail(item.id)}>{item.name}</span>)}
                  />
                  {item.name && (
                    <div style={{ marginTop: 20 }} onClick={() => this.dockerfileDetail(item.id)}>
                      <div style={{ marginLeft: 20, width: '50%', float: 'left' }}>
                        <p>版本号</p>
                        <h3>{item.version}</h3>
                      </div>
                      <div>
                        <p>下载数</p>
                        <h3>{item.download ? item.download : 1}</h3>
                      </div>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
        {this.state.editModal && detailInfo && (
          <CreateForm {...parentMethods} modalVisible={modalVisible} editModal={editModal} detailInfo={detailInfo}/>
        )}
        {!this.state.editModal && (<CreateForm {...parentMethods} modalVisible={modalVisible} editModal={editModal}/>)}
      </PageHeaderLayout>
    );
  }
}
