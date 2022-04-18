<!-- 应用编辑弹窗 -->
<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirm-loading="loading"
    title="应用申请至入口"
    :body-style="{ paddingBottom: '8px' }"
    @cancel="handleCancel"
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
        <a-input v-model:value="form.shortcutName" placeholder="请输入口名称" allow-clear />
      </a-form-item>

      <a-form-item label="图标:" name="icon">
        <ele-icon-picker v-model:value="form.icon" placeholder="请选择菜单图标" />
      </a-form-item>

      <a-form-item label="排序:" name="sort">
        <a-input-number v-model:value="form.sort" placeholder="请输入排序" allow-clear style="width: 100%" />
      </a-form-item>

      <a-form-item label="描述:" name="description">
        <a-input v-model:value="form.description" placeholder="请输入描述" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import EleIconPicker from 'ele-admin-pro/packages/ele-icon-picker';
import { ShortCutApi } from '@/api/workflow/ShortCutApi';

export default {
  name: 'ApplyEntrance',
  components: {
    EleIconPicker
  },
  data() {
    return {
      // 当前页面是否显示
      visible: false,
      // 页面传过来的数据
      record: {},
      // 表单数据
      form: {},
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请输入口名称', type: 'string', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择菜单图标', type: 'string', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false
    };
  },
  methods: {
    /**
     * 初始化model框弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 22:48
     */
    initModel(record) {
      this.record = record;
      this.visible = true;
    },

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

      // 组装数据
      this.form.processDefinitionId = this.record.id;
      this.form.category = this.record.category;
      this.form.categoryName = this.record.categoryName;
      this.form.version = this.record.version;

      ShortCutApi.add(this.form)
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          this.$message.success(result.message);

          // 如果是新增，则form表单置空
          this.form = {};

          this.visible = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 关闭对话框
     *
     * @author fengshuonan
     * @date 2021/7/1 22:23
     */
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>

<style scoped></style>
