<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改入口' : '新建入口'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 5 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 15 }, sm: { span: 24 } }"
    >
      <a-form-item label="入口名称:" name="shortcutName">
        <a-input v-model:value="form.shortcutName" placeholder="请输入申请入口名称" allow-clear />
      </a-form-item>

      <a-form-item label="流程分类:" name="category">
        <a-select v-model:value.trim="form.category" placeholder="请选择流程分类" allow-clear @change="categorySelect">
          <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.categoryCode"
            >{{ item.categoryName }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="图标:" name="icon">
        <ele-icon-picker v-model:value="form.icon" placeholder="请选择菜单图标" />
      </a-form-item>

      <a-form-item label="排序:" name="sort">
        <a-input-number style="width: 100%" v-model:value="form.sort" placeholder="请输入排序" allow-clear />
      </a-form-item>

      <a-form-item label="描述:" name="description">
        <a-textarea v-model:value="form.description" placeholder="请输入描述" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import EleIconPicker from 'ele-admin-pro/packages/ele-icon-picker';
import { ShortCutApi } from '@/api/workflow/ShortCutApi';

export default {
  name: 'EntranceEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 下拉数据
    selectList: Array
  },
  components: {
    EleIconPicker
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        shortcutName: [{ required: true, message: '请输入申请入口名称', type: 'string', trigger: 'blur' }],
        category: [{ required: true, message: '请选择流程分类', type: 'string', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择图标', type: 'string', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /**
     * 保存和编辑
     *
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = ShortCutApi.edit(this.form);
      } else {
        result = ShortCutApi.add(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          this.$message.success(result.message);

          // 如果是新增，则form表单置空
          if (!this.isUpdate) {
            this.form = {};
          }

          // 关闭弹框，通过控制visible的值，传递给父组件
          this.updateVisible(false);

          // 触发父组件done事件
          this.$emit('done');
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 分类下拉事件，初始化分类名称
     *
     * @author fengshuonan
     * @date 2021/7/4 14:23
     */
    categorySelect(value) {
      this.form.categoryName = this.selectList.find(item => value === item.categoryCode).categoryName;
    }
  }
};
</script>

<style scoped></style>
