/**
 * Created by huyunting on 2018/6/4.
 */
import request from '../utils/request';

export async function list() {
  return request('/nodes', {
    method: 'GET'
  });
};