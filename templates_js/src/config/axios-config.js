/**
 * axios配置
 */
import axios from 'axios';
import store from '../store';
import router from '../router';
import setting from './setting';
import {Modal, message} from 'ant-design-vue';
import qs from 'qs';

// 设置统一的url
axios.defaults.baseURL = '/api';

/* 请求拦截器 */
axios.interceptors.request.use((config) => {
  // 添加token到header
  const token = setting.takeToken();
  if (token) {
    config.headers[setting.tokenHeaderName] = token;
    // 如果是get请求，就把参数拼接到url上
    if (config.method === 'get') {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'indices' });
      };
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/* 响应拦截器 */
axios.interceptors.response.use((res) => {
  // 请求成功，token自动续期
  if (res.data.code === '00000') {
    const access_token = res.headers[setting.tokenHeaderName];
    if (access_token) {
      setting.cacheToken(access_token);
    }
    return res;
  }

  // 处理响应错误，请求异常自动提示错误信息，如果是B0301就跳转到登录界面
  return processErrorResponse(res);
}, (error) => {
  // 处理响应错误
  return processErrorResponse(error.response);
});

/**
 * 跳转到登录页面
 *
 * @author fengshuonan
 * @date 2021/4/2 15:33
 */
function goLogin(reload) {
  store.dispatch('user/removeToken').then(() => {
    if (reload) {
      location.replace('/login');  // 这样跳转避免再次登录重复注册动态路由
    } else {
      const path = router.currentRoute.path;
      return router.push({
        path: '/login',
        query: path && path !== '/' ? {form: path} : null
      });
    }
  });
}

/**
 * 处理错误的响应
 *
 * @author fengshuonan
 * @date 2021/4/2 15:33
 */
function processErrorResponse(response) {
  // 如果是非B0301，则提示错误信息，如果是B0301，则跳转登录界面
  if (response.data.code !== 'B0301') {
    message.error(response.data.message);
  } else {
    if (response.config.url === setting.menuUrl) {
      goLogin();
    } else {
      Modal.destroyAll();
      Modal.info({
        title: '系统提示',
        content: '登录状态已过期, 请退出重新登录!',
        okText: '重新登录',
        onOk: () => {
          goLogin(true);
        }
      });
    }
  }
  return Promise.reject(new Error(response.data));
}
