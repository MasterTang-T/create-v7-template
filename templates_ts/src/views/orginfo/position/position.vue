<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="职位名称:">
              <a-input v-model:value.trim="where.positionName" placeholder="请输入职位名称" allow-clear />
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
          row-key="positionId"
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
              <a-button danger @click="removeBatch()">
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
              <a-popconfirm title="确定要删除此职务吗？" @confirm="remove(record)">
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <position-edit v-model:visible="showEdit" :data="current" @done="reload" />
</template>

<script>
import { createVNode } from 'vue';
// 删除，感叹号，加号图标
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import PositionEdit from './position-edit';
import { PositionApi } from '@/api/PositionApi';

export default {
  name: 'Position',
  components: {
    DeleteOutlined,
    PlusOutlined,
    PositionEdit
  },
  data() {
    return {
      // 表格数据接口
      url: '/hrPosition/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '职位名称',
          dataIndex: 'positionName',
          width: 160,
          sorter: true
        },
        {
          title: '职位编码',
          dataIndex: 'positionCode',
          width: 160,
          sorter: true
        },
        {
          title: '备注',
          dataIndex: 'positionRemark',
          width: 160,
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          width: 160,
          slots: { customRender: 'state' }
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
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await PositionApi.del({ positionId: row.positionId });
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
        content: '确定要删除选中的职位吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let params = this.selection.map(d => d.positionId);
          const result = await PositionApi.batchDel({ positionIds: params });
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
     * 修改职位状态
     *
     * @author fengshuonan
     * @date 2021/4/2 17:04
     */
    async editState(checked, row) {
      const positionId = row.positionId;
      // 职位状态：1-启用，2-禁用
      const statusFlag = checked ? 1 : 2;
      const result = await PositionApi.updateStatus({ positionId, statusFlag });
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
