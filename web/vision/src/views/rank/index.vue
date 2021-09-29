<template>
  <div class="com-page">
    <rank>
      <span :class="['iconfont', iconClass]"></span>
    </rank>
  </div>
</template>

<script>
import Rank from '../../components/Rank.vue'
export default {
  name: 'RankIndex',
  components: {
    rank: Rank
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
