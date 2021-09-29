<!--商家销量统计柱状图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref" ></div>
    <div class="resize" :style="themeStyle" @click="changeChart('seller')">
      <slot>
        <span class="iconfont icon-expand-alt"></span>
      </slot>
    </div>
  </div>
</template>

<script>
import { chartMixin } from '@/mixins/index'
export default {
  mixins: [chartMixin],
  data () {
    return {
      chartInstance: null,
      sellerData: null,
      currentPage: 1,
      totalPage: 0,
      timerId: null
    }
  },
  // dom加载完成
  mounted () {
    this.$webSocket.registerCallBack('sellerData', this.getData)
    this.initChart()
    // this.getData()
    this.$webSocket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成，主动进行适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    this.$webSocket.unregisterCallBack('sellerData', this.getData)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstance
    initChart () {
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离包含坐标轴的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 指明颜色渐变的方向
              // 指明不同百分比之下颜色值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      // 设置初始化图标样式
      this.chartInstance.setOption(initOption)
      // 鼠标进入进出对于数据更新-定时器的影响
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    getData (ret) {
      // 将返回数据中的data解构赋值给ret
      // const { data: ret } = await this.$http.get('/seller')
      this.sellerData = ret.sort((a, b) => a.value - b.value)
      this.totalPage = Math.ceil(this.sellerData.length / 5)
      this.updateChart()
      this.startInterval()
    },
    // 更新图标
    updateChart () {
      // 数据分页
      const showData = this.sellerData.slice(this.currentPage * 5 - 5, this.currentPage * 5)
      const seller = showData.map(item => item.name)
      const sellerData = showData.map(item => item.value)
      // 数据更新配置
      const dataOption = {
        yAxis: {
          data: seller
        },
        series: [
          {
            data: sellerData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      // 定时器实时更新
      if (this.timerId) clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 分辨率相关的适配项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>
