// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
// 瀏覽所有餐廳 (首頁)
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})
// 匯出路由模組
module.exports = router