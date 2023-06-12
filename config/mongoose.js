const mongoose = require('mongoose') // 載入mongoose

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 連線到mongoDB
mongoose.connect(process.env.MONGODB_URI) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
});
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db