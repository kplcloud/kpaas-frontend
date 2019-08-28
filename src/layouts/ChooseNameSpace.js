import React, {Fragment} from 'react';
import {Icon, Select, Modal} from 'antd';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: 'https://docs.kpaas.nsini.com',
  }
];
const copyright = (
  <Fragment>
    Copyright <Icon type="copyright"/> 2019 宜人财富技术部出品
  </Fragment>
);
class ChooseNameSpace extends React.PureComponent {

  state = {visible: true}
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div>
        <Modal
          title="请选择业务空间"
          visible={this.state.visible}
          closable="false"
          onOk={this.hideModal}
          okText="确认"
          header="false"
        >
          <span style={{float:"left",marginTop:"5px"}}>请选择业务空间：</span>
          <Select placeholder="宜人财富技术创新" style={{width:"60%"}}>
            <Option value="operations">宜人财富技术创新</Option>
          </Select>
        </Modal>
      </div>
    );
  }

}


export default ChooseNameSpace;
