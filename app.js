// APP SETUP
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const models = require('./models')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const session = require('express-session')
const { Op } = require('sequelize') // Operator 

app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')



// GET ROUTES
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.get('/user-goals',(req,res)=>{
    res.render('user-goals')
})

app.get('/phealth', (req,res)=>{
    res.render('phealth')
})

app.get('/mhealth',(req,res)=>{
    res.render('mhealth')
})


app.listen(8080,() => {
    console.log('Server is running healthy!')
})
