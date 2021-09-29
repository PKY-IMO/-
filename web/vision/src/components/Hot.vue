<!--饼图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref" ></div>
    <span class="iconfont arr-left" @click="toLeft" :style="fontStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="fontStyle">&#xe6ed;</span>
    <span class="product-name" :style="fontStyle">{{ showSubTitle }}</span>
    <div class="resize" :style="themeStyle" @click="changeChart('hot')">
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
      curIdx: 0,
      titleFontSize: 0
    }
  },
  computed: {
    showSubTitle () {
      if (!this.allData) { // 必须的
        return ''
      } else {
        return this.allData[this.curIdx].name
      }
    },
    fontStyle () {
      return {
        fontSize: this.titleFontSize * 1.5 + 'px'
      }
    }
  },
  // dom加载完成
  mounted () {
    this.$webSocket.registerCallBack('hotData', this.getData)
    this.initChart()
    // this.getData()
    this.$webSocket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hot',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成，主动进行适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    this.$webSocket.unregisterCallBack('hotData', this.getData)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstance
    initChart () {
      const initOption = {
        title: {
          text: '▎热销商品占比',
          top: 20,
          left: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true
        },
        series: [
          {
            type: 'pie',
            label: { // 修改默认显示
              show: false
            },
            emphasis: { // 鼠标滑过
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      // 设置初始化图标样式
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器的数据
    getData (ret) { // 服务端发送给客户端的数据
      // 将返回数据中的data解构赋值给ret
      // const { data: ret } = await this.$http.get('/hot')
      this.allData = ret
      this.updateChart()
    },
    // 更新图标
    updateChart () {
      const seriesData = this.allData[this.curIdx].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const legendArr = this.allData[this.curIdx].children.map(item => item.name)
      // 数据更新配置
      const dataOption = {
        legend: {
          data: legendArr
        },
        tooltip: {
          formatter: arg => {
            const productArr = arg.data.children
            let str = ''
            const total = productArr.reduce((sum, item) => sum + item.value, 0)
            productArr.forEach(item => {
              str += `${item.name}:  ${(item.value / total * 100).toFixed(1)}%<br/>`
            })
            return str
          }
        },
        emphasis: {
          label: {
            formatter: arg => {
              return arg.name + ': ' + arg.percent + '%'
            }
          }
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      // 分辨率相关的适配项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft () {
      this.curIdx--
      if (this.curIdx < 0) {
        this.curIdx = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.curIdx++
      if (this.curIdx >= this.allData.length) {
        this.curIdx = 0
      }
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>
  .arr-left {
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    cursor: pointer;
  }
  .arr-right {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    cursor: pointer;
  }
  .product-name {
    position: absolute;
    color: white;
    bottom: 5%;
    right: 5%;
  }
</style>
