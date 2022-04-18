<!-- 用户分配角色 -->
<template>
  <a-modal :width="460" title="用户分配角色" :visible="visible" :confirm-loading="loading" @update:visible="updateVisible" @ok="save">
    <a-spin :spinning="dataLoading">
      <div style="height: 30vh" class="ele-scrollbar-hover">
        <a-tree
          checkable
          :tree-data="roleData"
          :replaceFields="{ children: 'children', title: 'name', key: 'id' }"
          v-model:checkedKeys="checkedKeys"
        />
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { UserApi } from '@/api/UserApi';

export default {
  name: 'UserRole',
  emits: ['update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 当前用户数据
    data: Object
  },
  data() {
    return {
      // 角色数据
      roleData: [],
      // 数据请求状态
      dataLoading: false,
      // 提交状态
      loading: false,
      // 角色选中的keys
      checkedKeys: []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.query();
      }
    }
  },
  methods: {
    /**
     * 获取角色信息
     *
     * @author fengshuonan
     * @date 2021/4/7 16:54
     */
    async query() {
      this.roleData = [];
      this.checkedKeys = [];
      if (!this.data) {
        return;
      }
      this.dataLoading = true;

      // 获取系统的所有角色列表
      this.roleData = await UserApi.getRoleDropList();

      // 获取用户所有的角色
      let userId = this.data.userId;
      let userRoles = await UserApi.getUserRoles({ userId });
      this.checkedKeys = userRoles.map(data => data.roleId);

      // 关闭loading
      this.dataLoading = false;
    },

    /**
     * 保存角色信息
     *
     * @author fengshuonan
     * @date 2021/4/7 16:57
     */
    async save() {
      // 获取当前登录用户和选择的角色
      let userId = this.data.userId;
      let grantRoleIdList = this.checkedKeys;

      // 显示加载中
      this.loading = true;

      // 分配角色
      const result = await UserApi.grantRoles({ userId, grantRoleIdList });
      this.$message.success(result.message);

      // 移除加载中
      this.loading = false;
      this.updateVisible(false);
    },

    /**
     * 更新弹框是否隐藏，传递给父组件信息
     *
     * @author fengshuonan
     * @date 2021/4/7 16:57
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
