<!-- 预览弹窗 -->
<template>
  <a-modal :visible="visible" :body-style="bodyStyle" :footer="null" @update:visible="updateVisible" width="1000px">
    <iframe class="frame" scrolling="yes" id="formPreviewIframe" width="95%" height="95%" frameborder="0" :src="iframeSrc"></iframe>
  </a-modal>
</template>

<script>
import store from 'storejs';

export default {
  name: 'SimpleFormPreview',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  created() {
    this.token = store.get('access_token');
    window.addEventListener('message', e => {
      if (e.data && e.data.height) {
        this.bodyStyle.height = e.data.height + 80 + 'px';
      }
    });
  },

  computed: {
    iframeSrc() {
      return (
        `${process.env.VUE_APP_FORM_ENGINE_HOST}/FormPreView/` +
        this.token +
        '/' +
        this.cData?.formResourceId +
        '/' +
        Math.floor(Math.random() * 10000) +
        1
      );
    }
  },

  data() {
    return {
      token: '123',
      bodyStyle: {
        margin: '0',
        padding: '10px'
      },
      formResourceId: '',
      cData: {}
    };
  },
  watch: {
    data: function(newVal) {
      this.cData = newVal; //更新传进来的data
    }
  },
  methods: {
    /**
     * 弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author wangyh
     * @date 2021/7/14 18:03
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped>
.frame {
  padding-top: 30px;
  padding-left: 30px;
}
</style>
