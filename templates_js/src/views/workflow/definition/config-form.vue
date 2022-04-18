<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="dashed" @click="returnPage">
        <RollbackOutlined />
        返回
      </a-button>
    </div>
    <a-spin :spinning="confirmLoading">
      <a-tabs defaultActiveKey="option" :activeKey="this.defOpen" @change="changeTabCallback">
        <a-tab-pane key="option" tab="选项" force-render>
          <option-index ref="optionIndex" />
        </a-tab-pane>

        <a-tab-pane key="button" tab="按钮" force-render>
          <button-index ref="buttonIndex" />
        </a-tab-pane>

        <a-tab-pane key="event" tab="事件" force-render>
          <event-index ref="eventIndex" />
        </a-tab-pane>

        <a-tab-pane key="form" tab="表单" force-render>
          <form-index ref="formIndex" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-card>
</template>

<script>
import optionIndex from './configs/option/index';
import buttonIndex from './configs/button/index';
import eventIndex from './configs/event/index';
import formIndex from './configs/form/index';
import { RollbackOutlined } from '@ant-design/icons-vue';

export default {
  name: 'DefinitionConfigForm',
  components: {
    optionIndex,
    buttonIndex,
    eventIndex,
    formIndex,
    RollbackOutlined
  },
  emits: ['done'],
  data() {
    return {
      record: {},
      confirmLoading: false,
      defOpen: 'option'
    };
  },
  methods: {
    /**
     * 初始化整个界面
     *
     * @author fengshuonan
     * @date 2021/6/26 23:24
     */
    initPage(config) {
      this.record = config;
      setTimeout(() => {
        this.$refs.optionIndex.optionIndex(this.record.id);
      }, 100);
    },

    /**
     * 返回上个界面
     *
     * @author fengshuonan
     * @date 2021/6/26 23:24
     */
    returnPage() {
      this.$emit('done');
      this.clearCache();
    },

    /**
     * 切换tab标签的回调
     *
     * @author fengshuonan
     * @date 2021/6/26 23:29
     */
    changeTabCallback(key) {
      this.defOpen = key;
      if (key === 'option') {
        this.$refs.optionIndex.optionIndex(this.record.id);
        this.$refs.buttonIndex.handleCancel();
        // this.$refs.eventIndex.handleCancel();
        // this.$refs.formIndex.handleCancel();
      }
      if (key === 'button') {
        this.$refs.buttonIndex.buttonIndex(this.record);
        this.$refs.optionIndex.handleCancel();
        // this.$refs.eventIndex.handleCancel();
        // this.$refs.formIndex.handleCancel();
      }
      if (key === 'event') {
        this.$refs.eventIndex.eventIndex(this.record);
        this.$refs.buttonIndex.handleCancel();
        this.$refs.optionIndex.handleCancel();
        // this.$refs.formIndex.handleCancel();
      }
      if (key === 'form') {
        this.$refs.formIndex.formIndex(this.record);
        this.$refs.buttonIndex.handleCancel();
        this.$refs.optionIndex.handleCancel();
        // this.$refs.eventIndex.handleCancel();
      }
    },

    /**
     * 清理此界面缓存
     *
     * @author fengshuonan
     * @date 2021/6/26 23:29
     */
    clearCache() {
      this.defOpen = 'option';
      if (this.$refs.optionIndex !== undefined) {
        this.$refs.optionIndex.handleCancel();
      }
      // if (this.$refs.buttonIndex !== undefined) {
      //   this.$refs.buttonIndex.handleCancel();
      // }
      // if (this.$refs.eventIndex !== undefined) {
      //   this.$refs.eventIndex.handleCancel();
      // }
      // if (this.$refs.formIndex !== undefined) {
      //   this.$refs.formIndex.handleCancel();
      // }
    }
  }
};
</script>
