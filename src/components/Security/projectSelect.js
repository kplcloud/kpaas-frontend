/**
 * Created by huyunting on 2018/5/30.
 */
import React, {PropTypes} from 'react'
import {Select} from 'antd';
const Option = Select.Option;
import {connect} from 'dva';


class ProjectSelect extends React.Component {

  state = {
    projectNameEn: '',
  }

  componentWillMount() {
    const {checkProject} = this.props;
    this.setState({
      projectNameEn: checkProject
    })
  }

  render() {
    const {onOk, projectList, disabledStatus} = this.props;
    const optionChange = (value, data) => {
      this.setState({projectNameEn: value})
      onOk(data.key, value)
    }
    const renderOption = () => {
      const options = [];
      if (projectList.length) {
        projectList.map((item, key) => options.push(<Option value={item.name}
                                                            key={item.id}>{item.name}</Option>))
      }
      return options
    };
    return (
      <Select
        defaultValue={this.state.projectNameEn}
        showSearch
        style={{width: 150}}
        placeholder="请选择业务空间"
        optionFilterProp="children"
        onChange={optionChange}
        disabled={disabledStatus}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {projectList && renderOption()}
      </Select>
    );
  }


}

ProjectSelect.propTypes = {};

export default connect(({ingress}) => ({}))(ProjectSelect)
