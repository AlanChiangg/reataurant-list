// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 瀏覽所有餐廳 (首頁)
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

router.use('/', home)
// 將網址結構符合/restaurants字串開頭的request導向restaurants模組 
router.use('/restaurants', restaurants) 

// 匯出路由器
module.exports = router