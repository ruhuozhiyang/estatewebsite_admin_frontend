import Vue from 'vue';
import VueRouter from 'vue-router';
import EstateForSell from '../pages/estate-manage/EstateForSell.vue';
Vue.use(VueRouter);

const routes = [
    {
        path: '/estate-buy',
        component: EstateForSell,
    },
];

const router = new VueRouter({
    routes,
});

export default router;