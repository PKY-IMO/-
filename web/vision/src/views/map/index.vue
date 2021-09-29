<template>
  <div class="com-page">
    <sellmap>
      <span :class="['iconfont', iconClass]"></span>
    </sellmap>
  </div>
</template>

<script>
import Map from '../../components/Map.vue'
export default {
  name: 'MapIndex',
  components: {
    sellmap: Map
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
