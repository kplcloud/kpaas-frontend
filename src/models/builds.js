import { message } from 'antd';
import {loadBuilds, rollback} from '../services/builds'
export default {
    namespace: 'builds',

    state: {
        list: [],
        loading: false,
        pagination: {}
    },

    effects: {
        *rollback({payload}, {call, put}) {
            const response = yield call(rollback, payload);
            if (!response) {
                return
              }
            if (response.code != 0) {
                message.error(response.error);
                return;
            }
            message.info("操作成功~ 正在回滚...")
            setTimeout(function () {
                location.reload();
            }, 1000);
        },
        *loadBuilds({payload}, {call, put}){
            yield put({ type: 'save', payload: {loading: true} });
            const response = yield call(loadBuilds, payload);
            if (!response) {
                return
              }
            if (response.code != 0) {
                message.error(response.error);
                return;
            }
            yield put({
                type: 'save',
                payload: {
                    list: response.data.list,
                    loading: false,
                    pagination: {
                        total: response.data.page.total
                    }
                },
            });
        }
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload};
        }
    },
};
