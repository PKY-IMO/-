<!--商家地图-->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref" ></div>
    <div class="resize" :style="themeStyle" @click="changeChart('map')">
      <slot>
        <span class="iconfont icon-expand-alt"></span>
      </slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { chartMixin } from '@/mixins/index'
import { getProvinceMapInfo } from '@/utils/mapUtils.js'
export default {
  mixins: [chartMixin],
  data () {
    return {
      chartInstance: null,
      mapData: null,
      scatterData: null,
      provinceData: {}
    }
  },
  // dom加载完成
  mounted () {
    this.$webSocket.registerCallBack('mapData', this.getData)
    this.initChart()
    // this.getData()
    this.$webSocket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成，主动进行适配
    this.screenAdapter()
  },
  destroyed () {
    this.$webSocket.unregisterCallBack('mapData', this.getData)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstance
    async initChart () {
      // 获取中国地图的矢量数据，不能使用$http
      // http://localhost:8999/static/map/china.json
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // const ret = await axios.get('http://10.0.0.164:8999/static/map/china.json')
      // this.$echarts.registerMap('China', ret.data)
      const initOption = {
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 图例摆放方式
        },
        title: {
          text: '▎商家分布',
          top: 20,
          left: 20
        },
        geo: {
          type: 'map',
          map: 'China',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF', // 省份背景颜色
            borderColor: '#333'
          },
          label: {
            show: true,
            textStyle: {
              color: 'white'
            }
          }
        }
      }
      // 设置初始化图标样式
      this.chartInstance.setOption(initOption)
      // 实现点击放大
      this.chartInstance.on('click', async arg => {
        // arg.name 所点击省份
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 获取省份地图矢量数据
        if (!(provinceInfo.name in this.provinceData)) {
          const { data: ret } = await axios.get('http://10.0.0.164:8999' + provinceInfo.path)
          this.provinceData[provinceInfo.key] = ret
          this.$echarts.registerMap(provinceInfo.key, ret)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    // 获取服务器的数据
    getData (ret) {
      // 散点数据
      // const { data: ret } = await this.$http.get('/map')
      this.scatterData = ret
      this.updateChart()
    },
    // 更新图标
    updateChart () {
      // 数据更新配置
      const legendDataArr = this.scatterData.map(item => item.name)
      const seriesArr = this.scatterData.map(item => {
        // 一个类别的多个散点
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke' // 空心涟漪效果
          }
        }
      })
      const dataOption = {
        legend: {
          data: legendDataArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      // 分辨率相关的适配项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        },
        geo: {
          label: {
            textStyle: {
              fontSize: titleFontSize / 3
            }
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap () {
      const revertOption = {
        geo: {
          map: 'China'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>
