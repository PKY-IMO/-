<!--地区销售排行-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref" ></div>
    <div class="resize" :style="themeStyle" @click="changeChart('rank')">
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
      rankData: null,
      startIdx: 0,
      totalLength: 0,
      timerId: null
    }
  },
  // dom加载完成
  mounted () {
    this.$webSocket.registerCallBack('rankData', this.getData)
    this.initChart()
    // this.getData()
    this.$webSocket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成，主动进行适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    this.$webSocket.unregisterCallBack('rankData', this.getData)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstance
    initChart () {
      const initOption = {
        title: {
          text: '▎地区销售排行',
          top: 20,
          left: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: {
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: 'white'
            }
          },
          itemStyle: {
            // 指明颜色渐变的方向
            // 指明不同百分比之下颜色值
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
      }
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
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
      // const { data: ret } = await this.$http.get('/rank')
      this.rankData = ret.sort((a, b) => b.value - a.value)
      this.totalLength = ret.length
      this.updateChart()
      this.startInterval()
    },
    // 更新图标
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // const showData = this.rankData.slice(this.startIdx, this.startIdx + 10)
      const areaArr = this.rankData.map(item => item.name)
      const seriesArr = this.rankData.map(item => item.value)
      // 数据更新配置
      const dataOption = {
        xAxis: {
          data: areaArr
        },
        dataZoom: {
          show: false,
          startValue: this.startIdx,
          endValue: this.startIdx + 9
        },
        series: [
          {
            data: seriesArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      // 分辨率相关的适配项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.startIdx++
        if (this.startIdx >= this.totalLength - 10) this.startIdx = 0
        this.updateChart()
      }, 3000)
    }
  }
}
</script>
