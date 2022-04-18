<template>
  <div class="ele-body">
    <a-row :gutter="16">
      <!-- 左侧组织机构列表 -->
      <a-col :lg="5" :md="10" :sm="24" :xs="24">
        <org-list
          :orgList="orgList"
          v-model:currentSelectOrgId="where.orgId"
          @changeNodeSelect="reload"
          @updateOrgList="updateOrgList"
        ></org-list>
      </a-col>

      <!-- 右侧用户管理表格 -->
      <a-col :lg="19" :md="14" :sm="24" :xs="24">
        <!-- 搜索表单 -->
        <div class="block-interval">
          <a-card :bordered="false">
            <a-form layout="inline" :model="where">
              <a-row>
                <a-form-item label="账号:">
                  <a-input v-model:value.trim="where.account" placeholder="请输入账号" allow-clear />
                </a-form-item>
                <a-form-item label="姓名">
                  <a-input v-model:value.trim="where.realName" placeholder="请输入姓名" allow-clear />
                </a-form-item>
                <a-form-item class="ele-text-center">
                  <a-space>
                    <a-button type="primary" @click="reload">查询</a-button>
                    <a-button @click="reset">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-row>
            </a-form>
          </a-card>
        </div>

        <!-- 表格 -->
        <div>
          <a-card :bordered="false">
            <ele-pro-table
              ref="table"
              row-key="userId"
              :datasource="url"
              :columns="columns"
              :where="where"
              v-model:selection="selection"
              :scroll="{ x: 'max-content' }"
            >
              <!-- table上边工具栏 -->
              <template #toolbar>
                <a-space>
                  <a-button type="primary" @click="openEdit()">
                    <template #icon>
                      <plus-outlined />
                    </template>
                    <span>新建</span>
                  </a-button>
                  <a-button danger @click="removeBatch">
                    <template #icon>
                      <delete-outlined />
                    </template>
                    <span>删除</span>
                  </a-button>
                </a-space>
              </template>

              <!-- table列表状态栏 -->
              <!-- 1是激活，2是禁用 -->
              <template #state="{ record }">
                <a-switch :checked="record.statusFlag === 1" @change="checked => editState(checked, record)" />
              </template>

              <!-- table操作栏按钮 -->
              <template #action="{ record }">
                <a-space>
                  <a @click="openEdit(record)">修改</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确定要删除此用户吗？" @confirm="remove(record)">
                    <a class="ele-text-danger">删除</a>
                  </a-popconfirm>
                  <a-divider type="vertical" />
                  <a @click="openRoleDialog(record)">分配角色</a>
                  <a-divider type="vertical" />
                  <a @click="resetPsw(record)">重置密码</a>
                </a-space>
              </template>
            </ele-pro-table>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>

  <!-- 编辑弹窗 -->
  <user-edit v-model:visible="showEdit" :data="current" @done="reload" :org-list="orgList" />

  <!-- 导入弹窗 -->
  <user-import v-model:visible="showImport" @done="reload" />

  <!-- 分配角色弹窗 -->
  <user-role v-model:visible="showUserRole" :data="current" @done="reload" />
</template>

<script>
import { createVNode } from 'vue';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import UserEdit from './user-edit';
import UserRole from './user-role';
import UserImport from './user-import';
import { UserApi } from '@/api/UserApi';
import OrgList from '@/views/orginfo/user/org-list';

export default {
  name: 'SystemUser',
  components: {
    OrgList,
    PlusOutlined,
    DeleteOutlined,
    UserImport,
    UserEdit,
    UserRole
  },
  data() {
    return {
      // 表格数据接口
      url: '/sysUser/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '账号',
          dataIndex: 'account',
          sorter: true
        },
        {
          title: '姓名',
          dataIndex: 'realName',
          sorter: true
        },
        {
          title: '职务',
          dataIndex: 'positionName',
          sorter: true
        },
        {
          title: '电话',
          dataIndex: 'phone',
          sorter: true
        },
        {
          title: '性别',
          dataIndex: 'sex',
          sorter: true,
          customRender: function({ text }) {
            if ('F' === text) {
              return '女';
            } else {
              return '男';
            }
          }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          slots: { customRender: 'state' }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示用户导入弹窗
      showImport: false,
      // 是否显示用户角色分配弹窗
      showUserRole: false,
      // 左侧组织机构列表的数据
      orgList: []
    };
  },
  async created() {
    this.orgList = await UserApi.getOrgTeeList();
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 更新组织机构列表数据
     *
     * @author fengshuonan
     * @date 2021/4/12 14:18
     */
    async updateOrgList() {
      this.orgList = await UserApi.getOrgTeeList();
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await UserApi.deleteUser({ userId: row.userId });
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 批量删除
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的用户吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let params = this.selection.map(d => d.userId);
          const result = await UserApi.batchDeleteUser({ userIds: params });
          this.$message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 打开角色分配的对话框
     *
     * @author fengshuonan
     * @date 2021/4/7 16:45
     */
    openRoleDialog(row) {
      this.current = row;
      this.showUserRole = true;
    },

    /**
     * 重置用户密码
     *
     * @author fengshuonan
     * @date 2021/4/2 17:04
     */
    resetPsw(row) {
      this.$confirm({
        title: '提示',
        content: '确定要重置此用户的密码为"123456"吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let result = await UserApi.resetPwd({ userId: row.userId });
          this.$message.success(result.message);
        }
      });
    },

    /**
     * 修改用户状态
     *
     * @author fengshuonan
     * @date 2021/4/2 17:04
     */
    async editState(checked, row) {
      const userId = row.userId;
      // 用户状态：1-启用，2-禁用
      const statusFlag = checked ? 1 : 2;
      const result = await UserApi.changeStatus({ userId, statusFlag });
      this.$message.success(result.message);
      row.statusFlag = statusFlag;
    }
  }
};
</script>

<style scoped>
/*搜索框与表格之间的间隙*/
.block-interval {
  margin-bottom: 10px;
}

/*重写顶部搜索表单的样式*/
.ant-form-item {
  margin-bottom: 0;
}
</style>
