/**
 * 存放系统级别的store
 */
export default {
  namespaced: true,
  state: {
    // 当前系统是否已经初始化过配置
    alreadyInitConfig: null
  },
  mutations: {
    /**
     * 更新初始化状态
     *
     * @param state vuex状态
     * @param {Boolean} initFlag 是否初始化了系统
     * @author fengshuonan
     * @date 2021/6/12 19:20
     */
    updateInitFlag(state, initFlag) {
      state.alreadyInitConfig = initFlag;
    }
  },
  actions: {
    /**
     * 更新初始化状态
     *
     * @param state vuex状态
     * @param {Boolean} initFlag 是否初始化了系统
     * @author fengshuonan
     * @date 2021/6/12 19:20
     */
    updateInitFlag({ commit }, initFlag) {
      commit('updateInitFlag', initFlag);
    }
  },
  getters: {
    /**
     * 获取是否初始化了配置
     *
     * @author fengshuonan
     * @date 2021/7/9 17:06
     */
    alreadyInitConfig: state => {
      return state.alreadyInitConfig;
    }
  }
};
