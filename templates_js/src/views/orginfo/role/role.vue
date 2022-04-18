<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="角色名称:">
              <a-input v-model:value.trim="where.roleName" placeholder="请输入角色名称" allow-clear />
            </a-form-item>
            <a-form-item label="角色编码:">
              <a-input v-model:value.trim="where.roleCode" placeholder="请输入角色编码" allow-clear />
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
          row-key="roleId"
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

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除此角色吗？" @confirm="remove(record)">
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-dropdown>
                <a>
                  <span>更多<down-outlined class="ele-text-small"/></span>
                </a>
                <template #overlay>
                  <a-menu @click="obj => dropClick(obj.key, record)">
                    <a-menu-item key="menu">授权菜单</a-menu-item>
                    <a-menu-item key="api">授权接口</a-menu-item>
                    <a-menu-item key="data">授权数据范围</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <sys-role-edit v-model:visible="showEdit" :data="current" @done="reload" />

  <!-- 授权弹窗 -->
  <sys-role-grant-menu-button ref="sysRoleGrantMenu" />

  <!-- 接口弹窗 -->
  <sys-role-grant-api ref="sysRoleGrantApi" />

  <!-- 数据范围弹窗 -->
  <sys-role-grant-data v-model:visible="showData" :data="current" @done="reload" />
</template>

<script>
import { SysRoleApi } from '@/api/SysRoleApi';
import { createVNode } from 'vue';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import SysRoleEdit from './role-edit';
import SysRoleGrantMenuButton from './role-grant-menu-button.vue';
import SysRoleGrantApi from './role-grant-api.vue';
import SysRoleGrantData from './role-grant-data.vue';

export default {
  name: 'SysRole',
  components: {
    PlusOutlined,
    DeleteOutlined,
    SysRoleEdit,
    SysRoleGrantMenuButton,
    SysRoleGrantApi,
    SysRoleGrantData
  },
  data() {
    return {
      // 表格数据接口
      url: '/sysRole/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          sorter: true
        },
        {
          title: '角色编码',
          dataIndex: 'roleCode',
          sorter: true
        },
        {
          title: '数据范围',
          dataIndex: 'dataScopeType',
          sorter: true
        },
        {
          title: '排序',
          dataIndex: 'roleSort',
          sorter: true
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
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
      // 是否显示数据授权
      showData: false
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author chenjinlong
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
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await SysRoleApi.del({ roleId: row.roleId });
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 批量删除
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的角色吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          //let params = this.selection.map(d => d.appId);
          //const result = await SysRoleApi.batchDel({appIds: params});
          //this.$message.success(result.message);
          //this.reload();
          this.$message.error('暂无接口');
        }
      });
    },
    /* 下拉菜单点击事件 */
    dropClick(command, row) {
      // 菜单
      if (command === 'menu') {
        this.openAuth(row);
      } else if (command === 'api') {
        this.openApi(row);
      } else if (command === 'data') {
        this.openData(row);
      }
    },
    /**
     * 打开编辑弹窗
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 打开权限分配弹窗
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    openAuth(row) {
      this.$refs.sysRoleGrantMenu.openWindow(row.roleId);
    },

    /**
     * 打开权限分配弹窗
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    openApi(row) {
      this.$refs.sysRoleGrantApi.openWindow(row.roleName, row.roleId);
    },

    /**
     * 打开权限分配弹窗
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    openData(row) {
      this.current = row;
      this.showData = true;
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
