/**
 * Created by huyunting on 2018/5/22.
 */
import React, {PropTypes} from 'react'
import {Table, Form, Icon, Button, Popconfirm, message} from 'antd';
import EditableCell from  "./EditableCell"

class EditableTable extends React.Component {

  state = {
    dataSource: [],
    count: 1,
    data: false,//是否有数据
  };

  constructor(props) {
    super(props);
    const {confData, onOk} = props;
    if (confData && confData.length) {
      var dataMap = [];
      confData.map((item, key) => {
        dataMap.push({id: key, key: item.key, value: item.value})
      })
      this.state = {
        dataSource: dataMap,
        count: confData.length,
        data: true,
      }
    } else {
      this.state = {
        dataSource: [{
          id: 0,
          key: '',
          value: '',
        }],
        count: 1,
      }
    }

    this.columns = [{
      title: 'Key',
      dataIndex: 'key',
      width: '30%',
      render: (text, record) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(record.id, 'key')}
        />
      ),
    }, {
      title: 'Value',
      dataIndex: 'value',
      render: (text, record) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(record.id, 'value')}
        />
      ),
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          this.state.dataSource.length > 1 ?
            (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.id)}>
                <a href="javascript:;">Delete</a>
              </Popconfirm>
            ) : null
        );
      },
    }];
  };

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      if (dataIndex == "key" && value != "") {
        for (var i = 0; i < this.state.dataSource.length; i++) {
          if (this.state.dataSource[i]["key"] && this.state.dataSource[i]["key"] == value && i != key) {
            message.error("字典数据中的key不能有重复~");
            this.onDelete(key);
            return
          }
        }
      }
      const target = dataSource.find(item => item.id === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({dataSource});
      }
      this.props.onOk(this.state.dataSource)
    };

  };
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({dataSource: dataSource.filter(item => item.id !== key)});
    this.props.onOk(dataSource.filter(item => item.id !== key))
  };
  handleAdd = () => {
    const {count, dataSource} = this.state;
    const newData = {
      id: count,
      key: '',
      value: '',
    };
    for (var i = 0; i < this.state.dataSource.length; i++) {
      if (this.state.dataSource[i]["key"] == newData.key) {
        message.error("请先填写完整的字典数据之后再添加~");
        return
      }
    }
    this.setState({
      dataSource: [newData, ...dataSource],
      count: count + 1,
    });
    this.props.onOk(this.state.dataSource)

  };

  render() {
    const {dataSource, data} = this.state;
    const {confData} = this.props;
    if (confData && confData.length && !data) {
      var dataMap = [];
      confData.map((item, key) => {
        dataMap.push({id: key, key: item.key, value: item.value})
      });
      this.setState({
        dataSource: dataMap,
        count: confData.length,
        data: true,
      })
    }

    const columns = this.columns;
    return (
      <div>
        <Button className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
        <Table dataSource={dataSource} columns={columns}/>
      </div>
    );
  }


}

EditableTable.propTypes = {};

export default Form.create()(EditableTable)
