<!-- 顶栏消息通知图标 -->
<template>
  <a-dropdown v-model:visible="visible" :trigger="['click']">
    <a-badge :count="allNum" class="ele-notice-trigger">
      <bell-outlined style="padding: 6px;"/>
    </a-badge>
    <template #overlay>
      <div class="ant-dropdown-menu ele-notice-pop">
        <div @click.stop="">
          <a-tabs v-model:active-key="active">
            <a-tab-pane key="notice" :tab="noticeTitle" force-render>
              <a-list item-layout="horizontal" :data-source="notice.unReadNoticeList">
                <template #renderItem="{item}">
                  <a-list-item>
                    <a-list-item-meta :title="item.messageTitle" :description="item.messageSendTime" @click="noticeDetail(item)">
                      <template #avatar>
                        <a-avatar :style="{ background: noticeColor }">
                          <template #icon>
                            <component :is="noticeIcon" />
                          </template>
                        </a-avatar>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
              <div v-if="notice.unReadNoticeList.length" class="ele-cell ele-notice-actions">
                <div @click="clear()" class="ele-cell-content">清空通知</div>
                <a-divider type="vertical" />
                <div @click="more()" class="ele-cell-content">查看更多</div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </template>
  </a-dropdown>

  <a-modal v-model:visible="noticeDetailShow" :title="noticeDetailObject.messageTitle" @ok="closeDetail" :footer="null">
    <p>{{ noticeDetailObject.messageContent }}</p>
  </a-modal>
</template>

<script>
import { BellOutlined, NotificationFilled } from '@ant-design/icons-vue';
import { NoticeApi } from '@/api/NoticeApi';
import { mapState } from 'vuex';

export default {
  name: 'EleNotice',
  components: {
    NotificationFilled,
    BellOutlined
  },
  data() {
    return {
      // 消息通知下拉框的显示和隐藏
      visible: false,
      // 默认激活的tab的名称
      active: 'notice',
      // 消息通知的颜色
      noticeColor: '#60B2FC',
      // 通知图标的演示
      noticeIcon: 'NotificationFilled',
      // 是否显示通知详情
      noticeDetailShow: false,
      // 通知详情的内容
      noticeDetailObject: {
        messageTitle: '',
        messageContent: ''
      }
    };
  },
  async mounted() {
    // 获取用户所有的未读消息
    let noticeList = await NoticeApi.getUnReadMessages();
    this.$store.dispatch('notice/setNotice', noticeList);
  },
  computed: {
    // 通知标题
    noticeTitle() {
      let length = this.$store.state.notice.unReadNoticeList.length;
      if (length) {
        return `通知(${length})`;
      }
      return '通知';
    },

    // 所有消息数量
    allNum() {
      return this.$store.state.notice.unReadNoticeList.length;
    },

    // 消息列表
    ...mapState(['notice'])
  },
  methods: {
    /**
     * 清空消息
     *
     * @author fengshuonan
     * @date 2021/6/12 18:18
     */
    clear() {
      this.$store.dispatch('notice/setNotice', []);

      // 调用接口，全部标记为已读
      NoticeApi.messageSetRead();
    },

    /**
     * 查看更多
     *
     * @author fengshuonan
     * @date 2021/6/12 18:18
     */
    more() {
      this.$router.push('/notice/mynotice');
      this.visible = false;
    },

    /**
     * 查看更多
     *
     * @author fengshuonan
     * @date 2021/6/12 18:18
     */
    noticeDetail(messageObject) {
      this.noticeDetailObject.messageTitle = messageObject.messageTitle;
      this.noticeDetailObject.messageContent = messageObject.messageContent;
      this.noticeDetailShow = true;

      // 更新消息为已读状态
      let param = { messageIdList: [messageObject.messageId] };
      NoticeApi.batchUpdateReadFlag(param);

      // 移除数组中已读消息
      this.$store.dispatch('notice/removeMessage', messageObject.messageId);
    },

    /**
     * 关闭消息详情对话框
     *
     * @author fengshuonan
     * @date 2021/6/12 18:18
     */
    closeDetail() {
      this.noticeDetailShow = false;
    }
  }
};
</script>

<style>
.ele-notice-trigger.ant-badge {
  color: inherit;
}

.ele-notice-pop.ant-dropdown-menu {
  padding: 0;
  width: 336px;
  max-width: 100%;
  margin-top: 11px;
}

/* 内容 */
.ele-notice-pop .ant-tabs-nav-wrap {
  text-align: center;
}

.ele-notice-pop .ant-list-item {
  padding-left: 24px;
  padding-right: 24px;
  transition: background-color .3s;
  cursor: pointer;
}

.ele-notice-pop .ant-list-item:hover {
  background: hsla(0, 0%, 60%, .05);
}

.ele-notice-pop .ant-tag {
  margin: 0;
}

/* 操作按钮 */
.ele-notice-pop .ele-notice-actions {
  border-top: 1px solid hsla(0, 0%, 60%, .15);
}

.ele-notice-pop .ele-notice-actions > .ele-cell-content {
  line-height: 46px;
  text-align: center;
  transition: background-color .3s;
  cursor: pointer;
}

.ele-notice-pop .ele-notice-actions > .ele-cell-content:hover {
  background: hsla(0, 0%, 60%, .05);
}
</style>
