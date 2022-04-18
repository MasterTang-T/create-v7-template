<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirm-loading="loading"
    title="流程实例终止"
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
      <a-form-item label="终止原因:" name="comment">
        <a-textarea v-model:value="form.comment" placeholder="请输入终止原因" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { InstanceManageApi } from '@/api/workflow/InstanceManageApi';

export default {
  name: 'EndForm',
  components: {},
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
        comment: [{ required: true, message: '请输入终止原因', type: 'string', trigger: 'blur' }]
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
     * 提交流程终止
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
      this.form.id = this.record.id;

      InstanceManageApi.end(this.form)
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
