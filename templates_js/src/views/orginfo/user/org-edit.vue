<!-- 组织机构编辑弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '编辑机构' : '新建机构'"
    :body-style="{ paddingBottom: '8px' }"
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
      <a-form-item label="上级机构:" name="orgParentId">
        <a-tree-select
          v-model:value="form.orgParentId"
          style="width: 100%"
          :tree-data="orgList"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择上级机构"
          :replaceFields="{ children: 'children', title: 'title', key: 'id', value: 'id' }"
          allow-clear
          tree-default-expand-all
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item label="机构名称:" name="orgName">
        <a-input v-model:value="form.orgName" placeholder="请输入机构名称" allow-clear />
      </a-form-item>
      <a-form-item label="机构编码:" name="orgCode">
        <a-input v-model:value="form.orgCode" placeholder="请输入机构编码" allow-clear />
      </a-form-item>
      <a-form-item label="排序号:" name="orgSort">
        <a-input-number v-model:value="form.orgSort" placeholder="请输入排序号" :min="0" class="ele-fluid" />
      </a-form-item>
      <a-form-item label="备注:" name="orgRemark">
        <a-input v-model:value="form.orgRemark" placeholder="请输入备注" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { UserApi } from '@/api/UserApi';

export default {
  name: 'OrgEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 接收上级传过来的组织机构信息
    data: Object,
    // 组织机构列表
    orgList: Array,
    // 是否是编辑界面
    isUpdate: Boolean
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}),
      // 表单验证规则
      rules: {
        orgParentId: [{ required: true, message: '请选择上级机构', type: 'string', trigger: 'blur' }],
        orgName: [{ required: true, message: '请输入组织机构名称', type: 'string', trigger: 'blur' }],
        orgCode: [{ required: true, message: '请输入组织机构编码', type: 'string', trigger: 'blur' }],
        dictSort: [{ required: true, message: '请输入组织机构排序', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
      } else {
        this.form = {};
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
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result;

      // 执行编辑或修改用户方法
      if (this.isUpdate) {
        result = UserApi.editOrg(this.form);
      } else {
        result = UserApi.addOrg(this.form);
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
