<template>
  <a-modal
    :width="1400"
    title="分配权限"
    :visible="visible"
    :footer="null"
    :body-style="{ backgroundColor: '#F0F2F5', padding: '5px' }"
    @update:visible="updateVisible"
  >
    <a-spin :spinning="authLoading">
      <div class="ele-body">
        <a-table
          v-if="authData && authData.length"
          :dataSource="authData"
          :columns="columns"
          :pagination="false"
          rowKey="id"
          :defaultExpandAllRows="true"
        >
          <template #menu="{ record }">
            <a-checkbox v-model:checked="record.checked" @change="checkedGroup($event, record)">
              {{ record.name }}
            </a-checkbox>
          </template>
          <template #button="{ record }">
            <a-checkbox-group :options="record.totalNodes" v-model:value="record.selectedNodes" @change="checkedItem($event, record)" />
          </template>
        </a-table>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { SysRoleApi } from '@/api/SysRoleApi';
import { SysMenuApi } from '@/api/SysMenuApi';

export default {
  name: 'RoleGrantMenuButton',
  data() {
    return {
      // 是否显示本弹框
      visible: false,
      // 当前绑定菜单的角色id
      roleId: '',
      // 权限数据
      authData: [],
      // 权限数据请求状态
      authLoading: false,
      // 表格列配置
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'menu',
          slots: { customRender: 'menu' }
        },
        {
          title: '按钮集合',
          dataIndex: 'button',
          slots: { customRender: 'button' }
        }
      ]
    };
  },
  methods: {
    /**
     * 打开绑定菜单和按钮的窗口
     *
     * @author fengshuonan
     * @date 2021/8/10 15:25
     */
    openWindow(roleId) {
      this.visible = true;
      this.roleId = roleId;

      // 获取表格数据
      this.loadAuthData();
    },

    /**
     * 查询权限数据
     *
     * @author fengshuonan
     * @date 2021/8/10 21:20
     */
    async loadAuthData() {
      this.authData = [];
      this.expandKeys = [];
      this.checkedKeys = [];
      this.authLoading = true;

      let roleId = this.roleId;
      this.authData = await SysMenuApi.getMenuList({ roleId });

      // 遍历树节点每个节点，处理增加属性totalNodes和selectedNodes
      this.$util.eachTreeData(
        this.authData,
        item => {
          // 获取所有的子节点
          let totalNodes = [];
          for (const subItem of item.buttons) {
            totalNodes.push({ label: subItem.name, value: subItem.id });
          }
          item.totalNodes = totalNodes;

          // 获取选中的子节点
          item.selectedNodes = item.buttons
            .filter(value => {
              return value.checked;
            })
            .map(value => value.id);
        },
        'children'
      );

      // 去掉没用的children
      this.$util.eachTreeData(this.authData, d => {
        if (d?.children.length === 0) {
          d.children = null;
        }
      });

      this.authLoading = false;
    },

    /**
     * 处理选中组的事件
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    async checkedGroup(event, record) {
      let addFlag = event.target.checked;
      await SysRoleApi.grantMenu({ roleId: this.roleId, grantAddMenuFlag: addFlag, grantMenuId: record.id });
      this.$message.success('分配菜单成功');
    },

    /**
     * 处理选中的节点数据
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    async checkedItem(checkedValue, record) {
      let modularButtonIds = record.totalNodes.map(item => item.value);
      let selectedButtonIds = record.selectedNodes;
      await SysRoleApi.grantButton({ roleId: this.roleId, modularButtonIds, selectedButtonIds });
      this.$message.success('分配按钮成功');
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
