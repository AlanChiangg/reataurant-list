// require packages used in the project
const express = require('express')
const mongoose = require('mongoose') // 載入mongoose

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

mongoose.connect(process.env.MONGODB_URI) // 設定連線到 mongoDB

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
});
db.once('open', () => {
  console.log('mongodb connected!')
})

// require express-handlebars here
const exphbs = require('express-handlebars')

const restaurantList = require('./restaurant.json')

// express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim()
  console.log(keyword)
  const restaurants = restaurantList.results.filter(restaurant => restaurant.name.toLowerCase().trim().includes(keyword) || restaurant.category.toLowerCase().trim().includes(keyword)
  )
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(
    restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})