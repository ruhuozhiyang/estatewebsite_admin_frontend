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
					:before-upload="beforeUpload"
					:data="{ 'id': r.id}"
					action="/api/admin/upload_img"
					list-type="picture-card"
					:file-list="o || []"
					@preview="handlePreview"
					:remove="(f) => { handleRemove(f, r.id); }"
					@change="(info) => { handleChange(info, r.id); }"
				>
					<div v-if="o && o.length < 2">
						<a-icon type="plus" />
					</div>
				</a-upload>
			</span>
			<template v-for="(item, key) in ['price', 'place', 'area']">
				<span :key="key" :slot="item" slot-scope="text">
					<span v-if="text === null || text === ''">--</span>
					<span v-else>{{ text }}</span>
				</span>
			</template>
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
	{ title: '地理位置', dataIndex: 'place', key: 'place', scopedSlots: { customRender: 'place' } },
	{ title: '价格', dataIndex: 'price', key: 'price', scopedSlots: { customRender: 'price' } },
	{ title: '面积', dataIndex: 'area', key: 'area', scopedSlots: { customRender: 'area' } },
	{ title: '卧室数', dataIndex: 'roomNum', key: 'roomNum' },
	{ title: '客厅数', dataIndex: 'livingNum', key: 'livingRoom' },
	{ title: '卫生间数', dataIndex: 'toiletNum', key: 'toiletRoom' },
	{ title: '图片', dataIndex: 'imgArray', key: 'imgArray', scopedSlots: { customRender: 'operation' } },
];

const getHousesForSellApi = '/api/admin/get-house-info';
const deleteImgApi = '/api/admin/del-img';
const restApi = 'http://localhost:8080';

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
				total: 0,
			},
			previewVisible: false,
			previewImage: '',
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
          url: restApi + e,
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
			} else if (file.response && file.response.url) {
				this.previewImage = restApi + file.response.url;
				this.previewVisible = true;
			}
		},
		handleChange({fileList}, id) {
			this.data.forEach(ele => {
				if (ele.id === id) {
					ele.imgArray = fileList;
				}
			});
		},
		handleRemove(f, a) {
			let url = '';
			if (f.response && f.response.url) {
				url = f.response.url;
			} else if (f.url) {
				url = f.url.replace(restApi, '');
			}
			const params = {
				id: a,
				p: url,
			};
			axios({ method: 'post', url: deleteImgApi, data: params }).then((res) => {
				if (res.data.success) {
					this.$message.success('删除成功！');
				}
			}).catch(() => {
				this.$message.error('删除失败！');
			});
		},						
		beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
	},
	components: {
		AddHouse,
	},
}
</script>

<style>

</style>