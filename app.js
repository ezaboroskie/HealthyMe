const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const models = require('./models')
const { Op } = require('sequelize') // Operator 

app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')





app.listen(8080,() => {
    console.log('Server is running healthy!')
})
