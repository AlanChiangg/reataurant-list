// require packages used in the project
const express = require('express')
const mongoose = require('mongoose') // 載入mongoose
const Restaurant = require('./models/restaurant')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

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


// express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting body-parser, static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// routes setting

// 瀏覽所有餐廳 (首頁)
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 搜尋餐廳
app.get('/search', (req, res) => {

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

//新增餐廳的頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽指定餐廳
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 編輯餐廳
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})