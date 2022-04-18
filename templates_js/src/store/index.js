/**
 * vuex状态管理
 */
import {createStore} from 'vuex';
import getters from './getters';
import user from './modules/user';
import theme from './modules/theme';
import notice from './modules/notice';
import system from './modules/system';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    theme,
    notice,
    system
  },
  getters
});
