import {isUrl} from '../utils/utils';
import {request} from 'https';
// import { getMenus } from '../services/api';

// const menuData = [
//   {
//     name: 'dashboard',
//     icon: 'dashboard',
//     path: 'dashboard',
//     children: [
//       // {
//       //   name: '分析页',
//       //   path: 'analysis',
//       // },
//       {
//         name: '工作台',
//         path: 'workplace',
//         icon: "desktop"
//         // hideInBreadcrumb: true,
//         // hideInMenu: true,
//       },
//     ],
//   },
//   {
//     name: '服务管理',
//     icon: 'database',
//     path: 'project',
//     children: [
//       {
//         name: "服务列表",
//         path: "list",
//         icon: 'cloud'
//       },
//       {
//         name: "服务发现与负载",
//         path: "discovery/services/list",
//         icon: "codepen"
//       },
//       {
//         name: "服务审核",
//         path: "audit",
//         icon: 'book'
//       }
//       , {
//         name: "定时任务",
//         path: "cornjob/list",
//         icon: 'tags-o'
//       }
//     ]
//   }, {
//     name: '配置与存储',
//     icon: 'table',
//     path: 'conf',
//     children: [{
//       icon: 'file-text',
//       name: '配置字典',
//       path: 'configMap'
//     }, {
//       icon: 'hdd',
//       name: '存储',
//       path: 'storage'
//     }]
//   }, {
//     name: '安全管理',
//     icon: 'form',
//     path: 'security',
//     children: [
//       {
//         name: "入口/API列表",
//         path: "ingress/list",
//         icon: "api"
//       }, {
//         name: "出口列表",
//         path: "egress/list",
//         icon: "fork"
//       }, {
//         name: "虚拟服务",
//         path: "virtual/service/list",
//         icon: "disconnect"
//       }, {
//         name: "出口网关",
//         path: "service/entry/list",
//         icon: "logout"
//       }, {
//         name: "大网关",
//         path: "gateway/list",
//         icon: "rocket"
//       },
//       {
//         name: '命名空间',
//         path: 'namespace',
//         icon: 'appstore-o'
//       }]
//   }, {
//     name: '模版管理',
//     icon: 'profile',
//     path: 'template/list'
//   }, {
//     name: '云市场',
//     icon: 'cloud-download-o',
//     path: 'markets'
//   }, {
//     name: '节点管理',
//     icon: 'cloud-o',
//     path: 'node',
//     children: [
//       {
//         name: "节点列表",
//         path: "list",
//         icon: 'switcher'
//       }
//     ]
//   },
//   {
//     name: "平台管理",
//     icon: "idcard",
//     path: "system",
//     children: [
//       {
//         name: "用户管理",
//         path: "member",
//         icon: "user"
//       },
//       {
//         name: "角色管理",
//         path: "role",
//         icon: "usergroup-add"
//       },
//       {
//         name: "权限管理",
//         path: "permission",
//         icon: "user-delete"
//       }
//     ]
//   },
//   {
//     name: '账户',
//     icon: 'user',
//     path: 'user',
//     children: [
//       {
//         name: '登录',
//         path: 'login',
//         authority: 'guest',
//       }
//     ]
//   },
// ];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let {path} = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

// export const getMenuData = () => formatter(menuData);
export const getMenuData = (menus) => {
  if(!menus) {
    return []
  }
  return formatter(menus)
};
