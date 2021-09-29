<template>
  <div class="com-page">
    <trender>
      <span :class="['iconfont', iconClass]"></span>
    </trender>
  </div>
</template>

<script>
import Trender from '../../components/Trend.vue'
export default {
  name: 'TrendIndex',
  components: {
    trender: Trender
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
