import {routerRedux} from 'dva/router';
import {setAuthority} from '../utils/authority';
import {reloadAuthorized} from '../utils/Authorized';
import {userlogin, userLogout, getLoginType} from '../services/project';
import Cookie from "js-cookie"
import {message} from  "antd"

export default {
  namespace: 'login',

  state: {
    status: undefined,
    loginType: ""
  },

  effects: {
    *getLoginType({payload}, {call, put}) {
      // auth/login/type
      const response = yield call(getLoginType, payload);
      if (!response || response.code != 0) {
        message.error(response.error);
        return
      }
      yield put({
        type: 'saveLoginType',
        payload: response.data
      })
    },
    *login({payload}, {call, put}) {
      const response = yield call(userlogin, payload);
      const responseData = {
        currentAuthority: "admin",
        status: "error",
        type: "account",
        message: "",
      }
      if (response && response.code == 0) {
        responseData.status = "success"
        yield put({
          type: 'changeLoginStatus',
          payload: responseData,
        });
        // Cookie.set("kplSessionId",response.data.sessInfo)
        // Cookie.set("email",response.data.email)
        Cookie.set("namespace", response.data.namespaces[0]);
        Cookie.set("username", response.data.username);
        Cookie.set("email", response.data.email);
        //Cookie.set("Authorization", response.data.token);
        Cookie.set("authorization", response.data.token);
        reloadAuthorized();
        yield put(routerRedux.push('/'));

      } else {
        responseData.message = response.error;
        yield put({
          type: 'changeLoginStatus',
          payload: responseData,
        });
      }

    },
    *logout(payload, {put, select, call}) {
      //yield call(userLogout, payload);
      Cookie.set("username", "");
      Cookie.set("email", "");
      Cookie.set("authorization", "");
      console.log("logout......")
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }

      window.location.reload();
    }
  },

  reducers: {
    changeLoginStatus(state, {payload}) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        message: payload.message
      };
    },
    saveLoginType(state, {payload}) {
      return {
        ...state,
        loginType: payload
      }
    }
  },
};
