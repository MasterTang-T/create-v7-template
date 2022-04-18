<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="账号:">
              <a-input v-model:value.trim="where.account" placeholder="请输入账号" allow-clear />
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
          row-key="account"
          :datasource="url"
          :columns="columns"
          :where="where"
          :scroll="{ x: 'max-content' }"
          :needPage="false"
          :response="{
            statusName: 'code',
            statusCode: '00000',
            msgName: 'message',
            dataName: 'data'
          }"
        >
          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="kickOff(record)">踢下线</a>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>
</template>

<script>
// 删除，感叹号，加号图标
import { UserApi } from '@/api/UserApi';

export default {
  name: 'OnlineUser',
  components: {},
  data() {
    return {
      // 表格数据接口
      url: '/sysUser/onlineUserList',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '账号',
          dataIndex: 'account'
        },
        {
          title: '昵称',
          dataIndex: 'nickName'
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '性别',
          dataIndex: 'sex'
        },
        {
          title: '角色',
          dataIndex: 'roleName'
        },
        {
          title: '登录时间',
          dataIndex: 'loginTime'
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
      showEdit: false
    };
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
     * 踢下线
     *
     * @author fengshuonan
     * @date 2021/4/13 14:47
     */
    async kickOff(row) {
      const result = await UserApi.kickOff({ token: row.token });
      this.$message.info(result.message);
    }
  }
};
</script>

<style scoped>
/*搜索框与表格之间的间隙*/
.block-interval {
  margin-bottom: 10px;
}
</style>
