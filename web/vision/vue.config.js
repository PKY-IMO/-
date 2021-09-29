const path = require("path"); //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}
module.exports = {
  devServer: {
    port: 8999, //端口号配置
    open: true, //自动打开浏览器
    proxy: {                //配置代理服务器来解决跨域问题
      '/api': {
          target: 'http://127.0.0.1:8888',      //配置要替换的后台接口地址
          changOrigin: true,                      //配置允许改变Origin
          pathRewrite: {                       //请求的时候使用这个api就可以
              '^/api': ''
          }
      },
    }
  }
  // chainWebpack: (config) => {
  //   config.resolve.alias
  //     .set("@", resolve("src"))
  //     .set("assets", resolve("src/assets"))
  //     .set("components", resolve("src/components"))
  //     .set("views", resolve("src/views"));
  //   //set第一个参数：设置的别名，第二个参数：设置的路径
  // },
}