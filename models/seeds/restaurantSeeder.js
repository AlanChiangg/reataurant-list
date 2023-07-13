if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt = require('bcryptjs')
const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json').results
const db = require('../../config/mongoose')
const User = require('../user')

const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantIndex: [0, 1, 2]
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantIndex: [3, 4, 5]
  }
]

db.once('open', () => {
  Promise.all(
    SEED_USER.map(seedUser =>
      User.findOne({ email: seedUser.email })
        .then(user => {
          if (user) {
            console.log('User already exists.')
            return process.exit()
          }
          return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(seedUser.password, salt))
            .then(hash =>
              User.create({
                name: seedUser.name,
                email: seedUser.email,
                password: hash
              })
            )
            .then(user => {
              const restaurantSeeds = seedUser.restaurantIndex.map(index => {
                restaurantList[index].userId = user._id
                return restaurantList[index]
              })
              return Restaurant.create(restaurantSeeds)
            })

        })
    )
  )
    .then(() => {
      console.log('done.')
      process.exit()
    })
    .catch(err => {
      console.error(err)
      process.exit()
    })
})