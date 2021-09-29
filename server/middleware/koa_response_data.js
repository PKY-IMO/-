// 第三层中间件 业务逻辑
// 读取文件内容 
//  获取请求的路径，拼接文件路径
//  获取该路径对应文件的内容
// 设置响应头
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async (ctx, next) => {
  // 根据请求的 url赖获取文件
  const url = ctx.request.url
  console.log('--',url)
  let filePath = '../data' + url.replace('/api', '') + '.json'
  filePath = path.resolve(__dirname, filePath)
  try {
    ctx.response.body = await fileUtils.getFileJson(filePath)
  } catch (error) {
    console.log(error)
    const errMsg = {
      message: 'Not found,fail to read file',
      status: 404
    }
    ctx.response.body = JSON.stringify(errMsg)
  }
  await next()
}