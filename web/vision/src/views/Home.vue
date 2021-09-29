<template>
  <div class="home" :style="{backgroundColor: themeStyle.backgroundColor}">
    <header class="home-header" :style="{color: themeStyle.titleColor}">
      <div class="header-bg">
        <img :src=themeStyle.headerBorder alt="">
      </div>
      <div class="header-left">pkypky.cc</div>
      <span class="title">电商平台实时监控系统</span>
      <div class="header-right">
        <img :src=themeStyle.skinIcon class="skin" @click="changeTheme">
        <span class="time">{{ date | formatTimer }}</span>
      </div>
    </header>
    <div class="home-body">
      <section class="home-left">
        <div class="left-top">
          <trend-index></trend-index>
        </div>
        <div class="left-bottom">
          <seller-index></seller-index>
        </div>
      </section>
      <section class="home-mid">
        <div class="mid-top">
          <map-index></map-index>
        </div>
        <div class="mid-bottom">
          <rank-index></rank-index>
        </div>
      </section>
      <section class="home-right">
        <div class="right-top">
          <hot-index></hot-index>
        </div>
        <div class="right-bottom">
          <stock-index></stock-index>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import TrendIndex from './trend'
import SellerIndex from './seller'
import MapIndex from './map'
import RankIndex from './rank'
import HotIndex from './hot'
import StockIndex from './stock'
import { mapState } from 'vuex'
import { getTheme } from '@/utils/themeUtils'
export default {
  name: 'Home',
  components: {
    TrendIndex,
    SellerIndex,
    MapIndex,
    RankIndex,
    HotIndex,
    StockIndex
  },
  data () {
    return {
      date: new Date(),
      timer: null
    }
  },
  computed: {
    ...mapState(['theme']),
    themeStyle () {
      return getTheme(this.theme)
    }
  },
  mounted () {
    if (this.timer) clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.date = new Date()
    }, 1000)
    this.$webSocket.registerCallBack('fullScreen', this.fullScreen)
    this.$webSocket.registerCallBack('themeChange', this.loadTheme)
  },
  destroyed () {
    // this.$webSocket.unregisterCallBack('fullScreen')
    this.$webSocket.unregisterCallBack('themeChange')
    clearInterval(this.timer)
  },
  methods: {
    fullScreen (data) {
      if (!data.value) {
        this.$router.replace({
          path: data.chartName
        })
      }
    },
    loadTheme () {
      this.$store.commit('changeTheme')
    },
    changeTheme () {
      this.$webSocket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: this.theme
      })
    }
  },
  filters: {
    formatTimer: function (value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 0 25px;
  box-sizing: border-box;
  position: relative;
  .home-header {
    width: 100%;
    height: 64px;
    position: relative;
    .header-bg img {
      width: 100%;
    }
    .title {
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 20px;
      font-size: 20px;
    }
    .header-left {
      position: absolute;
      left: 0;
      top: 10px;
    }
    .header-right {
      position: absolute;
      top: 10px;
      right: 0;
      .skin {
        width: 28px;
        height: 21px;
        cursor: pointer;
        vertical-align: middle;
      }
      .time {
        margin-left: 10px;
      }
    }
  }
  .home-body {
    width: 100%;
    height: 100%;
    margin-top: 10px;
    .home-left {
      display: inline-block;
      width: 27.6%;
      height: 100%;
      .left-top {
        width: 100%;
        height: 53%;
        position: relative;
      }
      .left-bottom {
        height: 31%;
        width: 100%;
        margin-top: 25px;

        position: relative;
      }
    }
    .home-mid {
      display: inline-block;
      margin: 0 1.6%;
      width: 41.6%;
      height: 100%;
      .mid-top {
        width: 100%;
        height: 56%;
        position: relative;
      }
      .mid-bottom {
        height: 28%;
        width: 100%;
        margin-top: 25px;
        position: relative;
      }
    }
    .home-right {
      display: inline-block;
      width: 27.6%;
      height: 100%;
      .right-top {
        width: 100%;
        height: 53%;
        position: relative;
      }
      .right-bottom {
        height: 31%;
        width: 100%;
        margin-top: 25px;
        position: relative;
      }
    }
  }
}
</style>
