/**
 * Created by huyunting on 2018/5/30.
 */
import React, { PropTypes } from 'react';
import { Select } from 'antd';

const Option = Select.Option;
import { connect } from 'dva';
import Cookie from 'js-cookie';

class NamespaceSelect extends React.Component {

  state = {
    defaultNamespace: '',
  };

  componentWillMount() {
    const { defaultNamespace } = this.props;
    var namespace = Cookie.get('namespace');
    if (defaultNamespace !== '' && typeof (defaultNamespace) !== 'undefined') {
      namespace = defaultNamespace;
    }
    this.setState({ defaultNamespace: namespace });
    this.props.dispatch({
      type: 'user/fetchNamespaces',
    });
    if (namespace) {
      this.props.onOk(namespace);
    }

  }

  render() {
    const { onOk, namespaces, disabledStatus } = this.props;
    const optionChange = (value) => {
      this.setState({ 'defaultNamespace': value });
      Cookie.set('namespace', value);
      onOk(value);
    };
    const renderOption = () => {
      const options = [];
      if (namespaces.length) {
        namespaces.map((item, key) => options.push(<Option value={item.name}
                                                           key={key}>{item.display_name}</Option>));
      }
      return options;
    };
    return (
      <Select
        defaultValue={this.state.defaultNamespace}
        showSearch
        style={{ width: 150 }}
        placeholder="请选择业务空间"
        optionFilterProp="children"
        onChange={optionChange}
        disabled={disabledStatus}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {namespaces && renderOption()}
      </Select>
    );
  }


}

NamespaceSelect.propTypes = {};

export default connect(({ user }) => ({
  namespaces: user.namespaces,
}))(NamespaceSelect);
