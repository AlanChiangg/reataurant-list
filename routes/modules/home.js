const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
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

  Restaurant.find({ userId })
    .lean()
    .sort(sortedRestaurants)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.toLowerCase().trim()

  Restaurant.find({ userId })
    .lean()
    .then(restaurantsData => {
      const restaurants = restaurantsData.filter(restaurant => restaurant.name.toLowerCase().trim().includes(keyword) || restaurant.category.toLowerCase().trim().includes(keyword)
      )
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.log(error))
})

module.exports = router