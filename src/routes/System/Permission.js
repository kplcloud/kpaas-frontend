import React, {PureComponent} from 'react';
// import moment from 'moment';
import {connect} from 'dva';
import {Card, Tree, Icon, Tag, Menu, Modal} from 'antd';
import styles from '../ProjectTemplate/BasicList.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddPerm from './AddPerm'
import { interval } from 'rxjs';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm
class Permission extends PureComponent {

  state = {
    expandedKeys: [],
    rightClickNodeTreeItem: null,
    visible: false,
    keyType: "1",
    item: null
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'system/permissions',
    });
  }

  onDragEnter = (info) => {
    console.log("onDragEnter", info);
  };

  onDrop = (info) => {
    console.log("onDrop", info)
    const {dispatch, permissions} = this.props;
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...permissions];
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    dispatch({
      type: 'system/dragPermission',
      payload: {
        "drag_key": parseInt(dragKey),
        "drop_key": parseInt(dropKey)
      }
    });
  };

  onRightClick = (e) => {
    this.setState({
      rightClickNodeTreeItem: {
        pageX: e.event.pageX,
        pageY: e.event.pageY,
        key: e.node.props["data-key"],
        title: e.node.props["data-title"],
        item: e.node.props["data-item"]
      }
    });
  };

  handleMenuClick = (e) => {
    const {dispatch} = this.props;
    const {item} = {...this.state.rightClickNodeTreeItem};
    if (e.key == "3") {
      confirm({
        title: '请确认删除该路由?',
        content: '路由地址: ' + item.path,
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 300);
            dispatch({
              type: 'system/deletePermission',
              payload: item,
            });
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {
        },
      });
      this.setState({
        rightClickNodeTreeItem: null,
        visible: false
      })
      return
    }

    this.setState({
      rightClickNodeTreeItem: null,
      visible: true,
      item: item,
      keyType: e.key
    })
  };

  getNodeTreeRightClickMenu() {
    const {pageX, pageY} = {...this.state.rightClickNodeTreeItem};
    const tmpStyle = {
      position: 'absolute',
      left: `${pageX - 280}px`,
      top: `${pageY - 140}px`
    };
    const menu = (
      <Menu
        onClick={this.handleMenuClick}
        style={tmpStyle}
        // className={style.categs_tree_rightmenu}
      >
        <Menu.Item key='1'><Icon type='plus-circle'/>{'加同级'}</Menu.Item>
        <Menu.Item key='2'><Icon type='plus-circle-o'/>{'加下级'}</Menu.Item>
        <Menu.Item key='4'><Icon type='edit'/>{'修改'}</Menu.Item>
        <Menu.Item key='3'><Icon type='minus-circle-o'/>{'删除目录'}</Menu.Item>
      </Menu>
    );
    return (this.state.rightClickNodeTreeItem == null) ? '' : menu;
  };

  onSubmit = (keyType, values) => {
    const {dispatch, loading} = this.props;
    dispatch({
      type: 'system/updatePermission',
      payload: {
        keyType: keyType,
        ...values
      }
    })
    this.setState({
      visible: false
    });
  };

  render() {
    const {permissions, loading} = this.props;
    const {visible, item, keyType} = this.state;
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode data-key={item.key} data-item={item} data-title={item.name} key={item.key}
                         title={`${item.name} - ${item.path} - ${item.method}`}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode data-key={item.key} data-item={item} data-title={item.name} key={item.key}
                       title={`${item.name} - ${item.path} - ${item.method}`} onDragEnter={this.selectable}/>;
    });
    const self = this;
    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <AddPerm {...{
            visible: visible,
            onCancel: function () {
              self.setState({visible: false})
            },
            keyType: keyType,
            item: item,
            onCreate: self.onSubmit,
            loading: loading
          }} />
          <Card
            bordered={false}
            title="权限列表"
            style={{marginTop: 16}}
            // extra={extraContent}
          >
            <Tree
              showLine
              className="draggable-tree"
              defaultExpandedKeys={this.state.expandedKeys}
              draggable
              onDragEnter={this.onDragEnter}
              onDrop={this.onDrop}
              autoExpandParent
              onRightClick={this.onRightClick}
            >
              {loop(permissions)}
            </Tree>
            {this.getNodeTreeRightClickMenu()}
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
export default connect(({system}) => ({
  permissions: system.permissions,
  visible: system.visible,
  loading: system.loading
}))(Permission);
