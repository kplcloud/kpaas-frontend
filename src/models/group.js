import {
  grouplist,
  adminAddGroup,
  member,
  memberLike,
  adminUpdateGroup,
  adminDeleteGroup,
  adminAddProject,
  adminAddCronjob,
  adminAddMember,
  adminDelMember,
  adminDelProject,
  adminDelCronjob,
  namespaceProjectList,

  namespaceCronjobList,

  ownergrouplist,
  ownergrouplistdata,
  ownernslist,

  ownerAddGroup,
  ownerUpdateGroup,
  ownerDeleteGroup,
  ownerAddProject,
  ownerAddMember,
  ownerDelMember,
  ownerDelProject,
  ownerDelCronjob,
  ownerAddCronjob,

  groupOneData,

  groupNameExists,
  groupDisplayNameExists,

} from '../services/group';
import { message } from 'antd';
import { NamespacesList } from '../services/user';

export default {
  namespace: 'group',

  state: {
    grouplist: [],
    groupPage: {},
    modalType: false,
    memberList: [],
    ownNamespacesList: [],
    memberlike: [],
    ownergrouplist: [],
    ownergrouplistdata: [],
    groupOneData:{},
  },

  effects: {
    * grouplist({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(grouplist, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    * namespaceProjectList({ payload, ns }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(namespaceProjectList, payload, ns);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'namespaceProjectLists',
        payload: response.data,
      });
      yield put({ type: 'closeLoading' });
    },
    * namespaceCronjobList({ payload, ns }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(namespaceCronjobList, payload, ns);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'savenamespaceCronjobLists',
        payload: response.data,
      });
      yield put({ type: 'closeLoading' });
    },
    * adminAddGroup({ payload }, { call, put }) {
      // yield put({ type: 'openLoading' });
      const response = yield call(adminAddGroup, payload);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
      // yield put({
      //   type: 'save',
      //   payload: response.data,
      // });
    },
    * memberList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(member, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'members',
        payload: response.data,
      });
    },
    * ownNamespacesList({ payload }, { call, put }) {
      const response = yield call(NamespacesList);
      if (response && response.code === 0) {
        yield put({
          type: 'saveAllNamespacesList',
          payload: response.data,
        });
      }
    },
    * memberlike({ payload }, { call, put }) {
      const response = yield call(memberLike, payload);
      if (response && response.code === 0) {
        yield put({
          type: 'memberlikes',
          payload: response.data,
        });
      }
      return response.data;
    },
    * adminUpdateGroup({ payload, groupId }, { call, put }) {
      const response = yield call(adminUpdateGroup, payload, groupId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },
    * adminDeleteGroup({ payload, groupId }, { call, put }) {
      const response = yield call(adminDeleteGroup, payload, groupId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },
    * adminAddProject({ groupId,projectId}, { call, put }) {
      const response = yield call(adminAddProject, groupId,projectId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },
    * adminAddCronjob({ groupId,cronjobId }, { call, put }) {
      const response = yield call(adminAddCronjob, groupId,cronjobId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },
    * adminAddMember({ groupId,memberId }, { call, put }) {
      const response = yield call(adminAddMember, groupId,memberId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },
    * adminDelMember({ payload, groupId, memberId }, { call, put }) {
      const response = yield call(adminDelMember, payload, groupId, memberId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },
    * adminDelProject({ payload, groupId, projectId }, { call, put }) {
      const response = yield call(adminDelProject, payload, groupId, projectId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },
    * adminDelCronjob({ payload, groupId, cronjobId }, { call, put }) {
      const response = yield call(adminDelCronjob, payload, groupId, cronjobId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      // yield put({
      //   type: 'grouplist',
      // });
    },

    // 成员
    * ownergrouplist({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(ownergrouplist, payload);
      yield put({ type: 'closeLoading' });
      if (response && response.code === 0) {
        yield put({
          type: 'ownerGroupList',
          payload: response.data,
        });
      }
    },

    *ownergrouplistdata({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(ownergrouplistdata, payload);
      if (!response || response.code != 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'ownerGroupListData',
        payload: response.data,
      });
    },
    *ownernslist({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(ownernslist, payload);
      if (!response || response.code != 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'saveOwnernslist',
        payload: response.data,
      });
    },

    // 组长
    * ownerDeleteGroup({ payload, groupId }, { call, put }) {
      const response = yield call(ownerDeleteGroup, payload, groupId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },
    * ownerAddProject({ groupId,projectId }, { call, put }) {
      const response = yield call(ownerAddProject, groupId,projectId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },
    * ownerAddGroup({ payload }, { call, put }) {
      const response = yield call(ownerAddGroup, payload);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },
    * ownerUpdateGroup({ payload, groupId }, { call, put }) {
      const response = yield call(ownerUpdateGroup, payload, groupId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },
    * ownerAddMember({ groupId,memberId }, { call, put }) {
      const response = yield call(ownerAddMember, groupId,memberId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },
    * ownerAddCronjob({ groupId,cronjobId }, { call, put }) {
      const response = yield call(ownerAddCronjob, groupId,cronjobId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });

    },
    * ownerDelMember({ payload, groupId, memberId }, { call, put }) {
      const response = yield call(ownerDelMember, payload, groupId, memberId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },
    * ownerDelCronjob({ payload, groupId, cronjobId }, { call, put }) {
      const response = yield call(ownerDelCronjob, payload, groupId, cronjobId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },
    * ownerDelProject({ payload, groupId, projectId }, { call, put }) {
      const response = yield call(ownerDelProject, payload, groupId, projectId);
      if (!response || response.code !== 0) {
        message.error(response.error);
      } else {
        message.success('操作成功');
      }

      yield put({
        type: 'ownergrouplistdata',
        payload: response.data,
      });
    },

    // 单条组信息
    * grouponedata({ payload ,groupId}, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(groupOneData, payload,groupId);
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'savegrouponedata',
        payload: response.data,
      });
      return response.data;
    },

    * groupNameExists({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(groupNameExists, payload);
      if (!response) {
        return
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'groupNameExist',
        payload: response.data,
      });
      return response.data;
    },
    * groupDisplayNameExists({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(groupDisplayNameExists, payload);
      if (!response) {
        return
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'groupDisplayNameExist',
        payload: response.data,
      });
      return response.data;
    },
  },

  reducers: {
    groupNameExist(state, action) {
      return {
        ...state,
        groupNameExists:action.payload,
      };
    },
    groupDisplayNameExist(state, action) {
      return {
        ...state,
        groupNameExists:action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        grouplist: action.payload.list,
        groupPage: action.payload.page,
      };
    },
    savegrouponedata(state, action) {
      return {
        ...state,
        groupOneData:action.payload,
      };
    },
    ownerGroupList(state, action) {
      return {
        ...state,
        ownergrouplist: action.payload,
      };
    },
    ownerGroupListData(state, action) {
      return {
        ...state,
        ownergrouplistdata: action.payload,
      };
    },
    showAddGroupModeal(state) {
      return {
        ...state,
        modalType: true,
      };
    },
    closeLoading(state) {
      return {
        ...state,
        loading: false,
      };
    },
    members(state, action) {
      return {
        ...state,
        memberList: action.payload.list,
      };
    },
    saveAllNamespacesList(state, action) {
      return {
        ...state,
        ownNamespacesList: action.payload,
      };
    },
    saveOwnernslist(state, action) {
      return {
        ...state,
        ownernslist: action.payload,
      };
    },
    memberlikes(state, action) {
      return {
        ...state,
        memberlike: action.payload,
      };
    },
    namespaceProjectLists(state, action) {
      return {
        ...state,
        namespaceProjectList: action.payload,
      };
    },
    savenamespaceCronjobLists(state, action) {
      return {
        ...state,
        namespaceCronjobList: action.payload,
      };
    },
  },
};
