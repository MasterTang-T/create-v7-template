<!-- 通知新建/编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改通知' : '新建通知'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="form"
      :model="form"
      :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
    >
      <a-form-item label="通知标题">
        <a-input placeholder="请输入通知标题" v-model:value="form.noticeTitle" />
      </a-form-item>

      <a-form-item label="内容">
        <tinymce v-model="form.noticeContent"></tinymce>
      </a-form-item>

      <a-form-item label="通知范围">
        <a-radio-group default-value="all" v-model:value="noticeScopeType" :disabled="isUpdate" button-style="solid">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="part">部分</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item v-if="noticeScopeType === 'part'" label="通知到的人">
        <a-transfer
          :disabled="isUpdate"
          :data-source="userList"
          show-search
          :list-style="{
            width: '40%',
            height: '300px'
          }"
          :targetKeys="targetKeys"
          :render="item => item.title"
          @change="handleChange"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import PublishApi from '@/api/PublishApi';
import { UserApi } from '@/api/UserApi';
import Tinymce from '@/components/TinymceEditor/index';

export default {
  name: 'PublishEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: { Tinymce },
  data() {
    return {
      // 表单数据
      form: Object.assign(
        {
          // all 或者是 用户id的集合逗号分割
          noticeScope: '',
          noticeTitle: '',
          noticeSummary: '',
          priorityLevel: '',
          noticeBeginTime: '',
          noticeEndTime: '',
          noticeContent: ''
        },
        this.data
      ),
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 通知人数的类型，全部还是部分
      noticeScopeType: 'all',
      // 选中的人
      targetKeys: [],
      // 用户列表
      userList: []
    };
  },
  watch: {
    visible() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }

      // 如果是新增，则置空输入项
      if (!this.isUpdate) {
        this.form.noticeContent = '';
        this.noticeScopeType = 'all';
        this.targetKeys = [];
      }

      // 初始化选项和通知的人范围
      if (this.isUpdate) {
        if (this.data.noticeScope === 'all') {
          this.noticeScopeType = 'all';
        } else if (!this.data.noticeScope.includes(',')) {
          this.noticeScopeType = 'part';
          this.targetKeys = [this.data.noticeScope];
        } else if (this.data.noticeScope.includes(',')) {
          this.noticeScopeType = 'part';
          this.targetKeys = this.data.noticeScope.split(',');
        }
      }
    }
  },
  mounted() {
    // 查询用户列表
    this.getUserList();
  },
  methods: {
    /**
     * 获取通知的用户列表
     *
     * @author fengshuonan
     * @date 2021/6/14 20:23
     */
    getUserList() {
      UserApi.getUserList({}).then(res => {
        this.userList = res.data.rows;
        this.userList = this.userList.map(item => ({
          key: item.userId,
          title: item.nickName,
          description: item.account,
          disabled: false
        }));
      });
    },

    /**
     * 选中人员时的监听
     *
     * @author fengshuonan
     * @date 2021/6/14 20:23
     */
    handleChange(targetKeys) {
      this.targetKeys = targetKeys;
    },

    /**
     * 发布通知
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    async save() {
      this.loading = true;

      // 如果noticeScopeType是all，则noticeScope参数填写all
      if (this.noticeScopeType === 'all') {
        this.form.noticeScope = 'all';
      } else {
        // 如果noticeScopeType是part，则用逗号分割每个人的id
        this.form.noticeScope = this.targetKeys.join(',');
      }

      try {
        let res;
        if (this.isUpdate) {
          res = await PublishApi.editPublish(this.form);
        } else {
          res = await PublishApi.addPublish(this.form);
        }

        this.loading = false;
        this.$message.success(res.message);
        if (!this.isUpdate) {
          this.form = {};
        }
        this.updateVisible(false);
        this.$emit('done');
      } catch (error) {
        this.loading = false;
      }
    },

    /**
     * 更新编辑界面弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
