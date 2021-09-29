<!--针对 /sellpage 这条路径显示出来
在这个组件中，通过子组件注册的方式，要显示出Selller.vue这个组件-->
<template>
  <div class="com-page">
    <seller>
      <span :class="['iconfont', iconClass]"></span>
    </seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller'
export default {
  name: 'SellerIndex',
  components: {
    seller: Seller
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
