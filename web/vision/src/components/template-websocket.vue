<!--echarts图通用配置-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="xxx_ref" ></div>
    <div class="resize" :style="themeStyle" @click="changeChart('hot')">
      <slot>
        <span class="iconfont icon-expand-alt"></span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null
    }
  },
  created () {
    this.$webSocket.registerCallBack('xxxData', this.getData)
  },
  // dom加载完成
  mounted () {
    this.initChart()
    // this.getData()
    this.$webSocket.send({
      action: 'getData',
      socketType: 'xxxData',
      chartName: 'xxx',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成，主动进行适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    this.$webSocket.unregisterCallBack('xxxData', this.getData)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstance
    initChart () {
      const initOption = {}
      this.chartInstance = this.$echarts.init(this.$refs.xxx_ref, this.theme)
      // 设置初始化图标样式
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器的数据
    getData (ret) {
      // 将返回数据中的data解构赋值给ret
      // const { data: ret } = await this.$http.get('/???')
      this.allData = ret
      this.updateChart()
    },
    // 更新图标
    updateChart () {
      // 数据更新配置
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter () {
      // const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 分辨率相关的适配项
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>
