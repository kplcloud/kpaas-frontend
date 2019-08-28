import React from 'react';
import { connect } from 'dva';
import { Transfer } from 'antd';

class TransferComponent extends React.Component {
  state = {
    initNum: 0,
    mockData: [],
    targetKeys: [],
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'webhook/eventList',
    });
  }

  getData = (events, checkedEvents) => {
    if (this.state.initNum !== 0) {
      return;
    }
    this.setState({ initNum: 1 });
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < events.length; i++) {
      var target = false;
      if (checkedEvents && checkedEvents.length > 0) {
        for (let j = 0; j < checkedEvents.length; j++) {
          if (events[i].id === checkedEvents[j].id) {
            target = true;
            break;
          }
        }
      }
      const data = {
        key: events[i].id,
        title: events[i].name,
        description: events[i].description,
      };
      if (target === true) {
        targetKeys.push(events[i].id);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
    if (checkedEvents && checkedEvents.length > 0) {
      this.props.onOk(targetKeys);
    }
  };

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
    this.props.onOk(targetKeys);
  };

  render() {
    const { webhook: { events }, checkedEvents } = this.props;
    if (events && events.length > 0 && typeof (checkedEvents) !== 'undefined') {
      this.getData(events, checkedEvents);
    }

    return (
      <div>
        <Transfer
          dataSource={this.state.mockData}
          titles={['可选项', '已选项']}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={item => item.description ? item.title + '-' + item.description : item.title}
        />
      </div>
    );
  }
}

export default connect(({ webhook }) => ({
  webhook,
}))(TransferComponent);
