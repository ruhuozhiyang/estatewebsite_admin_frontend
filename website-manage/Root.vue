<template>
    <div>
        <a-layout :style="{ height: '800px' }">
						<a-layout-sider v-model="collapsed" collapsible>
							<div class="logo" />
							<a-menu theme="dark" mode="inline" :selectedKeys="[currentMenu]" @click="linkTo">
								<a-menu-item v-for="item in menuData" :key="item.url">
									<a-icon :type="item.icon" />
									<span class="nav-text">{{item.item}}</span>
								</a-menu-item>
							</a-menu>
						</a-layout-sider>
            <a-layout>
                <a-layout-header :style="{ background: '#fff', padding: 0 }">
                    <a-menu
											theme="light"
											mode="horizontal"
											@click="childLinkTo"
											:style="{
													lineHeight: '64px',
													width: '75%',
													float: 'left',
													border: 'none',
											}"
											:selectedKeys="[current]"
                    >
                        <a-menu-item v-for="item in childMenuData[currentMenu]" :key="item.url">
                            <a-icon :type="item.icon" />
                            <span class="nav-text">{{item.item}}</span>
                        </a-menu-item>
                    </a-menu>
                    <span :style="{float:'right',marginRight:'50px'}">
                        <a-avatar :style="{backgroundColor:'#108ee9',marginRight:'10px'}" icon="user" />
                        <a-dropdown>
                            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                admin
                                <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                            <a-menu-item>
                                <a-icon type="idcard" />
                                <span class="nav-text">用户信息</span>
                            </a-menu-item>
                            <a-menu-item>
                                <a-icon type="logout" />
                                <span class="nav-text">注销登录</span>
                            </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </a-layout-header>
                <a-layout-content :style="{ backgroundColor: 'white', margin: '20px 0 0 0', overflow: 'initial' }">
                    <router-view />
                </a-layout-content>
                <a-layout-footer :style="{ textAlign: 'center' }">Byj Estate ©2021</a-layout-footer>
            </a-layout>
        </a-layout>
    </div>
</template>
<script>
export default {
    name: 'Root',
    data() {
			return {
				childMenuData: {
					'/estate-buy': [
						{item: '出售房源', icon: 'home', url: '/estate-buy'},
						{item: '出租房源', icon: 'home', url: '/estate-rent'},
					],
					'/loc-manage': [
						{item: '地点管理', icon: 'home', url: '/loc-manage'},
					]
				},
				menuData: [
					{
						url: '/estate-buy',
						item: '房源管理',
						icon: 'setting',
					},
					{
						url: '/loc-manage',
						item: '地点管理',
						icon: 'setting',
					},
				],
				collapsed: false,
				currentMenu: '/loc-manage',
				current: '/loc-manage',
			};
    },
    mounted() {
			this.$router.push(this.current);
    },
    methods: {
			childLinkTo(item) {
				if (this.$route.path !== item.key) {
					this.$router.push(item.key);
					this.current = item.key;
				}
			},
			linkTo(item) {
				if (item.key !== this.currentMenu) {
					this.$router.push(item.key);
					this.currentMenu = item.key;
					this.current = item.key;
				}
			},
    },
}
</script>
<style scoped>
.logo {
  height: 32px;
  background: url("img/logo-2.svg") no-repeat center;
  margin: 16px;
}
</style>