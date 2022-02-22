import Vue from 'vue';
import VueRouter from 'vue-router';
import EstateForSell from '../pages/estate-manage/EstateForSell.vue';
import LocForSearch from '../pages/loc-manage/LocForSearch.vue';
import UserComments from '../pages/user-comments/UserComments.vue';
import Agents from '../pages/agents/Agents.vue';

const includPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return includPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter);

const routes = [
	{
		path: '/estate',
		component: EstateForSell,
	},
	{
		path: '/loc-manage',
		component: LocForSearch,
	},
	{
		path: '/user-comment',
		component: UserComments,
	},
	{
		path: '/agents',
		component: Agents,
	},
];

const router = new VueRouter({
    routes,
});

export default router;