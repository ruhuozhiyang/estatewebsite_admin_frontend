<template>
  <div>
		<div style="textAlign: right; marginBottom: 7px;">
			<a-button icon="plus" type="primary" @click="visible = true;">新增代理人</a-button>
		</div>
		<a-table
			:columns="columns"
			:dataSource="data"
			:rowKey="(record, index) => index"
			:loading="tableloading"
			:pagination="pagination"
		>
		</a-table>
		<a-modal title="添加代理人" :visible="visible" :footer="null" width="50%" @cancel="visible = false;">
			<AddAgents />
		</a-modal>
  </div>
</template>

<script>
import AddAgents from '../../component/agents/AddAgents.vue';
const columns = [
	{ title: '姓名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
	{ title: '邮箱', dataIndex: 'email', key: 'email', scopedSlots: { customRender: 'email' } },
	{ title: '办公电话', dataIndex: 'office', key: 'office', scopedSlots: { customRender: 'office' } },
	{ title: '移动电话', dataIndex: 'mobile', key: 'mobile' },
	{ title: '职位', dataIndex: 'position', key: 'position' },
	{ title: '个人介绍', dataIndex: 'details', key: 'details' },
	{ title: '照片', dataIndex: 'photo', key: 'photo' },
];

export default {
	name: 'agents',
	data: () => {
		return {
			visible: false,
			columns,
			data: [],
			tableloading: false,
			pagination: {
				current: 1,
				pageSize: 5,
				total: 0,
			},
		};
	},
	mounted() {

	},
	methods: {

	},
	components: {
		AddAgents
	},
}
</script>

<style>

</style>