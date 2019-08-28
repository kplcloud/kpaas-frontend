import React, {PureComponent, Fragment} from 'react';
import {Table, Button, Input, message, Popconfirm, Divider, Select} from 'antd';
const Option = Select.Option;
import styles from './style.less';

export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      serviceName: '',
      ports: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
        serviceName: this.props.ServerName,
        ports: this.props.Ports,
      });
    }
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = {...target};
      }
      target.editable = !target.editable;
      this.setState({data: newData});
    }
  };

  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
    this.props.onChange(newData);
  }

  newMember = () => {
    const newData = this.state.data.map(item => ({...item}));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      port: '',
      serviceName: this.state.serviceName,
      path: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({data: newData});
  };
  renderAppOption = () => {
    const options = [];
    let ports = this.state.ports;
    if (ports.length) {
      ports.map((item, key) =>
        options.push(
          <Option value={item.port} key={item.key}>
            {item.port}
          </Option>
        )
      );
    }
    return options;
  };

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (fieldName == 'port') {
        target[fieldName] = e;
      } else if (fieldName == 'port_input') {
        target['port'] = e.target.value;
      } else {
        target[fieldName] = e.target.value;
      }

      this.setState({data: newData});
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.path || !target.serviceName || !target.port) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({data: newData});
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
        width: '40%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'path', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="Path: /project 或 /.* (/.* 表示全部)"
              />
            );
          }
          return text;
        },
      },
      {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: '20%',
        render: (text, record) => {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'serviceName', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="服务名称: "
              disabled
            />
          );
        },
      },
      {
        title: '端口号',
        dataIndex: 'port',
        key: 'port',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            if (this.props.Ports.length > 0) {
              return (
                <Select
                  placeholder="--选择端口--"
                  style={{width: 120}}
                  onChange={e => this.handleFieldChange(e, 'port', record.key)}
                >
                  {this.renderAppOption()}
                </Select>
              );
            } else {
              return (
                <Input
                  value={text}
                  onChange={e => this.handleFieldChange(e, 'port_input', record.key)}
                  onKeyPress={e => this.handleKeyPress(e, record.key)}
                  placeholder="端口名称: "
                />
              );
            }
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical"/>
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical"/>
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical"/>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{width: '100%', marginTop: 16, marginBottom: 8}}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增成员
        </Button>
      </Fragment>
    );
  }
}
