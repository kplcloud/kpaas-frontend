import {
  query as queryUsers,
  queryCurrent,
  queryNamespaces,
  NamespacesList,
  ChoiceNamespace,
  fetchMenu,
} from '../services/user';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { userLogout } from '../services/project';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    namespaces: [],
    hasChoiceNs: true,
    allNamespacesList: [],
    auditRole: false, //是否有审批权限
    menus: [],
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetchMenu(_, { call, put }) {
      const response = yield call(fetchMenu);
      if (response && response.code == 0) {
        yield put({
          type: 'saveMenu',
          payload: {
            menus: response.data,
          },
        });
      }
    },
    * choiceNamespace({ payload }, { call, put }) {
      const response = yield call(ChoiceNamespace, payload);
      if (response && response.code == 0) {
        message.success('操作成功~');
        Cookie.set('namespace', payload.namespace);
        yield put({
          type: 'saveHasChoiceNs',
          payload: response.data,
        });
        yield call(userLogout, payload);
      } else {
        message.error(response.error);
      }
    },
    * fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
        Cookie.set('namespaces', response.data.namespaces.join(','));
        var auditRole = false;
        for (var key in response.data.roles) {
          const roles = response.data.roles;
          if (roles[key].level <= 300) {
            auditRole = true;
          }
        }
        Cookie.set('auditRole', auditRole);
      }
    },
    * fetchNamespaces({ payload }, { call, put }) {
      const response = yield call(queryNamespaces);
      if (response && response.code == 0) {
        yield put({
          type: 'saveNamespaces',
          payload: response.data,
        });
      }
    },
    * namespacesList({ payload }, { call, put }) {
      const response = yield call(NamespacesList);
      if (response && response.code == 0) {
        yield put({
          type: 'saveAllNamespacesList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveMenu(state, action) {
      const { menus } = action.payload;
      var options = function(val) {
        var perms = [];
        menus.map((item, key) => {
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
      menus.map((item, key) => {
        if (item.menu && item.parent_id == 0) {
          item.key = item.id;
          item.children = options(item);
          perms.push(item);
        }
      });
      return { ...state, menus: perms };
    },
    saveHasChoiceNs(state, action) {
      window.location.reload();
      return {
        ...state,
        hasChoiceNs: true,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveAllNamespacesList(state, action) {
      return {
        ...state,
        allNamespacesList: action.payload,
      };
    },
    saveNamespaces(state, action) {
      return {
        ...state,
        namespaces: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      var hasNs = false;
      var response = action.payload;
      for (var key in response.namespaces) {
        // hasChoseNs
        if (response.namespaces[key] == 'default') {
          continue;
        }
        hasNs = true;
      }
      return {
        ...state,
        currentUser: action.payload,
        hasChoiceNs: hasNs,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
