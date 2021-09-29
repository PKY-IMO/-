// 第二层中间件  响应头中间件
// 获取mime类型 设置响应头
// 计算服务器消耗时长的中间件
module.exports = async (ctx, next) => {
  ctx.set('Content-Type', 'application/json; charset=UTF-8')
  ctx.set('Acess-Control-Allow-Origin','*')
  ctx.set('Acess-Control-Allow-Methods','OPTIONS, GET, PUT, POST, DELETE')
  await next()
}