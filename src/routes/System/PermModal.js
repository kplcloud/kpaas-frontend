import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Tree } from 'antd';

const TreeNode = Tree.TreeNode;
@Form.create()
class PermModal extends PureComponent {
  state = {
    selectedKeys: [],
  };

  render() {
    const {
      visible,
      onCancel,
      loading,
      selectedPerms,
      permissions,
      onSelect,
      onCheck,
      handleSubmit,
    } = this.props;

    // const {permissions} = system;
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode
              data-key={item.key}
              data-item={item}
              data-title={item.name}
              key={item.key.toString()}
              title={`${item.name} - ${item.path} - ${item.method}`}
            >
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            data-key={item.key}
            data-item={item}
            data-title={item.name}
            key={item.key.toString()}
            title={`${item.name} - ${item.path} - ${item.method}`}
            onDragEnter={this.selectable}
          />
        );
      });
    return (
      <Modal
        visible={visible}
        title={`配置权限`}
        okText={`提交`}
        onCancel={onCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
        style={{ top: 30 }}
        width={720}
      >
        <Tree
          checkable
          showLine
          className="draggable-tree"
          // expandedKeys={selectedPerms}
          checkedKeys={selectedPerms}
          onSelect={onSelect}
          onCheck={onCheck}
          selectedKeys={this.state.selectedKeys}
          // draggable
          // onDragEnter={this.onDragEnter}
          // onDrop={this.onDrop}
          autoExpandParent
          // onRightClick={this.onRightClick}
        >
          {loop(permissions)}
        </Tree>
      </Modal>
    );
  }
}
export default connect(({ system }) => ({
  system: system,
}))(PermModal);
