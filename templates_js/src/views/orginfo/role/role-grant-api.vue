<template>
  <a-modal
    :width="1400"
    :visible="visible"
    :title="title"
    :footer="null"
    :body-style="{ backgroundColor: '#F0F2F5', padding: '5px' }"
    @update:visible="updateVisible"
  >
    <a-spin :spinning="loading">
      <div class="ele-body">
        <a-table :dataSource="dataSource" :columns="columns" :pagination="false" rowKey="code" childrenColumnName="other">
          <template #controller="{ record }">
            <a-checkbox v-model:checked="record.checked" :indeterminate="record.indeterminate" @change="checkedGroup($event, record)">
              {{ record.nodeName }}
            </a-checkbox>
          </template>
          <template #apis="{ record }">
            <a-checkbox-group :options="record.totalNodes" v-model:value="record.selectedNodes" @change="checkedItem($event, record)" />
          </template>
        </a-table>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { SysResourceApi } from '@/api/SysResourceApi';
import { SysRoleApi } from '@/api/SysRoleApi';

export default {
  name: 'SysRoleGrantApi',
  data() {
    return {
      // 页面标题，是给哪个业务分配
      title: '角色分配接口',
      // 业务的id
      businessId: '',
      // 表格数据接口
      dataSource: [],
      // 页面是否加载中，用在获取数据时
      loading: false,
      // 表格列配置
      columns: [
        {
          title: '接口分类',
          dataIndex: 'controller',
          width: 200,
          slots: { customRender: 'controller' }
        },
        {
          title: '接口列表',
          dataIndex: 'apis',
          width: 900,
          slots: { customRender: 'apis' }
        }
      ],
      // 菜单id
      menuId: null,
      // 弹框是否显示
      visible: false
    };
  },
  methods: {
    /**
     * 打开绑定资源的窗口
     *
     * @author fengshuonan
     * @date 2021/8/10 15:25
     */
    openWindow(title, businessId) {
      this.visible = true;
      this.title = title;
      this.businessId = businessId;

      // 获取表格数据
      this.loadMenuResource();
    },

    /**
     * 加载资源列表
     *
     * @author fengshuonan
     * @date 2021/8/8 23:34
     */
    async loadMenuResource() {
      // 开启加载
      this.loading = true;

      // 获取资源
      this.dataSource = await SysResourceApi.getResourceList({ roleId: this.businessId });

      // 资源整理成map
      for (const item of this.dataSource) {
        // 获取所有的子节点
        let totalNodes = [];
        for (const subItem of item.children) {
          totalNodes.push({ label: subItem.nodeName, value: subItem.code });
        }
        item.totalNodes = totalNodes;

        // 获取选中的子节点
        item.selectedNodes = item.children
          .filter(value => {
            return value.checked;
          })
          .map(value => value.code);
      }

      // 关闭加载
      this.loading = false;
    },

    /**
     * 处理选中组的事件
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    async checkedGroup(event, record) {
      // 如果是全选事件，则变为全选，如果是非全选事件则变为非全选
      if (event.target.checked) {
        record.indeterminate = false;
        record.selectedNodes = record.totalNodes.map(item => item.value);
      } else {
        record.selectedNodes = [];
      }

      // 开启加载
      this.loading = true;

      // 将选中的资源请求后端
      let modularTotalResource = record.totalNodes.map(item => item.value);
      let selectedResource = record.selectedNodes;
      await SysRoleApi.grantResource({
        roleId: this.businessId,
        modularTotalResource,
        selectedResource
      });

      // 关闭加载
      this.loading = false;
    },

    /**
     * 处理选中的节点数据
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    checkedItem(checkedValue, record) {
      let totalSelectFlag = true;

      // 获取当前行所有的code
      const totalNodes = record.totalNodes.map(item => item.value);
      for (const node of totalNodes) {
        if (!record.selectedNodes.includes(node)) {
          totalSelectFlag = false;
        }
      }

      // 如果全部选中
      if (totalSelectFlag) {
        record.checked = true;
        record.indeterminate = false;
      } else {
        record.checked = false;
        record.indeterminate = true;
      }

      // 如果全部未选中
      if (record.selectedNodes.length === 0) {
        record.indeterminate = false;
      }

      // 将选中的资源请求后端
      let modularTotalResource = record.totalNodes.map(item => item.value);
      let selectedResource = record.selectedNodes;
      SysRoleApi.grantResource({
        roleId: this.businessId,
        modularTotalResource,
        selectedResource
      });
    },

    /**
     * 更新按钮管理界面的弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/8/8 23:34
     */
    updateVisible(value) {
      this.visible = value;
    }
  }
};
</script>