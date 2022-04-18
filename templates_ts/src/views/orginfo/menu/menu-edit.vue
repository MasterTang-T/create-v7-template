<!-- 菜单编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改菜单' : '新建菜单'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 7 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 17 }, sm: { span: 24 } }"
    >
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="上级菜单" name="menuParentId">
            <a-tree-select
              v-model:value="form.menuParentId"
              style="width: 100%"
              :tree-data="menuList"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择上级菜单"
              :replaceFields="{ children: 'children', title: 'title', key: 'id', value: 'id' }"
              allow-clear
              tree-default-expand-all
            >
            </a-tree-select>
          </a-form-item>
          <a-form-item label="菜单编号" name="menuCode">
            <a-input allow-clear placeholder="请输入菜单编号" v-model:value="form.menuCode" />
          </a-form-item>
          <a-form-item label="菜单名称" name="menuName">
            <a-input allow-clear placeholder="请输入菜单名称" v-model:value="form.menuName" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="所属应用:" name="appCode">
            <a-select
              show-search
              v-model:value="form.appCode"
              placeholder="请选择所属应用"
              style="width: 100%"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              allow-clear
            >
              <a-select-option v-for="item in appList" :key="item.appCode">
                {{ item.appName }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="打开方式">
            <a-radio-group v-model:value="form.antdvLinkOpenType" @change="onAntdvLinkOpenTypeChange">
              <a-radio :value="0">组件</a-radio>
              <a-radio :value="1">内链</a-radio>
              <a-radio :value="2">外链</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <div style="margin-bottom: 22px">
        <a-divider />
      </div>
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="菜单图标" name="antdvIcon">
            <ele-icon-picker v-model:value="form.antdvIcon" placeholder="请选择菜单图标" />
          </a-form-item>

          <a-form-item name="antdvRouter">
            <template #label>
              <a-tooltip v-if="form.antdvLinkOpenType === 2" title="需要以`http://`、`https://`、`//`开头">
                <question-circle-outlined style="vertical-align: -2px; margin-right: 4px" />
              </a-tooltip>
              <a-tooltip v-if="form.antdvLinkOpenType !== 2" title="路由地址必须以`/`开头">
                <question-circle-outlined style="vertical-align: -2px; margin-right: 4px" />
              </a-tooltip>
              <span>{{ form.antdvLinkOpenType === 2 ? '外链地址' : '路由地址' }}</span>
            </template>
            <a-input
              allow-clear
              v-model:value="form.antdvRouter"
              :placeholder="form.antdvLinkOpenType === 2 ? '请输入外链地址' : '请输入路由地址'"
            />
          </a-form-item>
          <a-form-item name="antdvComponent" v-if="form.antdvLinkOpenType === 0 || form.antdvLinkOpenType === 1">
            <template #label>
              <a-tooltip v-if="form.antdvLinkOpenType === 1" title="需要以`http://`、`https://`、`//`开头">
                <question-circle-outlined style="vertical-align: -2px; margin-right: 4px" />
              </a-tooltip>
              <a-tooltip v-if="form.antdvLinkOpenType === 0" title="组件路径对应`views`目录下具体文件的路径，例如 /personal/info 对应个人信息界面的组件路径。(一级菜单且包含子菜单可为空，组件路径不能有中横线-，可以有下划线_）">
                <question-circle-outlined style="vertical-align: -2px; margin-right: 4px" />
              </a-tooltip>
              <span>{{ form.antdvLinkOpenType === 1 ? '内链地址' : '组件路径' }}</span>
            </template>
            <a-input
              allow-clear
              v-model:value="form.antdvComponent"
              :disabled="form.antdvLinkOpenType === 2"
              :placeholder="form.antdvLinkOpenType === 1 ? '请输入内链地址' : '请输入组件路径'"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="排序号:" name="menuSort">
            <a-input-number :min="0" class="ele-fluid" placeholder="请输入排序号" v-model:value="form.menuSort" />
          </a-form-item>
          <a-form-item label="是否可见">
            <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.isShow" />
            <a-tooltip title="选择不可见只注册路由不显示在侧边栏，比如添加页面应该选择不可见">
              <question-circle-outlined style="vertical-align: -3px; margin-left: 16px" />
            </a-tooltip>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import EleIconPicker from 'ele-admin-pro/packages/ele-icon-picker';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { MenuApi } from '@/api/MenuApi';

export default {
  name: 'MenuEdit',
  components: { EleIconPicker, QuestionCircleOutlined },
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        menuParentId: [{ required: true, type: 'string', message: '请选择上级菜单', trigger: 'blur' }],
        appCode: [{ required: true, type: 'string', message: '请选择所属应用', trigger: 'blur' }],
        menuCode: [{ required: true, type: 'string', message: '请输入菜单编码', trigger: 'blur' }],
        menuName: [{ required: true, type: 'string', message: '请输入菜单名', trigger: 'blur' }],
        menuSort: [{ required: true, type: 'number', message: '请输入排序号', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 菜单树
      menuList: [],
      //应用列表
      appList: []
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign(this.data, {
          menuParentId: this.data.menuParentId === 0 ? null : this.data.menuParentId,
          antdvLinkOpenType: this.data.antdvLinkOpenType === null ? 0 : this.data.antdvLinkOpenType,
          isShow: this.data.antdvVisible === 'Y' ? true : false
        });
        this.isUpdate = true;
      } else {
        this.form = {
          antdvLinkOpenType: 0,
          isShow: true
        };
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },
    visible() {
      // 查询菜单节点
      MenuApi.getMenuTree().then(res => {
        this.menuList = res;
      });
    }
  },
  async mounted() {
    // 查询菜单节点
    this.menuList = await MenuApi.getMenuTree();

    // 查询应用
    this.appList = await MenuApi.getAppDropList();
  },
  methods: {
    /**
     * 保存和编辑菜单
     *
     * @author jiawei
     * @date 2021/4/8 12:00
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 校验内链/外链格式
      if (this.form.antdvLinkOpenType === 0) {
        if (!(this.form.antdvRouter && this.form.antdvRouter.startsWith('/'))) {
          this.$message.error('路由地址格式错误');
          return;
        }
      } else if (this.form.antdvLinkOpenType === 1) {
        if (!(this.form.antdvRouter && this.form.antdvRouter.startsWith('/'))) {
          this.$message.error('路由地址格式错误');
          return;
        }
        if (!this.isUrl(this.form.antdvComponent)) {
          this.$message.error('内链格式错误');
          return;
        }
      } else if (this.form.antdvLinkOpenType === 2) {
        if (!this.isUrl(this.form.antdvRouter)) {
          this.$message.error('外链格式错误');
          return;
        }
        this.form.antdvComponent = '';
      }

      // 是否可见
      this.form.visible = this.form.isShow ? 'Y' : 'N';

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改菜单方法
      if (this.isUpdate) {
        //
        result = MenuApi.editMenu(this.form);
      } else {
        result = MenuApi.addMenu(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          this.$message.success(result.message);

          // 如果是新增菜单，则form表单置空
          if (!this.isUpdate) {
            this.form = {};
          }

          // 关闭弹框，通过控制visible的值，传递给父组件
          this.updateVisible(false);

          // 触发父组件done事件
          this.$emit('done');
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 更新编辑菜单界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author jiawei
     * @date 2021/4/7 12:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * antdvLinkOpenType 选择改变
     *
     * @author jiawei
     * @date 2021/4/7 12:00
     */
    onAntdvLinkOpenTypeChange() {},
    /* 判断是否是网址 */
    isUrl(url) {
      return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('://'));
    }
  }
};
</script>

<style scoped></style>
