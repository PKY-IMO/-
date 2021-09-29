<template>
  <div class="com-page">
    <hot>
      <span :class="['iconfont', iconClass]"></span>
    </hot>
  </div>
</template>

<script>
import Hot from '../../components/Hot.vue'
export default {
  name: 'HotIndex',
  components: {
    hot: Hot
  },
  computed: {
    iconClass () {
      if (this.$route.path === '/') {
        return 'icon-expand-alt'
      } else {
        return ['icon-compress-alt', 'resize-big']
      }
    }
  }
}
</script>
