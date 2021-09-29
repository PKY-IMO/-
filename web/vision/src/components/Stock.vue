<!--stock多个圆环图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref" ></div>
    <div class="resize" :style="themeStyle" @click="changeChart('stock')">
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
      allData: null,
      curPage: 1,
      totalPage: 0,
      timerId: null
    }
  },
  // dom加载完成
  mounted () {
    this.$webSocket.registerCallBack('stockData', this.getData)
    this.initChart()
    // this.getData()
    this.$webSocket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成，主动进行适配
    this.screenAdapter()
    this.startInterval()
  },
  destroyed () {
    clearInterval(this.timerId)
    this.$webSocket.unregisterCallBack('stockData', this.getData)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstance
    initChart () {
      const initOption = {
        title: {
          text: '▎库存和销量占比',
          top: 20,
          left: 20
        }
      }
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
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
      // const { data: ret } = await this.$http.get('/stock')
      this.allData = ret
      this.totalPage = Math.ceil(this.allData.length / 5)
      this.updateChart()
    },
    // 更新图标
    updateChart () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4ff778', '#0ba82c'],
        ['#e5dd45', '#e8b11c'],
        ['#e8821c', '#e55445'],
        ['#5052ee', '#ab6ee5'],
        ['#23e5e5', '#2e72bf']
      ]
      // 数据更新配置
      const showData = this.allData.slice((this.curPage - 1) * 5, this.curPage * 5)
      const seriesArr = showData.map((item, index) => {
        return {
          name: item.name,
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false, // 关闭动画
          labelLine: { // 取消竖线
            show: false
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            {
              seriesname: item.name,
              name: '销量',
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              },
              label: {
                formatter: item.name + '\n' + item.sales,
                show: true
              }
            },
            {
              name: '库存',
              value: item.stock,
              itemStyle: {
                color: '#333843'
              },
              label: {
                show: false
              }
            }
          ]
        }
      })
      const dataOption = {
        tooltip: {
          formatter: arg => {
            console.log(arg)
            return `${arg.seriesName}<br/>${arg.name}: ${arg.value}<br/>占比: ${arg.percent}%`
          }
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2.8
      const outterRadius = innerRadius * 1.125
      // 分辨率相关的适配项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.curPage++
        if (this.curPage > this.totalPage) {
          this.curPage = 1
        }
        this.updateChart()
      }, 3000)
    }
  }
}
</script>
