<!-- 角色编辑弹窗 -->
<template>
  <a-modal
    :width="600"
    :visible="visible"
    :confirm-loading="loading"
    :title="'授权数据'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 5 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 19 }, sm: { span: 24 } }"
    >
      <a-form-item label="数据范围:" name="dataScopeType">
        <a-select
          show-search
          v-model:value="form.dataScopeType"
          placeholder="请选择数据范围"
          allow-clear
        >
          <a-select-option v-for="item in scopeData" :key="item.code">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="机构范围:" v-show="form.dataScopeType === 40">
        <a-tree
          checkable
          :checkStrictly='true'
          :tree-data="orgData"
          :v-show="form.dataScopeType === 1"
          :replaceFields="{
            children: 'children',
            title: 'name',
            key: 'id',
            value: 'pId',
          }"
          v-model:expandedKeys="expandKeys"
          v-model:checkedKeys="checkedKeys"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {SysRoleApi} from '@/api/SysRoleApi';
  import {OrganizationApi} from '@/api/OrganizationApi';
  export default {
    name: "SystemRoleData",
    emits: ["done", "update:visible"],
    props: {
      // 弹窗是否打开
      visible: Boolean,
      // 修改回显的数据
      data: Object,
    },
    data() {
      return {
        // 表单数据
        form: Object.assign({}, this.data),
        // 表单验证规则
        rules: {
          dataScopeType: [
            {
              required: true,
              message: "请选择数据范围",
              type: "number",
              trigger: "blur",
            },
          ],
        },

        scopeData: [
          { code: 10, name: "仅本人数据" },
          { code: 20, name: "本部门数据" },
          { code: 30, name: "本部门及以下数据" },
          { code: 40, name: "指定部门数据" },
          { code: 50, name: "全部数据" },
        ],
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false,
        // 权限展开的keys
        expandKeys: [],
        // 角色权限选中的keys
        checkedKeys: [],
        // 部门数据
        orgData: [],
      };
    },
    watch: {
      data() {
        if (this.data) {
          this.form = Object.assign({}, this.data);
          this.isUpdate = true;
        } else {
          this.form = {};
          this.isUpdate = false;
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      },
       visible() {
         if (this.visible) {
           this.query();
         }

      },
    },

    methods: {
      query() {

        let roleId = this.data.roleId;
        OrganizationApi.tree({roleId}).then((res) => {

          // 加载框
          this.authLoading = false;

          if (res.success) {
            let treeExpandKeys = [], treeCheckedKeys = [];

            // 只展开组织机构树的顶级节点
            res.data.forEach(data => {
              treeExpandKeys.push(data.id);
            });

            // 组织机构数据赋值
            this.orgData = res.data;

            // 遍历所有节点，所有选中的节点搜集起来
            this.$util.eachTreeData(this.orgData, (d) => {
              if (d.checked) {
                treeCheckedKeys.push(d.id);
              }
            });

            this.expandKeys = treeExpandKeys;
            this.checkedKeys = treeCheckedKeys;

          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((e) => {
          this.authLoading = false;
          this.$message.error(e.message);
        });
      },
      // 保存编辑
      async save() {
        // 校验表单
        await this.$refs.form.validate();
        // 加载中
        this.loading = true;

        // 获取部门树选择数据
        let ids = this.checkedKeys?.checked;
        await SysRoleApi.grantDataScope({
          roleId: this.data.roleId,
          grantOrgIdList: ids,
          dataScopeType: this.form.dataScopeType,
        })
          .then((res) => {
            // 移除加载框
            this.loading = false;
            if (res.success) {
              this.$message.success(res.message);
              if (!this.isUpdate) {
                this.form = {};
              }
              this.updateVisible(false);
              this.$emit("done");
            } else {
              this.$message.error("操作失败：" + res.message);
            }
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      },
      /* 更新visible */
      updateVisible(value) {
        this.$emit("update:visible", value);
      },
    },
  };
</script>

<style scoped>
</style>
