import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    plugins: [
      createPersistedState()
    ],
    state: {
        user: null,
        logged: false
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.logged = !!(token);
        }
    },
    actions: {
        setUser({commit}, user) {
            commit('setUser', user);
        }
    }
});