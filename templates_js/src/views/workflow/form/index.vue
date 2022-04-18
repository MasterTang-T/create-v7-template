<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="表单名称">
              <a-input v-model:value.trim="where.name" placeholder="请输入表单名称" allow-clear />
            </a-form-item>
            <a-form-item label="唯一编码">
              <a-input v-model:value.trim="where.code" placeholder="请输入唯一编码" allow-clear />
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
          row-key="formResourceId"
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

          <!-- 表单分类 -->
          <template #category="{ text }">
            {{ getCategoryName(text) }}
          </template>

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openPreview(record)">预览</a>
              <a-divider type="vertical" />
              <a @click="openDesign(record)">设计</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  更多
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a @click="openEdit(record)">编辑</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="remove(record)">删除</a>
                    </a-menu-item>
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
  <simple-form-edit v-model:visible="showEdit" :data="current" @done="reload" />
  <!-- 预览弹窗 -->
  <simple-form-preview v-model:visible="showPreview" :data="current" @done="reload" />
  <!-- 设计弹窗 -->
  <simple-form-design v-model:visible="showDesign" :data="current" @done="reload" />
</template>

<script>
import { PlusOutlined, DownOutlined } from '@ant-design/icons-vue';
import SimpleFormEdit from '@/views/workflow/form/simple-form-edit';
import SimpleFormPreview from '@/views/workflow/form/simple-form-preview';
import SimpleFormDesign from '@/views/workflow/form/simple-form-design';
import { CategoryApi } from '@/api/workflow/CategoryApi';
import { FormResourceApi } from '@/api/workflow/FormResourceApi';

export default {
  name: 'FormIndex',
  components: {
    SimpleFormEdit,
    SimpleFormPreview,
    PlusOutlined,
    DownOutlined,
    SimpleFormDesign
  },
  data() {
    return {
      // 表格数据接口
      url: '/flowableFormResource/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '表单名称',
          dataIndex: 'formResourceName'
        },
        {
          title: '唯一编码',
          dataIndex: 'formResourceCode'
        },
        {
          title: '表单分类',
          dataIndex: 'category',
          slots: { customRender: 'category' }
        },
        {
          title: '备注',
          dataIndex: 'remark'
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
      // 是否显示预览弹窗
      showPreview: false,
      // 是否显示设计弹窗
      showDesign: false,
      // 表单分类
      flowableCategoryListData: []
    };
  },
  mounted() {
    // 获取分类列表
    CategoryApi.categoryList().then(data => {
      this.flowableCategoryListData = data;
    });
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
      const result = await FormResourceApi.del({ formResourceId: row.formResourceId });
      this.$message.success(result.message);
      this.reload();
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
     * 打开预览弹窗
     *
     * @author wangyh
     * @date 2021/7/15 10:48
     */
    openPreview(row) {
      this.current = row;
      this.showPreview = true;
    },
    /**
     * 打开设计弹窗
     *
     * @author wangyh
     * @date 2021/7/15 11:09
     */
    openDesign(row) {
      this.current = row;
      this.showDesign = true;
    },
    /**
     * 通过分类code获取分类名称
     *
     * @author fengshuonan
     * @date 2021/7/1 18:43
     */
    getCategoryName(text) {
      const values = this.flowableCategoryListData.filter(item => item.categoryCode === text);
      if (values.length > 0) {
        return values[0].categoryName;
      }
    },

    /**
     * 打开表单预览
     *
     * @author fengshuonan
     * @date 2021/7/1 18:43
    
    openPreview(record) {
      console.log(record);
    },
 */
    /**
     * 打开表单设计界面
     *
     * @author fengshuonan
     * @date 2021/7/1 18:43
    
    async openDesign(record) {
      // 获取表单设计的详情
      let promise = await FormResourceApi.formResourceDetail({ formResourceId: record.formResourceId });
      console.log(promise);
    },
 */
    /**
     * 打开表单设计界面
     *
     * @author fengshuonan
     * @date 2021/7/1 18:43
     */
    async saveDesign(record) {
      // 获取表单设计的详情
      let promise = await FormResourceApi.formResourceDetail({ formResourceId: record.formResourceId });
      console.log(promise);
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