export default class WebSocketService {
  // 单例模式
  static instance
  static get Instance () {
    if (!this.instance) {
      this.instance = new WebSocketService()
    }
    return this.instance
  }

  ws = null
  callBackMapping = {}

  hasConnected = false
  sendDelay = 0
  reConnectDelay = 0

  connect () {
    if (!window.WebSocket) {
      return window.alert('当前浏览器不支持webSocket')
    }
    this.ws = new window.WebSocket('ws://localhost:9999')
    this.ws.onopen = () => {
      console.log('websocket connect !')
      this.hasConnected = true
      this.reConnectDelay = 0
    }
    this.ws.onclose = () => {
      console.log('websocket close !')
      this.hasConnected = false
      this.reConnectDelay++
      setTimeout(() => {
        this.connect()
      }, this.reConnectDelay * 500)
    }
    this.ws.onmessage = msg => {
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        if (recvData.action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData) // webSocketService调用
        } else if (recvData.action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (recvData.action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 注册回调函数
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  unregisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  send (data) {
    if (this.hasConnected) {
      this.ws.send(JSON.stringify(data))
      this.sendDelay = 0
    } else {
      this.sendDelay++
      setTimeout(() => {
        this.send(data)
      }, this.sendDelay * 500)
    }
  }
}
