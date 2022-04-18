<template>
  <div>{{ store.name }}</div>
</template>
<script lang='ts'>
import { defineComponent } from 'vue';
import { useStore } from '@/pinia/index';
export default defineComponent({
  setup() {
    const store:any = useStore();
    return {
      store
    };
  }
});
</script>
<style scoped lang='less'>
</style>