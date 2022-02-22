<template>
  <div>
		<a-table
			:columns="columns"
			:dataSource="data"
			:rowKey="(record, index) => index"
			:loading="tableloading"
			:pagination="pagination"
		>
		</a-table>
	</div>
</template>

<script>
import axios from '../../config/axios';

const get_all_comments_api = '/api/user/get-all-comments';
const columns = [
	{ title: '姓名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
	{ title: '邮箱', dataIndex: 'email', key: 'email', scopedSlots: { customRender: 'email' } },
	{ title: '电话', dataIndex: 'phone', key: 'phone', scopedSlots: { customRender: 'phone' } },
	{ title: '留言', dataIndex: 'comments', key: 'comments' },
];

export default {
	name: 'UserComments',
	data: () => {
		return {
			tableloading: false,
			pagination: {
				current: 1,
				pageSize: 5,
				total: 0,
			},
			columns,
			data: [],
		}
	},
	mounted() {
		this.getAllComments();
	},
	methods: {
		getAllComments() {
			this.tableloading = true;
			const params = {
				page: 1,
				size: 5,
			};
			axios.post(get_all_comments_api, params).then((res) => {
				if (res.data.data && res.data.success) {
					this.data = res.data.data;
				}
				this.tableloading = false;
			}).catch((err) => {
				console.log(err);
				this.tableloading = false;
			});
		},
	},
}
</script>

<style>

</style>