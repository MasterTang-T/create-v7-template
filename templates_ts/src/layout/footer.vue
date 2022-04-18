<!-- 页脚 -->
<template>
  <div class="ele-text-center" style="padding: 16px 0;">
    <a-space size="large">
      <a
        class="ele-text-secondary"
        href="https://www.stylefeng.cn"
        target="_blank">
        {{ $t('layout.footer.website') }}
      </a>
      <a
        class="ele-text-secondary"
        href="https://www.stylefeng.cn"
        target="_blank">
        {{ $t('layout.footer.document') }}
      </a>
      <a
        class="ele-text-secondary"
        href="https://www.stylefeng.cn"
        target="_blank">
        {{ $t('layout.footer.authorization') }}
      </a>
    </a-space>
    <div class="ele-text-secondary" style="margin-top: 8px;">
      {{ $t('layout.footer.copyright') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'EleFooter'
}
</script>
