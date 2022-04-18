<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="通知标题:">
              <a-input v-model:value.trim="where.noticeTitle" placeholder="请输入通知标题" allow-clear />
            </a-form-item>
            <a-form-item class="ele-text-center" :wrapper-col="{ span: 24 }">
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
          row-key="noticeId"
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
            </a-space>
          </template>

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除吗？" @confirm="deleteNotice(record)">
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <publish-edit ref="publish" v-model:visible="showEdit" :data="current" @done="reload" />
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import PublishEdit from './publish-edit';
import { NoticeApi } from '@/api/NoticeApi';

export default {
  name: 'Publish',
  components: {
    PlusOutlined,
    PublishEdit
  },
  data() {
    return {
      // 表格数据接口
      url: '/sysNotice/page',
      // 表格列配置
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '标题',
          dataIndex: 'noticeTitle',
          sorter: true
        },
        {
          title: '创建人',
          dataIndex: 'createUserName',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
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
     * 重新加载
     *
     * @author laihongliang
     * @date 2021/04/04 12:26
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置
     *
     * @author laihongliang
     * @date 2021/04/04 12:24
     */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 打开新建/编辑弹窗
     *
     * @author laihongliang
     * @date 2021/04/04 12:24
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
      this.$refs.publish.getUserList();
    },

    /**
     * 删除通知
     *
     * @author fengshuonan
     * @date 2021/6/14 21:00
     */
    async deleteNotice(row) {
      const result = await NoticeApi.deleteNotice(row);
      this.$message.success(result.message);
      this.reload();
    }
  }
};
</script>
