<!-- 应用编辑弹窗 -->
<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改脚本' : '新建脚本'"
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
      <a-form-item label="名称:" name="scriptName">
        <a-input v-model:value="form.scriptName" placeholder="请输入名称" allow-clear />
      </a-form-item>

      <a-form-item label="类别:" name="scriptType">
        <a-select placeholder="请选择类别" v-model:value="form.scriptType">
          <a-select-option :value="1">流程脚本</a-select-option>
          <a-select-option :value="2">系统脚本</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="语言:" name="lang">
        <a-select placeholder="请选择语言" v-model:value="form.lang">
          <a-select-option :value="1">groovy</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="脚本内容:" name="content">
        <a-textarea v-model:value="form.content" :rows="6" placeholder="请输入脚本内容"></a-textarea>
      </a-form-item>

      <a-form-item label="备注:" name="remark">
        <a-textarea v-model:value="form.remark" :rows="4" placeholder="请输入备注"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { ScriptApi } from '@/api/workflow/ScriptApi';

export default {
  name: 'ScriptEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        scriptName: [{ required: true, message: '请输入名称', type: 'string', trigger: 'blur' }],
        scriptType: [{ required: true, message: '请选择类别', type: 'number', trigger: 'blur' }],
        lang: [{ required: true, message: '请选择语言', type: 'number', trigger: 'blur' }],
        content: [{ required: true, message: '请输入脚本内容', type: 'string', trigger: 'blur' }]
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
        result = ScriptApi.edit(this.form);
      } else {
        result = ScriptApi.add(this.form);
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
    }
  }
};
</script>

<style scoped></style>
