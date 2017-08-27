import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);


export const store = new Vuex.Store({
    actions: {
        setAuthor({ commit }, payload) {
            commit("setAuthor", payload);
        },
        setLoginState({ commit }, payload) {
            commit("setLoginState", payload);
        },
    },
    mutations: {
        setAuthor(state, payload) {
            state.author = payload;
        },
        setLoginState(state, payload) {
            state.loginState = payload;
        }
    },
    state: {
        author: "",
        loginState: false
    },
    getters: {
        getAuthor(state) {
            return state.author;
        },
        getLoginState(state) {
            return state.loginState;
        },
    }
})