<!--趋势折线图-->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▎ ' +showTitle }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)"
            :style="marginStyle">{{ item.text }}</div>
      </div>
    </div>
    <div class="com-chart" ref="trender_ref" ></div>
    <div class="resize" :style="themeStyle" @click="changeChart('trend')">
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
      trenderData: null,
      type: 'map',
      showChoice: false,
      titleFontSize: 0
    }
  },
  mounted () {
    this.$webSocket.registerCallBack('trendData', this.getData)
    // dom加载完成
    this.initChart()
    // this.getData()
    this.$webSocket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成，主动进行适配
    this.screenAdapter()
  },
  destroyed () {
    this.$webSocket.unregisterCallBack('trendData', this.getData)
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    selectTypes () {
      if (!this.trenderData) {
        return []
      } else {
        return this.trenderData.type.filter(item => item.key !== this.type)
      }
    },
    showTitle () {
      if (!this.trenderData) {
        return ''
      } else {
        return this.trenderData[this.type].title
      }
    },
    // 设置标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    // 初始化echartsInstance
    initChart () {
      const initOption = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true // 距离包含坐标轴的文字
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        series: [
          {
            type: 'line',
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
      this.chartInstance = this.$echarts.init(this.$refs.trender_ref, this.theme)
      // 设置初始化图标样式
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器的数据
    getData (ret) {
      // 将返回数据中的data解构赋值给ret
      // const { data: ret } = await this.$http.get('/trend')
      this.trenderData = ret
      this.updateChart()
    },
    // 更新图标
    updateChart () {
      // 半透明颜色数组
      const colorArr1 = [
        'rgba(11,168,44,.5)',
        'rgba(44,110,255,.5)',
        'rgba(22,242,217,.5)',
        'rgba(254,33,30,.5)',
        'rgba(250,105,0,.5)'
      ]
      // 透明颜色数组
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      // 数据分页
      const showData = this.trenderData[this.type]
      const monthArr = this.trenderData.common.month
      const trenderData = showData.data
      const legendArr = trenderData.map(item => item.name)
      const seriesArr = trenderData.map((item, idx) => {
        return {
          type: 'line',
          name: item.name,
          data: item.data,
          stack: this.type,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[idx]
              },
              {
                offset: 1,
                color: colorArr2[idx]
              }
            ])
          }
        }
      })
      // 数据更新配置
      const dataOption = {
        xAxis: {
          data: monthArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter () {
      this.titleFontSize = this.$refs.trender_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect (type) {
      this.type = type
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang="less" scoped>
  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index:10;
    color: white;
    .title-icon {
      margin-left: 10px;
      cursor: pointer;
    }
    .select-con {
      background-color: #222733;
    }
  }
</style>
