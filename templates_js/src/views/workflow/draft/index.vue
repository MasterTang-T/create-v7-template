<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="流程名称">
              <a-input v-model:value.trim="where.processName" placeholder="请输入流程名称" allow-clear />
            </a-form-item>
            <a-form-item label="流程分类">
              <a-select v-model:value.trim="where.category" style="width: 210px" placeholder="请选择流程分类" allow-clear>
                <a-select-option v-for="(item, index) in flowableCategoryListData" :key="index" :value="item.categoryCode"
                  >{{ item.categoryName }}
                </a-select-option>
              </a-select>
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
          row-key="draftId"
          :datasource="url"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openCreateForm(record)">编辑</a>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <create-form ref="createForm" @rollback="rollbackCreateForm" @close="closeCreateForm" v-show="createFormShow" />
</template>

<script>
import { CategoryApi } from '@/api/workflow/CategoryApi';
import CreateForm from '@/views/workflow/draftapply/createForm';

export default {
  name: 'DraftIndex',
  components: {
    CreateForm
  },
  data() {
    return {
      // 表格数据接口
      url: '/flowableDraft/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '流程名称',
          dataIndex: 'processName'
        },
        {
          title: '分类编码',
          dataIndex: 'category'
        },
        {
          title: '分类名称',
          dataIndex: 'categoryName'
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
      // 流程分类列表
      flowableCategoryListData: [],
      // 首页是否显示
      indexPageShow: true,
      // 表单页面是否显示
      createFormShow: false
    };
  },
  async mounted() {
    this.flowableCategoryListData = await CategoryApi.categoryList();
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
     * 打开表单填写组件
     *
     * @author fengshuonan
     * @date 2021/7/10 21:25
     */
    openCreateForm(items) {
      if (items.processDefinitionId == null) {
        this.$message.warning('打开失败：表单项定义processDefinitionId不存在');
      } else {
        this.indexPageShow = false;
        this.createFormShow = true;
        this.$refs.createForm.open(items);
      }
    },

    /**
     * 普通返回
     *
     * @author fengshuonan
     * @date 2021/7/10 21:22
     */
    rollbackCreateForm() {
      this.indexPageShow = true;
      this.createFormShow = false;
    },

    /**
     * 正常操作后返回
     *
     * @author fengshuonan
     * @date 2021/7/10 21:23
     */
    closeCreateForm(values) {
      this.draftDelete(values);
      this.indexPageShow = true;
      this.createFormShow = false;
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
