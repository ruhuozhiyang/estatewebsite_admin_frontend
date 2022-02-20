<template>
  <div>
		<div style="textAlign: right; marginBottom: 7px;">
			<a-button icon="plus" type="primary" @click="visible = true;">新增房源</a-button>
		</div>
		<a-table
			:columns="columns"
			:dataSource="data"
			:rowKey="(record, index) => index"
			:loading="tableloading"
			:pagination="pagination"
		>
			<span slot="operation" slot-scope="o, r">
				<a-upload
					:data="{ 'id': r.id}"
					action="/api/admin/upload_img"
					list-type="picture-card"
					:file-list="o || []"
					@preview="handlePreview"
				>
					<div v-if="o && o.length < 5">
						<a-icon type="plus" />
					</div>
				</a-upload>
			</span>
		</a-table>
		<a-modal title="新增房源" :visible="visible" :footer="null" width="50%" @cancel="visible = false;">
			<AddHouse />
		</a-modal>
		<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
			<img alt="图片资源获取失败!" style="width: 100%" :src="previewImage" />
		</a-modal>
  </div>
</template>

<script>
import axios from '../../config/axios';
import AddHouse from '../../component/estateforsell/AddHouse.vue';

const columns = [
	{ title: '地理位置', dataIndex: 'place', key: 'place' },
	{ title: '价格', dataIndex: 'price', key: 'price' },
	{ title: '面积', dataIndex: 'area', key: 'area' },
	{ title: '卧室数', dataIndex: 'roomNum', key: 'roomNum' },
	{ title: '客厅数', dataIndex: 'livingNum', key: 'livingRoom' },
	{ title: '卫生间数', dataIndex: 'toiletNum', key: 'toiletRoom' },
	{ title: '图片', dataIndex: 'imgArray', key: 'imgArray', scopedSlots: { customRender: 'operation' } },
];

const getHousesForSellApi = '/api/admin/get-house-info';

export default {
	name: 'EstateForSell',
	data() {
		return {
			visible: false,
			data: [],
			columns,
			tableloading: false,
			pagination: {
				current: 1,
				pageSize: 5,
				total: 50,
			},
			previewVisible: false,
			previewImage: '',
			fileList: [],
		};
	},
	mounted() {
		this.getHousesForSellList();
	},
	methods: {
		getHousesForSellList() {
			this.tableloading = true;
			axios.post(getHousesForSellApi, {}).then((res) => {
				if (res.data && res.data.success) {
					const result = res.data.data;
					if (Array.isArray(result) && result.length > 0) {
						result.forEach(ele => {
							if (ele.imgArray) {
								ele.imgArray = this.getFileList(ele.imgArray);
							}
						});
					}
					this.data = result;
					this.tableloading = false;
				}
			}).catch((err) => {
				global.console.log(err);
				this.tableloading = false;
			});
		},
		getFileList(imgs) {
			if (Array.isArray(imgs) && imgs.length === 0) {
				return [];
			}
			let res = [];
			imgs.forEach((e, i) => {
				res.push({
					uid: i,
          name: e.split("/").pop(),
          status: 'done',
          url: 'http://localhost:8080' + e,
				});
			});
			return res;
		},
		handleCancel() {
			this.previewVisible = false;
		},
		handlePreview(file) {
			if (file.url) {
				this.previewImage = file.url;
				this.previewVisible = true;
			}
		},
	},
	components: {
		AddHouse,
	},
}
</script>

<style>

</style>