<template>
  <a-modal
    title='模型预览'
    :width='900'
    :visible='visible'
    :confirmLoading='confirmLoading'
    :footer='null'
    @cancel='handleCancel'
  >
    <a-spin :spinning='confirmLoading'>
      <div style='background:rgb(0, 32, 64); color:#FFF'>
        {{ previewData }}
      </div>
    </a-spin>
  </a-modal>
</template>
<script>

import { ModelApi } from '@/api/workflow/ModelApi';

export default {
  name: 'ModelPreview',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      previewData: ''
    };
  },
  methods: {
    /**
     * 打开模型预览的弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 11:51
     */
    initModel(record) {
      this.visible = true;
      this.confirmLoading = true;
      ModelApi.modelPreview({ id: record.id }).then((res) => {
        this.confirmLoading = false;
        this.previewData = res;
      });
    },

    /**
     * 关闭弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 11:51
     */
    handleCancel() {
      this.previewData = '';
      this.visible = false;
    }
  }
};
</script>
