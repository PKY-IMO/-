const fs = require('fs')
const fsp = fs.promises
module.exports.getFileJson = async (filePath) =>{
  return await fsp.readFile(filePath)
  // return new Promise((res, rej)=>{
  //   fs.readFile(filePath, 'utf-8', (err, data)=>{ 
  //     if (err) {
  //       rej(err)
  //     }else {
  //       res(data)
  //     }
  //   })
  // })
}