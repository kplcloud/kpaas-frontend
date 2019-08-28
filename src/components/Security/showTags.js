/**
 * Created by huyunting on 2018/7/5.
 */
import React, {PropTypes} from 'react'
import {Tag} from 'antd';

class ShowTags extends React.Component {

  render() {
    const {color, content} = this.props;
    const items = [];
    if (typeof (content) == "string") {
      items.push(<Tag key="1" color={color ? color : ""}>{content}</Tag>)
    } else if (typeof (content) == "object") {
      content.map((item, key) => {
        items.push(<Tag key={key} color={color ? color : ""}>{item}</Tag>);
      })
    }
    return <div>{items}</div>;
  }
}

ShowTags.propTypes = {};
export default ShowTags
