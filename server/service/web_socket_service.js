const path = require('path')
const fileUtils = require('../utils/file_utils')

const WebSocket = require('ws')
const ws = new WebSocket.Server({
  port: 9999
}, () => {console.log('websocket is listening port: 9999')})

// 对外到处监听事件
module.exports.listen = () => {
  console.log(`[SERVER] connection()`);
  // 对客户端连接事件进行监听，client是客户端的socket连接对象
  ws.on('connection', client => {
    // 服务端监听message事件
    client.on('message', async msg => {
      const payload = JSON.parse(msg)
      if (payload.action === 'getData') {
        const filePath = '../data/' + payload.chartName + '.json'
        const fullPath = path.join(__dirname, filePath)
        try {
          let data = await fileUtils.getFileJson(fullPath)
          payload.data = data.toString('utf-8')
          client.send(JSON.stringify(payload))
        } catch (error) {
          payload.data = null
          client.send(JSON.stringify(payload))
        }
      } else { //fullScreen themeChange 服务器推送给所有客户端改变事件
        ws.clients.forEach(client => {
          client.send(msg)
        })
      }
    })
  })
}