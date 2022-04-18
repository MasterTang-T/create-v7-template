export default {
  namespace: true,
  state: {
    name: 'tom'
  },
  mutations: {
    SET_NAME(state, payload) {
      state.name = payload;
    }
  },
  actions: {
    setName({ commit }, payload) {
      commit('SET_NAME', payload);
    }
  },
  getters: {
    myName: state => {
      return state.name;
    }
  }
};
