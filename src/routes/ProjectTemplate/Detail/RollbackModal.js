import React, {PureComponent, Fragment} from 'react';
import { Modal, Table, Tag, Card } from 'antd';
import {connect} from 'dva';

const color = [];
color["FAILURE"] = "#f50"
color["SUCCESS"] = "#87d068"
color["BUILDING"] = "#108ee9"
color["ROLLBACK"] = "purple"

var logs = [];

class BuildConsole extends PureComponent {
    // componentDidMount(){
    //     const {record, project, dispatch} = this.props;
    //     dispatch({
    //         type: "jenkins/buildLogs",
    //         payload: {
    //           name: project.name,
    //           number: record.build_id
    //         }
    //     });
    // }
    render(){
        const {jenkins, record} = this.props
        const {buildLogs} = jenkins;
        let loading = true;
        if (buildLogs) {
            loading = false
        }
        return (<Card
            width={700}
            bordered={false}
            bodyStyle={{padding:0, margin:0, maxHeight: 300, maxWidth: (window.document.body.clientWidth * 0.6), overflow: "scroll"}}
            loading={loading}
        >
            <pre>
            {record.output}
            </pre>
        </Card>)
    }
}

class RollbackModal extends PureComponent {

    state = {
        pagination: {},
    };
    
    buildConsole = (record, index, indent, expanded) => {
        if (expanded == false) {
            return
        }
        const {data, dispatch, jenkins} = this.props;
        const {project} = data.auditList;
        return <BuildConsole record={record} dispatch={dispatch} project={project} jenkins={jenkins}  />
    };

    onRollback = (e, record) => {
        e.preventDefault();
        console.log(e, record)
        const {dispatch} = this.props;
        Modal.confirm({
            title: '请确认',
            content: <span>您确定要回滚到 <Tag color="volcano">{record.version}</Tag> 这个版本？</span>,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                dispatch({
                    type: "builds/rollback",
                    payload: {
                        name: record.name,
                        namespace: record.namespace,
                        id: record.id,
                        version: record.version,
                    }
                });
            }
        });
    };

    handleTableChange = (pagination, filters, sorter) => {
        const {builds} = this.props;
        const pager = { ...builds.pagination };
        pager.current = pagination.current;

        const {dispatch, data} = this.props;
        const {project} = data.auditList;
        dispatch({
            type: "builds/loadBuilds",
            payload: {
                name: project.name,
                namespace: project.namespace,
                results: pagination.pageSize,
                page: pagination.current,
                // sortField: sorter.field,
                // sortOrder: sorter.order,
                ...filters,
            }
        });
        dispatch({
            type: "builds/save",
            payload: {
                pagination: pager
            }
        });
      }

    render() {
        const columns = [
            { title: '名称', dataIndex: 'name', key: 'name' },
            { title: '版本', dataIndex: 'version', key: 'version', render: (text) => {
                return <Tag>{text}</Tag>
            } },
            { title: '分支', dataIndex: 'git_type', key: 'git_type' },
            { title: '发布状态', dataIndex: 'status', key: 'status', render: (text) => {
               return <Tag color={color[text]}>{text}</Tag>
            } },
            { title: '发布时间', dataIndex: 'created_at', key: 'created_at' },
            { title: '发布人', dataIndex: 'member', key: 'member', render: (text) => {
                return text.username;
            } },
            { title: '操作', key: 'operation', render: (record, index) => {
                return <a href="javascript:;" onClick={(e) => this.onRollback(e, record)}>回滚</a>
            } },
        ];

        const {visible, onClose, builds} = this.props;
        if (!visible) {
            return ('')
        }
        const {pagination} = builds;
        return (
            <Modal
                visible={visible}
                title="版本回滚"
                width="70%"
                bodyStyle={{paddingLeft:10, paddingRight:10, paddingTop:10, paddingBottom:0}}
                onCancel={onClose}
                footer={false}
                destroyOnClose={true}
            >
                <Table 
                    // bordered
                    // size="small"
                    rowKey="id"
                    // scroll={true}
                    columns={columns}
                    dataSource={builds.list}
                    expandRowByClick={true}
                    expandedRowRender={this.buildConsole}
                    pagination={pagination}
                    onChange={this.handleTableChange}
                />
                
            </Modal>
        );
    }
}

export default connect(({builds, jenkins}) => ({
    builds,
    jenkins
  }))(RollbackModal);