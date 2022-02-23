import Vue from 'vue';
import Root from './Root.vue';
import Antd from 'ant-design-vue/es';
import { message, Form } from 'ant-design-vue/es';
import 'ant-design-vue/dist/antd.css'
import router from './config/router.js';

Vue.use(Antd);
Vue.prototype.$message = message;
Vue.prototype.$form = Form;

new Vue({
    router,
    render: (createElements) => createElements(Root), //createElements是一个方法，调用它能将指定的组件模版渲染为html结构
}).$mount('#app');