<!-- 用户编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改用户' : '新建用户'"
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
      <a-row :gutter="8">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="账号:" name="account">
            <a-input v-model:value="form.account" placeholder="请输入账号" allow-clear autocomplete="off" />
          </a-form-item>
          <a-form-item v-if="!isUpdate" label="登录密码:" name="password">
            <a-input-password v-model:value="form.password" placeholder="请输入登录密码" autocomplete="new-password" />
          </a-form-item>
          <a-form-item v-if="!isUpdate" label="确认密码:" name="repeatPassword">
            <a-input-password v-model:value="form.repeatPassword" placeholder="请输入确认密码" autocomplete="off" />
          </a-form-item>
          <a-form-item label="机构:" name="orgId">
            <a-tree-select
              v-model:value="form.orgId"
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
          <a-form-item label="职位:" name="positionId">
            <a-select
              show-search
              v-model:value="form.positionId"
              placeholder="请选择职务"
              style="width: 100%"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              allow-clear
            >
              <a-select-option v-for="item in positionList" :key="item.positionId">
                {{ item.positionName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="手机号:" name="phone">
            <a-input v-model:value="form.phone" placeholder="请输入手机号" allow-clear />
          </a-form-item>
          <a-form-item label="邮箱:" name="email" v-if="isUpdate">
            <a-input v-model:value="form.email" placeholder="请输入邮箱" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="姓名:" name="realName">
            <a-input v-model:value="form.realName" placeholder="请输入姓名" allow-clear />
          </a-form-item>
          <a-form-item label="昵称:" name="nickName">
            <a-input v-model:value="form.nickName" placeholder="请输入昵称" allow-clear />
          </a-form-item>
          <a-form-item label="性别:" name="sex">
            <a-select v-model:value="form.sex" placeholder="请选择性别" allow-clear>
              <a-select-option value="M">男</a-select-option>
              <a-select-option value="F">女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="出生日期:" name="birthday">
            <a-date-picker v-model:value="form.birthday" value-format="YYYY-MM-DD" placeholder="请选择出生日期" class="ele-fluid" />
          </a-form-item>
          <a-form-item label="邮箱:" name="email" v-if="!isUpdate">
            <a-input v-model:value="form.email" placeholder="请输入邮箱" allow-clear autocomplete="off" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import validate from 'ele-admin-pro/packages/validate';
import { UserApi } from '@/api/UserApi';

export default {
  name: 'UserEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 组织机构列表
    orgList: Array
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        account: [{ required: true, message: '请输入用户账号', type: 'string', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', type: 'string', trigger: 'blur' }],
        repeatPassword: [
          { required: true, message: '请输入重复密码', type: 'string', trigger: 'blur' },
          {
            type: 'string',
            trigger: 'blur',
            // eslint-disable-next-line no-unused-vars
            validator: async (rule, value, callback) => {
              const password = this.form.password;
              if (value && password !== value) {
                return Promise.reject('两次密码输入不一致');
              } else {
                return Promise.resolve();
              }
            }
          }
        ],
        email: [{ pattern: validate.email, message: '邮箱格式不正确', type: 'string', trigger: 'blur' }],
        phone: [{ pattern: validate.phone, message: '手机号格式不正确', type: 'string', trigger: 'blur' }],
        orgId: [{ required: true, message: '请选择组织机构', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
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
  async mounted() {
    // 获取职位列表
    this.positionList = await UserApi.getPositionDropList();
  },
  methods: {
    /**
     * 保存和编辑用户
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
        result = UserApi.editUser(this.form);
      } else {
        result = UserApi.addUser(this.form);
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
     * 更新编辑用户界面的弹框是否显示
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
