<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="发起人:">
              <a-input v-model:value.trim="where.appName" placeholder="请输入发起人" allow-clear />
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
          row-key="id"
          :datasource="url"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >
          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="tracking(record)">追踪</a>
              <a-divider type="vertical" />
              <a @click="openForm(record)">表单</a>
            </a-space>
          </template>
        </ele-pro-table>
        <common-tracking ref="tracking" />
        <!-- 表单弹窗 -->
        <form-com-data v-model:visible="showForm" :data="current" @done="reload" />
      </a-card>
    </div>
  </div>
</template>

<script>
import { CategoryApi } from '@/api/workflow/CategoryApi';
import CommonTracking from '@/views/workflow/tracking/common-tracking';
import FormComData from '@/views/workflow/instance/form-com-data';
// import { FormResourceApi } from '@/api/workflow/FormResourceApi';

export default {
  name: 'InstanceIndex',
  components: { CommonTracking, FormComData },
  data() {
    return {
      // 表格数据接口
      url: '/flowableInstance/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '流程名称',
          dataIndex: 'name'
        },
        {
          title: '发起人',
          dataIndex: 'startUserName'
        },
        {
          title: '发起时间',
          dataIndex: 'formatStartTime'
        },
        {
          title: '结束时间',
          dataIndex: 'formatEndTime'
        },
        {
          title: '是否结束',
          dataIndex: 'ended',
          slots: { customRender: 'ended' }
        },
        {
          title: '是否挂起',
          dataIndex: 'suspended',
          slots: { customRender: 'suspended' }
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
      // 是否显示表单弹窗
      showForm: false,
      // 流程分类列表
      flowableCategoryListData: []
    };
  },
  async mounted() {
    this.flowableCategoryListData = await CategoryApi.categoryList();
  },
  methods: {
    /**
     * 搜索按钮
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
     * 打开追踪窗口
     *
     * @author fengshuonan
     * @date 2021/7/15 22:38
     */
    tracking(row) {
      this.$refs.tracking.tracking(row.id);
    },

    /**
     * 打开表单窗口
     *
     * @author fengshuonan
     * @date 2021/7/15 22:38
     
    async openForm(row) {
      let promise1 = await FormResourceApi.globalFormData({ processDefinitionId: row.procDef.id });
      console.log(promise1);

      let promise2 = await FormResourceApi.formData({ id: row.id });
      console.log(promise2);
    }
    */

    openForm(row) {
      this.current = row;
      this.showForm = true;
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
