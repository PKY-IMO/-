<template>
  <div class="com-page">
    <stock>
      <span :class="['iconfont', iconClass]"></span>
    </stock>
  </div>
</template>

<script>
import Stock from '../../components/Stock.vue'
export default {
  name: 'StockIndex',
  components: {
    stock: Stock
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
