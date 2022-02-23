<template>
  <div>
		<a-form :form="form" layout='vertical'>
			<template v-for="(item, key) in formItems">
				<a-form-item :label="item.label" :key="key">
					<a-input
						v-decorator="[
							item.label_en,
							{
								rules: item.rules,
							}
						]"
					/>
				</a-form-item>
			</template>
		</a-form>
		<div style="textAlign: center;">
			<a-button type="primary" @click="addAgents">确定</a-button>
			<a-button type="primary" @click="form.resetFields();">重置</a-button>
		</div>
	</div>
</template>

<script>
import axios from '../../config/axios';
const formItems = [
	{
		label: '姓名',
		label_en: 'name',
		rules: [{ required: true, message: '请填写代理人姓名!' }],
	},
	{
		label: '邮箱',
		label_en: 'email',
		rules: [{ required: true, message: '请填写代理人邮箱!' }],
	},
	{
		label: '办公电话',
		label_en: 'office',
		rules: [{ required: true, message: '请填写办公电话!' }],
	},
	{
		label: '移动电话',
		label_en: 'mobile',
		rules: [{ required: true, message: '请填写移动电话!' }],
	},
	{
		label: '职位',
		label_en: 'position',
		rules: [{ required: true, message: '请填写职位!' }],
	},
	{
		label: '个人介绍',
		label_en: 'details',
		rules: [{ required: true, message: '请填写个人介绍!' }],
	},
];
const addAgentsApi = '/api/admin/add-agent';

export default {
	name: 'AddAgents',
	data: () => {
		return {
			form: null,
			formItems,
		}
	},
	mounted() {
		this.form = this.$form.createForm(this, { name: 'AddAgentsForm' });
	},
	methods: {
		addAgents() {
			this.form.validateFields().then((res) => {
				const params = res;
				axios.post(addAgentsApi, params).then((r) => {
					console.log(r);
				}).catch(() => {});
			}).catch(() => {});
		},
	},
}
</script>

<style>

</style>