// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 瀏覽所有餐廳 (首頁)
router.get('/', (req, res) => {
  const sort = req.query.sort;
  const sortedRestaurants = {}

  switch (sort) {
    case '_id':
      sortedRestaurants._id = 1;
      break;
    case 'category':
      sortedRestaurants.category = 1;
      break;
    case 'location':
      sortedRestaurants.location = 1;
      break;
  }

  Restaurant.find()
    .lean()
    .sort(sortedRestaurants)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 搜尋餐廳
router.get('/search', (req, res) => {

  const keyword = req.query.keyword.toLowerCase().trim()

  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      const restaurants = restaurantsData.filter(restaurant => restaurant.name.toLowerCase().trim().includes(keyword) || restaurant.category.toLowerCase().trim().includes(keyword)
      )
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.log(error))
})


// 匯出路由模組
module.exports = router