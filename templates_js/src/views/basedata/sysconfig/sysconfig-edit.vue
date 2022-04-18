<!-- 系统配置编辑弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :body-style="{ paddingBottom: '8px' }"
    :title="isUpdate ? '修改系统配置' : '添加系统配置'"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 7 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 17 }, sm: { span: 24 } }"
    >
      <a-form-item label="配置名称" name="configName">
        <a-input v-model:value="form.configName" placeholder="请输入配置名称" allow-clear />
      </a-form-item>
      <a-form-item label="配置编码" name="configCode">
        <a-input v-model:value="form.configCode" placeholder="请输入配置编码" allow-clear />
      </a-form-item>
      <a-form-item label="系统配置" name="sysFlagChecked">
        <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sysFlagChecked" />
      </a-form-item>
      <a-form-item label="配置值" name="configValue">
        <a-input v-model:value="form.configValue" placeholder="请输入配置值" allow-clear />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea v-model:value="form.remark" placeholder="请输入备注" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { SysConfigApi } from '@/api/SysConfigApi';

export default {
  name: 'SysConfigEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 字典id
    dictId: Number,
    // 配置分类编码
    groupCode: String
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        configName: [{ required: true, message: '请输入配置名称', type: 'string', trigger: 'blur' }],
        configCode: [{ required: true, message: '请输入配置编码', type: 'string', trigger: 'blur' }],
        configValue: [{ required: true, message: '请输入配置值', type: 'string', trigger: 'blur' }]
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
     * 保存编辑
     *
     * @author fengshuonan
     * @date 2021/4/9 16:08
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      if (this.form.sysFlagChecked === true) {
        this.form.sysFlag = 'Y';
      } else {
        this.form.sysFlag = 'N';
      }
      this.form.groupCode = this.groupCode;

      // 修改加载框为正在加载
      this.loading = true;

      let result;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = SysConfigApi.editSysConfig(this.form);
      } else {
        result = SysConfigApi.addSysConfig(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          this.$message.success(result.message);

          // 如果是新增用户，则form表单置空
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
     * 更新弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/4/9 16:03
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
