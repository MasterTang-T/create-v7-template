/**
 * 存放当前用户未读消息
 */
export default {
  namespaced: true,
  state: {
    // 用户未读消息列表
    unReadNoticeList: []
  },
  mutations: {
    /**
     * 添加未读的系统消息
     *
     * @author fengshuonan
     * @date 2021/6/12 19:20
     */
    addNotice(state, notice) {
      state.unReadNoticeList.push(notice);
    },

    /**
     * 设置未读消息
     *
     * @param state vuex状态
     * @param {Array} noticeList 消息列表
     * @author fengshuonan
     * @date 2021/6/12 19:20
     */
    setNotice(state, noticeList) {
      state.unReadNoticeList = noticeList;
    },

    /**
     * 删除消息
     *
     * @author fengshuonan
     * @date 2021/6/12 19:20
     */
    removeMessage(state, messageId) {
      state.unReadNoticeList.splice(
        state.unReadNoticeList.findIndex(item => item.messageId === messageId),
        1
      );
    }
  },
  actions: {
    /**
     * 添加未读系统消息
     *
     * @author fengshuonan
     * @date 2021/6/12 19:37
     */
    addNotice({ commit }, notice) {
      commit('addNotice', notice);
    },

    /**
     * 设置未读消息
     *
     * @param state vuex状态
     * @param {Array} noticeList 消息列表
     * @author fengshuonan
     * @date 2021/6/12 19:20
     */
    setNotice({ commit }, noticeList) {
      commit('setNotice', noticeList);
    },

    /**
     * 删除消息
     *
     * @author fengshuonan
     * @date 2021/6/12 19:20
     */
    removeMessage({ commit }, messageId) {
      commit('removeMessage', messageId);
    }
  },
  getters: {
    /**
     * 获取当前未读消息列表
     *
     * @author fengshuonan
     * @date 2021/6/12 19:47
     */
    messageList: state => {
      return state.unReadNoticeList;
    }
  }
};
