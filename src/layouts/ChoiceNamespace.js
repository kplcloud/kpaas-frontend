import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;

class ChoiceNamespace extends React.PureComponent {
  state = {
    namespace: "",
    visible: true
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'user/namespacesList',
    });
  }

  handleChange = (val) => {
    this.setState({
        namespace: val
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.dispatch({
        type: 'user/choiceNamespace',
        payload: {
            "namespace": this.state.namespace
        }
    });
    this.setState({visible: false});
  }
  
  render() {
    const {
        namespaces
    } = this.props;

    return (
        <Modal
            visible={this.state.visible}
            closable={false}
            title="请选择业务空间"
            onOk={this.handleOk}
            // onCancel={() => console.log("121123123122")}
            footer={[
            <Button key="submit" type="primary" loading={false} onClick={this.handleOk}>
                确认
            </Button>
            ]}
            bodyStyle={{textAlign: "center"}}
        >
            <Select defaultValue="default" style={{ width: 220 }} onChange={this.handleChange}>
                {namespaces && namespaces.map((item, key) => <Option value={item.name_en} key={item.name_en}>{item.name}</Option>)}
            </Select>
        </Modal>
    );
  }
}

export default connect(({ user}) => ({
  namespaces: user.allNamespacesList,
}))(ChoiceNamespace);
