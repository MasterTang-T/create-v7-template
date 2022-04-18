<!-- 应用编辑弹窗 -->
<template>
  <a-modal :width="windowWidth - 30" :visible="visible" :footer="null" centered @update:visible="updateVisible">
    <a-spin :spinning="spinning">
      <iframe scrolling="yes" id="form-design-iframe" width="100%" frameborder="0" :height="windowHeight" :src="iframeSrc"></iframe>
    </a-spin>
  </a-modal>
</template>

<script>
import store from 'storejs';

export default {
  name: 'SimpleFormDesign',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  created() {
    this.token = store.get('access_token');
  },
  mounted() {
    this.spinning = false;
  },

  computed: {
    iframeSrc() {
      return (
        `${process.env.VUE_APP_FORM_ENGINE_HOST}/FormEdit/` +
        this.token +
        '/' +
        this.cData?.formResourceId +
        '/' +
        this.cData?.formResourceName +
        '/' +
        this.cData?.category +
        '/' +
        this.cData?.formResourceCode +
        '/' +
        Math.floor(Math.random() * 10000) +
        1
      );
    }
  },

  data() {
    return {
      token: '123',
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight, //实时屏幕高度
      formResourceId: '',
      cData: {},
      spinning: true
    };
  },
  watch: {
    data: function(newVal) {
      this.cData = newVal; //更新传进来的data
    }
  },
  methods: {
    /**
     * 更新编辑界面的弹框是否显示
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

<style scoped></style>
