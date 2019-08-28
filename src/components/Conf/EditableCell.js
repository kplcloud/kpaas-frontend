import React, {PropTypes} from 'react'
import {Card, Form, Input, Icon, Modal, Button, Popconfirm} from 'antd';
const { TextArea } = Input;

class EditableCell extends React.Component {

  state = {
    value: this.props.value,
    editable: false,
    visible: false,
    content: "",
  }
  handleOk = () => {
    this.setState({visible: false})
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({value});
  }
  check = () => {
    this.setState({editable: false});
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({editable: true});
  }

  render() {
    const {value, editable} = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <TextArea
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              <div
                style={{float: "left", width: "120px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                onClick={() => {
                  this.setState({visible: true, content: value})
                }}>{value || ' '}</div>
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
        <Modal
          visible={this.state.visible}
          title={"Value"}
          width={500}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button key="back" type="primary" onClick={this.handleOk}>OK</Button>,
          ]}
        >
          <Card style={{background: '#EFEFEF', overflow: 'auto', height: '400px'}}>
            <pre className="language-bash">
                {this.state.content}
            </pre>
          </Card>
        </Modal>

      </div>
    );
  }


}

EditableCell.propTypes = {};

export default Form.create()(EditableCell)
