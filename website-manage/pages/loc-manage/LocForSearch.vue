<template>
  <div class="container">
		<div>
			<a-input-search
				style="margin-bottom: 8px; width: 50%"
				placeholder="Search"
				@change="onChange"
			/>
			<a-button type="primary" @click="showModal"><a-icon type="plus" /></a-button>
			<collection-create-form
				ref="collectionForm"
				:visible="visible"
				@cancel="handleCancel"
				@create="handleCreate"
			/>
		</div>
    <a-tree
			v-if="gData.length !== 0"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="gData"
      @expand="onExpand"
    >
      <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
		<div v-else>
			暂无信息
		</div>
  </div>
</template>

<script>
import axios from '../../config/axios';
import loc_options from '../../config/static';

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key, scopedSlots: { title: 'title' } });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

global.console.log(gData);

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const CollectionCreateForm = {
  props: ['visible'],
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' });
		this.onChange = (value) => {
      console.log(value);
    },
    this.displayRender = ({ labels }) => {
      return labels[labels.length - 1];
    },
		this.options = loc_options;
  },
  template: `
    <a-modal
      :visible="visible"
      title='新增地点'
      okText='确定'
			cancelText='取消'
      @cancel="() => { $emit('cancel') }"
      @ok="() => { $emit('create') }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='地区'>
				  <a-cascader
					  v-decorator="[
              'district',
              {
                rules: [{ required: true, message: '请选择!' }],
              }
            ]"
						:options="options"
						expand-trigger="hover"
						placeholder="请选择"
						@change="onChange"
					/>
        </a-form-item>
        <a-form-item label='地点'>
          <a-input v-decorator="['location']" />
        </a-form-item>
      </a-form>
    </a-modal>
  `,
};

export default {
  name: 'LocForSearch',
	data: () => {
		return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData,
			visible: false,
		}
	},
	mounted() {
		this._get_location();
	},
	methods: {
		_get_location() {
			axios.get('/api/admin/get-location').then((res) => {
				global.console.log(res);
			}).catch((e) => {

			});
		},
		onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
		showModal() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log('Received values of form: ', values);
				const params = {
					province: values.district.length === 2 ? '' : values.district[0],
					city: values.district.length === 2 ? values.district[0] : values.district[1],
					county: values.district.length === 2 ? values.district[1] : values.district[2],
					location: values.location,
				}
				axios.post('/api/admin/add-location', params).then(() => {}).catch(() => {});
        form.resetFields();
        this.visible = false;
      });
    },
	},
	components: {
		CollectionCreateForm
	},
}
</script>

<style scoped>
.container {
	margin-left: 1%;
}

</style>