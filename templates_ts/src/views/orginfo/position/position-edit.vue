<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改职位' : '新建职位'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      layout="horizontal"
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
    >
      <a-form-item label="职位名称:" name="positionName">
        <a-input v-model:value="form.positionName" placeholder="请输入职位名称" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="职位编码:" name="positionCode">
        <a-input v-model:value="form.positionCode" placeholder="请输入职位编码" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="职位排序:" name="positionSort">
        <a-input-number v-model:value="form.positionSort" placeholder="请输入职位排序" allow-clear autocomplete="off" style='width: 100%' />
      </a-form-item>

      <a-form-item label="备注信息:" name="positionRemark">
        <a-input v-model:value="form.positionRemark" placeholder="请输入备注信息" allow-clear autocomplete="off" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PositionApi } from '@/api/PositionApi';

export default {
  name: 'PositionEdit',
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
        positionName: [{ required: true, message: '请输入职位名称', type: 'string', trigger: 'blur' }],
        positionCode: [{ required: true, message: '请输入职位编码', type: 'string', trigger: 'blur' }],
        positionSort: [{ required: true, message: '请输入数字顺序', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
      // 组织机构树列表
      orgList: [],
      // 职位列表
      positionList: []
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
     * 保存和编辑职务
     *
     * @author fengshuonan
     * @date 2021/4/8 13:33
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改
      if (this.isUpdate) {
        result = PositionApi.edit(this.form);
      } else {
        result = PositionApi.add(this.form);
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
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
