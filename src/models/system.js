/**
 * Created by huyunting on 2018/5/17.
 */
import {
  member,
  addMember,
  oneMember,
  role,
  addRole,
  oneRole,
  updateRole,
  updateMember,
  permissions,
  dragPermission,
  updatePermission,
  deletePermission,
  selectedPerm,
  changeRolePerm,
} from '../services/system';
import { message } from 'antd';
export default {
  namespace: 'system',

  state: {
    memberList: [],
    memberPage: {},
    roleList: [],
    oneRole: [],
    oneMember: [],
    loading: false,
    btnLoading: false,
    roleModalVisible: false,
    memberModalVisible: false,
    modalType: false,
    permissions: [],
    visible: false,
    record: null,
    selectedPerms: [],
  },

  effects: {
    *changeRolePerm({ payload }, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: {
          visible: false,
          record: null,
          selectedPerms: [],
        },
      });
      yield put({ type: 'openLoading' });
      const response = yield call(changeRolePerm, payload);
      if (!response || response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'closeLoading' });
      message.success('操作成功〜');
    },
    *selectedPerm({ payload }, { call, put }) {
      // yield put({
      //   type: 'saveSelected',
      //   payload: [],
      // });
      const response = yield call(selectedPerm, payload);
      if (!response || response.code != 0) {
        message.error(response.error);
        return;
      }

      var ids = [];
      for (var i in response.data) {
        ids.push(response.data[i].toString());
      }

      yield put({
        type: 'saveSelected',
        payload: ids,
      });
    },
    *deletePermission({ payload }, { call, put }) {
      const response = yield call(deletePermission, payload);
      if (!response || response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'savePermissions',
        payload: response.data,
      });
      message.success('操作成功〜');
    },
    *updatePermission({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(updatePermission, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        return;
      }
      yield put({
        type: 'savePermissions',
        payload: response.data,
      });
      yield put({ type: 'closeLoading' });
      message.success('操作成功〜');
    },
    *dragPermission({ payload }, { call, put }) {
      // yield put({type: "openLoading"})
      const response = yield call(dragPermission, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        return;
      }
      yield put({
        type: 'savePermissions',
        payload: response.data,
      });
      message.success('操作成功~');
    },
    *permissions({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(permissions, payload);
      if (!response || response.code != 0) {
        message.error('获取信息失败，请等技术冷却后再试~' + response.error);
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'savePermissions',
        payload: response.data,
      });
    },
    *memberlist({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(member, payload);
      if (!response || response.code != 0) {
        message.error('获取信息失败，请等技术冷却后再试~' + response.error);
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *rolelist({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(role, payload);
      if (!response || response.code != 0) {
        message.error('获取信息失败，请等技术冷却后再试~' + response.error);
        return;
      }
      yield put({ type: 'closeLoading' });

      yield put({
        type: 'saveRole',
        payload: response.data,
      });
    },
    *createRole({ payload }, { call, put }) {
      yield put({ type: 'openbtnLoading' });
      const response = yield call(addRole, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        yield put({ type: 'hideModal' });
        return;
      }
      message.success('角色添加成功~');
      yield put({ type: 'hideModal' });
      yield put({
        type: 'rolelist',
      });
    },
    *updateRole({ payload }, { call, put }) {
      yield put({ type: 'openbtnLoading' });
      const response = yield call(updateRole, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        yield put({ type: 'hideModal' });
        return;
      }
      message.success('角色更新成功~');
      yield put({ type: 'hideModal' });
      yield put({
        type: 'rolelist',
      });
    },
    *oneRole({ payload }, { call, put }) {
      const response = yield call(oneRole, payload);
      if (!response || response.code != 0) {
        message.error('信息获取失败，请等技术冷却后再试~' + response.error);
        return;
      }
      yield put({
        type: 'saveOneRole',
        payload: response.data,
      });
    },

    *createMember({ payload }, { call, put }) {
      yield put({ type: 'openbtnLoading' });
      const response = yield call(addMember, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        yield put({ type: 'hideModal' });
        return;
      }
      message.success('添加成功~');
      yield put({ type: 'hideModal' });
      yield put({
        type: 'memberlist',
      });
    },
    *oneMember({ payload }, { call, put }) {
      const response = yield call(oneMember, payload);
      if (!response || response.code != 0) {
        message.error('信息获取失败，请等技术冷却后再试~' + response.error);
        return;
      }
      yield put({
        type: 'saveOneMember',
        payload: response.data,
      });
    },
    *updateMember({ payload }, { call, put }) {
      yield put({ type: 'openbtnLoading' });
      const response = yield call(updateMember, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        yield put({ type: 'hideModal' });
        return;
      }
      message.success('更新成功~');
      yield put({ type: 'hideModal' });
      yield put({
        type: 'memberlist',
      });
    },
  },

  reducers: {
    saveSelected(state, action) {
      return { ...state, selectedPerms: action.payload };
    },
    changeVisible(state, action) {
      return { ...state, ...action.payload };
    },
    savePermissions(state, action) {
      const data = action.payload;
      var options = function(val) {
        var perms = [];
        data.map((item, key) => {
          if (item.parent_id == val.id) {
            perms.push({
              key: item.id,
              name: item.name,
              path: item.path,
              menu: item.menu,
              method: item.method,
              children: options(item),
              icon: item.icon,
            });
          }
        });
        return perms;
      };
      var perms = [];
      data.map((item, key) => {
        if (item.menu && item.parent_id == 0) {
          item.key = item.id;
          item.children = options(item);
          perms.push(item);
        }
      });
      return {
        ...state,
        permissions: perms,
      };
    },
    save(state, action) {
      return {
        ...state,
        memberList: action.payload.list,
        memberPage: action.payload.page,
      };
    },
    saveOneRole(state, action) {
      return {
        ...state,
        oneRole: action.payload,
      };
    },
    saveOneMember(state, action) {
      return {
        ...state,
        oneMember: action.payload,
      };
    },
    saveRole(state, action) {
      return {
        ...state,
        roleList: action.payload,
      };
    },
    openbtnLoading(state) {
      return {
        ...state,
        btnLoading: true,
      };
    },
    closebtnLoading(state) {
      return {
        ...state,
        btnLoading: false,
      };
    },
    openLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
    closeLoading(state) {
      return {
        ...state,
        loading: false,
      };
    },
    showAddRoleModeal(state) {
      return {
        ...state,
        modalType: true,
        roleModalVisible: true,
      };
    },
    showRoleModal(state) {
      return {
        ...state,
        modalType: false,
        roleModalVisible: true,
      };
    },
    showMemberModal(state) {
      return {
        ...state,
        memberModalVisible: true,
      };
    },
    hideModal(state, action) {
      return {
        ...state,
        roleModalVisible: false,
        memberModalVisible: false,
        btnLoading: false,
        modalType: 'add',
      };
    },
  },
};
