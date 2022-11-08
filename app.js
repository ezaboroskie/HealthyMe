// APP SETUP
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const models = require('./models')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const session = require('express-session')
const { Op, Model } = require('sequelize') // Operator 
const formidable = require('formidable')
const {v4: uuidv4} = require('uuid')
const db = require('./models')
let uniqueFilename = ''
require('dotenv').config()

app.use('/uploads',express.static('uploads'))
app.use('/css', express.static('css'))

app.use(session({
    secret: 'SuperSecretPassword',
    resave: false,
    saveUninitialized: true
}))

app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

//Function to upload files



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

app.get('/user', authentification, async (req,res)=>{
    const userId = req.session.userId
    const profilePic = await models.User.findOne({
        where: {id: userId}
    })
    console.log(profilePic.profilepic)
    res.render('user', {imageURL: profilePic.profilepic, className: 'profile-picture' })
   
})

app.get('/phealth', authentification, async (req,res)=>{
    const userId = req.session.userId
    const physicalGoals = await models.phealth.findAll({
        where: {phealthsid: userId}
    })
    res.render('phealth', {physicalGoals: physicalGoals})
   
})

app.get('/mhealth',authentification,async(req,res)=>{
    const userId = req.session.userId
    const mentalGoals = await models.mhealth.findAll({
        where: {mhealthsid: userId}
    }) 
    res.render('mhealth', {mentalGoals: mentalGoals})
    
})

app.get('/user-goals',authentification, async (req,res)=>{
    const userId = req.session.userId
    const userGoals = await models.usergoal.findAll({
        where: {usergoalid: userId}
    }) 
    res.render('user-goals', {userGoals: userGoals})
    
})

app.get('/add-physical-goal',authentification, (req,res)=>{
    res.render('add-physical-goal')
})

app.get('/add-mhealth',authentification, (req,res)=>{
    res.render('add-mhealth')
})

app.get('/add-user-goal',authentification, (req,res)=>{
    res.render('add-user-goal')
})

app.get('/logout', authentification, (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})

function authentification(req,res,next){
    if(req.session){
        if(req.session.username){
            next()
        }else{
            res.redirect('/login')
        }
    }else{
        res.redirect('/login')
    }
}

//POST ROUTES





app.post('/upload',(req,res)=>{

    uploadFile(req,(photoURL)=>{
        photoURL = `/uploads/${photoURL}`
        res.redirect('/user')
    })
})

app.post('/add-user-goal', async (req,res)=>{
    const {goal, description, completed} = req.body
    

    const userGoal = models.usergoal.build({
        goal: goal,
        description: description,
        completed: completed,
        usergoalid: req.session.userId 
    })

    const savedGoal = await userGoal.save()
    res.redirect('/user-goals')
   
})

app.post('/add-physical-goal', async (req,res)=>{
    const {goal, description, completed} = req.body

    const physicalGoal = models.phealth.build({
        goal: goal,
        description: description,
        completed: completed,
        phealthsid: req.session.userId
    })
    
    const savedPGoal = await physicalGoal.save()
    res.redirect('/phealth')
   
})

app.post('/delete-user-goal', async (req,res) =>{
    const {goalId} = req.body
    const deletedGoal = await models.usergoal.destroy({
        where:{
            id:parseInt(goalId)
        }
    })
    res.render('user-goals')
})

app.post('/delete-physical-goal', async (req,res)=>{
    const {physicalId} = req.body
    const deletedPGoal = await models.phealth.destroy({
        where:{
            id:parseInt(physicalId)
        }
    })
    res.render('phealth')
})

app.post('/add-mhealth', async (req,res)=>{
    const {goal, description, completed} = req.body
    

    const mentalGoal = models.mhealth.build({
        goal: goal,
        description: description,
        completed: completed,
        mhealthsid: req.session.userId
    })

    const savedGoal = await mentalGoal.save()
    res.redirect('/mhealth')
   
})

app.post('/delete-mhealth', async (req,res) =>{
    const {goalId} = req.body
    const deletedGoal = await models.mhealth.destroy({
        where:{
            id:parseInt(goalId)
        }
    })
    res.render('mhealth')
})

function uploadFile (req,callback){
    new formidable.IncomingForm().parse(req)
    .on('fileBegin', async (name,file)=>{

        uniqueFilename = `${uuidv4()}.${file.originalFilename.split('.').pop()}`;
        file.name = uniqueFilename
        file.filepath = __dirname + '/uploads/' + uniqueFilename
        
        
        
        
    })
    .on('file',async (name,file)=>{
        const userId = req.session.userId
        const picture = "./uploads/" + uniqueFilename
    
        await models.User.update({
            profilepic: picture
        },{
            where: {id:userId}
        })
        callback(file.name)

    })
}



app.listen(8080,() => {
    console.log('Server is running healthy!')
})














// Dance Kirby! 

//  <("<)   ^( " )^   (>")>

// Wow Kirby... you're not a good dancer

// t("t)

//Fuck You Too Kirby