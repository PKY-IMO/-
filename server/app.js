// 服务端入口文件
// 1.创建koa的实例对象
const Koa = require('koa2')
const app = new Koa()
// 2.绑定中间件
// 三层 总耗时、响应头、业务逻辑、允许跨域
const respDurationMid= require('./middleware/koa_response_duration')
const respHeaderMid= require('./middleware/koa_response_header')
const respDataMid= require('./middleware/koa_response_data')
app.use(respDurationMid)
app.use(respHeaderMid)
app.use(respDataMid)

// 3、绑定端口号
app.listen(8888)

// webSocket 服务
const webSocketService = require('./service/web_socket_service')
webSocketService.listen()