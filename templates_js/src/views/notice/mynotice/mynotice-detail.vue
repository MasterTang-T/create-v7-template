<!-- 我的消息详情 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    title="通知详情"
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
        <a-input placeholder="请输入通知标题" v-model:value="form.messageTitle" />
      </a-form-item>

      <a-form-item label="内容">
        <tinymce v-model="form.messageContent" :disabled='true'></tinymce>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import Tinymce from '@/components/TinymceEditor/index';
import { NoticeApi } from '@/api/NoticeApi';

export default {
  name: 'MynoticeDetail',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 上级组件传来的数据
    data: Object
  },
  components: { Tinymce },
  data() {
    return {
      // 表单数据
      form: Object.assign(
        {
          noticeTitle: '',
          noticeContent: ''
        },
        this.data
      )
    };
  },
  watch: {
    async visible() {
      if (this.data) {
        let messageId = this.data.messageId;
        let result = await NoticeApi.messageDetail({ messageId });
        this.form = Object.assign({}, result);
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  methods: {
    /**
     * 点击确定
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    async save() {
      this.updateVisible(false);
    },

    /**
     * 更新编辑界面弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
      this.$emit('done');
    }
  }
};
</script>

<style scoped></style>
