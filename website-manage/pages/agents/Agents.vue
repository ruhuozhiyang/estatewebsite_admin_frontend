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
			@change="tableChange"
		>
			<span slot="photos" slot-scope="o, r">
				<a-upload
					:before-upload="beforeUpload"
					:data="{ 'id': r.id, 'flag': 'agent' }"
					action="/api/admin/upload_img"
					list-type="picture-card"
					:file-list="o || []"
					@preview="handlePreview"
					:remove="(f) => { handleRemove(f, r.id); }"
					@change="(info) => { handleChange(info, r.id); }"
				>
					<div v-if="o && o.length < 1">
						<a-icon type="plus" />
					</div>
				</a-upload>
			</span>
			<span slot="display" slot-scope="o">
				{{ o === '1' ? '是' : '否' }}
			</span>
		</a-table>
		<a-modal title="添加代理人" :visible="visible" :footer="null" width="50%" @cancel="visible = false;">
			<AddAgents @refresh="refresh" />
		</a-modal>
		<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
			<img alt="图片资源获取失败!" style="width: 100%" :src="previewImage" />
		</a-modal>
  </div>
</template>

<script>
import axios from '../../config/axios';
import AddAgents from '../../component/agents/AddAgents.vue';

const columns = [
	{ title: '姓名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
	{ title: '邮箱', dataIndex: 'email', key: 'email', scopedSlots: { customRender: 'email' } },
	{ title: '办公电话', dataIndex: 'office', key: 'office', scopedSlots: { customRender: 'office' } },
	{ title: '移动电话', dataIndex: 'mobile', key: 'mobile' },
	{ title: '职位', dataIndex: 'position', key: 'position' },
	{ title: '个人介绍', dataIndex: 'details', key: 'details' },
	{ title: '首页展示', dataIndex: 'display', key: 'display', scopedSlots: { customRender: 'display' } },
	{ title: '照片', dataIndex: 'photos', key: 'photos', scopedSlots: { customRender: 'photos' } },
];
const getAllAgentsApi = '/api/admin/get-all-agents';
const deleteImgApi = '/api/admin/del-img';
const restApi = 'http://localhost:8080';

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
			previewVisible: false,
			previewImage: '',
		};
	},
	mounted() {
		this.getAllAgents();
	},
	methods: {
		tableChange(pagination) {
			console.log(pagination);
			this.pagination.current = pagination.current;
			this.getAllAgents();
		},
		refresh() {
			this.visible = false;
			this.getAllAgents();
		},
		getAllAgents() {
			this.tableloading = true;
			const params = {
				l: (this.pagination.current - 1) * this.pagination.pageSize,
				r: this.pagination.pageSize,
			};
			axios.get(getAllAgentsApi, { params }).then((res) => {
				if (res.data && res.data.success) {
					const result = res.data.data.content || [];
					if (Array.isArray(result) && result.length > 0) {
						result.forEach(ele => {
							if (ele.photos) {
								ele.photos = this.getFileList(ele.photos);
							}
						});
					}
					this.data = result;
					this.pagination.total = res.data.data.total;
					this.tableloading = false;
				}
			}).catch(() => {
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
			console.log(fileList);
			this.data.forEach(ele => {
				if (ele.id === id) {
					ele.photos = fileList;
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
				f: 'agent',
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
		AddAgents
	},
}
</script>

<style>

</style>