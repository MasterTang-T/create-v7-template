<template>
  <div>
    <!--模型管理界面-->
    <div class="ele-body" v-show="indexPageShow">
      <!-- 搜索表单 -->
      <div class="block-interval">
        <a-card :bordered="false">
          <a-form layout="inline" :model="where">
            <a-row>
              <a-form-item label="定义KEY:">
                <a-input v-model:value="where.key" placeholder="请输入定义KEY" allow-clear />
              </a-form-item>
              <a-form-item label="定义名称:">
                <a-input v-model:value="where.name" placeholder="请输入定义名称" allow-clear />
              </a-form-item>
              <a-form-item label="流程分类">
                <a-select v-model:value="where.category" placeholder="请选择流程分类" style="width: 210px" allow-clear>
                  <a-select-option v-for="(item, index) in flowableCategoryListData" :key="index" :value="item.categoryCode"
                    >{{ item.categoryName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="挂起状态">
                <a-select v-model:value="where.suspended" placeholder="请选择挂起状态" style="width: 210px" allow-clear>
                  <a-select-option value="true">是</a-select-option>
                  <a-select-option value="false">否</a-select-option>
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
            <!-- 版本 -->
            <template #version="{ record }"> V{{ record.version }}.0</template>

            <!-- 是否激活和挂起 -->
            <template #suspended="{ record }">
              <a-switch :checked="record.suspended" @change="checked => editActive(checked, record)" />
            </template>

            <!-- table操作栏按钮 -->
            <template #action="{ record }">
              <a-space>
                <a @click="$refs.tracking.initModel(record.id)">追踪</a>
                <a-divider type="vertical" />
                <a-popconfirm placement="topRight" title="将该定义映射到模型设计？" @confirm="() => flowableDefinitionMapping(record)">
                  <a>映射</a>
                </a-popconfirm>
                <a-divider type="vertical" />
                <a-dropdown>
                  <a class="ant-dropdown-link" @click.prevent>
                    更多
                    <DownOutlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a @click="openConfig(record)">配置</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="$refs.apply.initModel(record)">应用</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="flowableDefinitionExport(record)">导出</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a-popconfirm
                          title="删除流程定义会将该定义下的所有流程数据删除，若不使用该流程定义可挂起，是否继续删除？"
                          @confirm="remove(record)"
                        >
                          <a class="ele-text-danger">删除</a>
                        </a-popconfirm>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </ele-pro-table>
        </a-card>
      </div>

      <!--流程追踪页面-->
      <definition-tracking ref="tracking"></definition-tracking>

      <!--应用到入口界面-->
      <apply-entrance ref="apply"></apply-entrance>
    </div>

    <!--模型配置界面-->
    <div class="ele-body" v-show="configFormShow">
      <definition-config-form ref="configForm" @done="closeConfigForm"></definition-config-form>
    </div>
  </div>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue';
import { DefinitionApi } from '@/api/workflow/DefinitionApi';
import { CategoryApi } from '@/api/workflow/CategoryApi';
import DefinitionTracking from '@/views/workflow/definition/tracking';
import DefinitionConfigForm from '@/views/workflow/definition/config-form';
import ApplyEntrance from '@/views/workflow/definition/apply-entrance';
import setting from '@/config/setting';

export default {
  name: 'Category',
  components: {
    ApplyEntrance,
    DefinitionConfigForm,
    DefinitionTracking,
    DownOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/flowableDefinition/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '定义名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '定义KEY',
          align: 'center',
          dataIndex: 'key'
        },
        {
          title: '版本',
          dataIndex: 'version',
          align: 'center',
          slots: { customRender: 'version' }
        },
        {
          title: '流程分类',
          align: 'center',
          dataIndex: 'categoryName'
        },
        {
          title: '是否挂起',
          align: 'center',
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
      // 是否显示模型管理界面
      indexPageShow: true,
      // 是否显示版本管理界面
      configFormShow: false,
      // 流程分类下拉列表
      flowableCategoryListData: []
    };
  },
  async created() {
    // 初始化
    this.flowableCategoryListData = await CategoryApi.categoryList();
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 删除
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    async remove(row) {
      const result = await DefinitionApi.delete(row);
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 打开新增或编辑弹窗
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 设置激活和挂起应用
     *
     * @author fengshuonan
     * @date 2021/4/2 17:04
     */
    async editActive(checked, row) {
      row.suspended = checked;
      let result = {};
      if (checked) {
        result = await DefinitionApi.suspend(row);
      } else {
        result = await DefinitionApi.active(row);
      }
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 映射模型
     *
     * @author fengshuonan
     * @date 2021/6/26 23:01
     */
    flowableDefinitionMapping(record) {
      DefinitionApi.mapping({ id: record.id }).then(() => {
        this.$message.success('映射成功');
      });
    },

    /**
     * 打开流程定义配置界面
     *
     * @author fengshuonan
     * @date 2021/6/26 23:10
     */
    openConfig(record) {
      this.indexPageShow = false;
      this.configFormShow = true;
      this.$refs.configForm.initPage(record);
    },

    /**
     * 关闭流程定义配置界面
     *
     * @author fengshuonan
     * @date 2021/6/26 23:34
     */
    closeConfigForm() {
      this.indexPageShow = true;
      this.configFormShow = false;
      this.reload();
    },

    /**
     * 导出流程定义
     *
     * @author fengshuonan
     * @date 2021/7/2 22:32
     */
    flowableDefinitionExport(record) {
      window.open(`/api/flowableDefinition/export?id=${record.id}&token=${setting.takeToken()}`, '_blank');
    }
  }
};
</script>
