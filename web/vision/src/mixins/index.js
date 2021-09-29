import { mapState } from 'vuex'
import { getTheme } from '@/utils/themeUtils'

export const chartMixin = {
  mounted () {
    this.$webSocket.registerCallBack('fullScreen', this.fullScreen)
  },
  destoryed () {
    this.$webSocket.registerCallBack('fullScreen')
  },
  computed: {
    ...mapState(['theme']),
    themeStyle () {
      return {
        color: getTheme(this.theme).titleColor
      }
    }
  },
  watch: {
    theme () {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  methods: {
    changeChart (chartName) { // 改变图表放大缩小
      this.$webSocket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: !(this.$route.path === '/')
      })
    },
    fullScreen (data) {
      if (data.value) {
        this.$router.replace({
          path: '/'
        })
      }
    }
  }
}
