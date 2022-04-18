<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="资源名称:">
              <a-input v-model:value.trim="where.resourceName" placeholder="请输入资源名称" allow-clear />
            </a-form-item>
            <a-form-item label="资源url">
              <a-input v-model:value.trim="where.url" placeholder="请输入资源url" allow-clear />
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
          row-key="resourceId"
          :datasource="url"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >

          <!-- table列表是否是视图栏 -->
          <!-- Y是视图，N是不是视图 -->
          <template #view="{ record }">
            <a-tag color="green" v-if="record.viewFlag === 'Y'">是</a-tag>
            <a-tag v-else> 否</a-tag>
          </template>

          <!-- table列表是需要登录栏 -->
          <!-- Y是需要登录，N是不需要登录 -->
          <template #requiredLogin="{ record }">
            <a-tag color="green" v-if="record.requiredLoginFlag === 'Y'">是</a-tag>
            <a-tag v-else> 否</a-tag>
          </template>

          <!-- table列表是需要权限验证栏 -->
          <!-- Y是需要权限验证，N是不需要权限验证 -->
          <template #requiredPermission="{ record }">
            <a-tag color="green" v-if="record.requiredPermissionFlag === 'Y'">是</a-tag>
            <a-tag v-else> 否</a-tag>
          </template>


          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openEdit(record)">详情</a>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <resource-edit v-model:visible="showEdit" :data="current" @done="reload" />

</template>

<script> 
import ResourceEdit from './resource-edit';

export default {
  name: 'SystemResource',
  components: {
    ResourceEdit
  },
  data() {
    return {
      // 表格数据接口
      url: '/resource/pageList',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '资源名称',
          dataIndex: 'resourceName',
          width: 260,
          sorter: true
        },
        {
          title: '资源编码',
          dataIndex: 'resourceCode',
          width: 260,
          sorter: true
        },
        {
          title: '模块名称',
          dataIndex: 'methodName',
          width: 170,
          sorter: true
        },
        {
          title: '是否视图',
          dataIndex: 'phone',
          width: 80,
          align: 'center',
          sorter: true,
          slots: { customRender: 'view' }
        },
        {
          title: '请求url',
          dataIndex: 'url',
          width: 260,
          sorter: true
        },
        {
          title: 'http方法',
          dataIndex: 'httpMethod',
          width: 80,
          sorter: true
        },
        {
          title: '需要登录',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          width: 80,
          slots: { customRender: 'requiredLogin' }
        },
        {
          title: '需要权限验证',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          width: 80,
          slots: { customRender: 'requiredPermission' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 80,
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
    
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author jiawei
     * @date 2021/4/8 17:03
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author jiawei
     * @date 2021/4/8 17:03
     */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 打开编辑弹窗
     *
     * @author jiawei
     * @date 2021/4/8 17:03
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

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
