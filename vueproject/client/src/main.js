import Vue from 'vue'
import App from './App.vue'
import iView from "iview";  //引入 ivew 框架
import 'iview/dist/styles/iview.css';  //引入 ivew.css样式

import VueRouter from "vue-router"; // 引入路由
import {routes} from "./routes/index.js"; // 引入路由参数对象,为什么加 { } 呢？

import axios from "axios";        //引入 axios
import VueAxios from "vue-axios"; //引入 vue-axios

import {store} from "./store";

Vue.use(iView);           //使用 iView UI
Vue.use(VueAxios, axios); //使用 axios 以及 vue-axios，后者是对axios进行便捷操作,自动拥有很多方法

//详情 见 官网  https://github.com/imcvampire/vue-axios
//  this.axios.get(api).then((response) => {
//        console.log(response.data)
//  })
//  this.$http.get(api).then((response) => {
//        console.log(response.data)
//  })

Vue.use(VueRouter);

const router = new VueRouter({
	  mode: 'history',
		routes:routes
});


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
