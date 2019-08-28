import React, {PropTypes} from 'react'
import {Card} from 'antd';

class CardGridDetail extends React.Component {
  render() {
    const {title, content, width, detailkey, textAligin} = this.props;
    return <Card.Grid key={detailkey ? detailkey : "detail11"}
                      style={{width: (width ? width : "50%"), textAlign: (textAligin ? textAligin : "left")}}>
      <span style={{marginRight: 10}}>{title}:</span>
      <b>{content}</b>
    </Card.Grid>;
  }
}

CardGridDetail.propTypes = {};
export default CardGridDetail
