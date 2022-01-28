<template>
  <div>
      <div :style="{ textAlign: 'right', marginBottom: '7px' }">
          <a-button icon="plus" type="primary" @click="addEstate">新增房源</a-button>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
				:rowKey="(record, index) => index"
      >
        <span slot="operation">
					<a-upload
						name="avatar"
						listType="picture-card"
						class="avatar-uploader"
						:showUploadList="false"
						action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						@change="handleChange"
					>
						<img v-if="imgUrl" :src="imgUrl" alt="avatar" style="width: 100% "/>
						<div v-else>
								<a-icon :type="loading ? 'loading' : 'plus'" />
								<div class="ant-upload-text">Upload</div>
						</div>
					</a-upload>
        </span>
      </a-table>
      <a-modal
        title="新增房源"
        :visible="visible"
      >
        <AddHouse />
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
    { title: '图片', dataIndex: 'images', key: 'images', scopedSlots: { customRender: 'operation' } },
];
const getHousesForSellApi = '/api/admin/get-house-info';

export default {
    name: 'EstateForSell',
    data() {
        return {
            visible: false,
            confirmLoading: false,
            data: [],
            columns,
						imgUrl: '',
						loading: false,
        };
    },
    mounted() {
        this.getHousesForSellList();
    },
    methods: {
			getBase64 (img, callback) {
				const reader = new FileReader()
				reader.addEventListener('load', () => callback(reader.result))
				reader.readAsDataURL(img)
			},
			// 图片上传，获取到图片得文件流，保存到fileList中
			handleChange (info) {
				this.imgUrl = ''
				if (info.file.status === 'uploading') return;
				this.loading = true;
				if (info.file.status === 'done') {
					getBase64(info.file.originFileObj, imageUrl => {
						this.imgUrl = imageUrl
						this.loading = false
					})
					this.fileList = info.file.originFileObj
				}
			},
			handleOk (e) {
        const formData = new FormData()
        formData.append('file', this.fileList)
        this.$upload('/cm_classify', formData).then(r => {
          if (r.data.code === 200) {
            this.btnSearch()
          }
          this.$message.warning(r.data.msg)
          this.loading = false
          this.visible = false
        }).catch(() => {
          this.loading = false
          this.visible = false
        })
    	},
			getHousesForSellList() {
				axios.post(getHousesForSellApi, {}).then((res) => {
					global.console.log(res);
					if (res.data && res.data.success) {
							const result = res.data.data;
							this.data = result;
					}
				}).catch((err) => {
					global.console.log(err);
				});
			},
			addEstate() {
					this.visible = true;
			},
			handleOk() {
					this.confirmLoading = true;
			},
			handleCancel() {
					this.confirmLoading = false;
					this.visible = false;
			},
    },
    components: {
			AddHouse,
		},
}
</script>

<style>

</style>