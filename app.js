// APP SETUP
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const models = require('./models')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const session = require('express-session')
const { Op } = require('sequelize') // Operator 
const formidable = require('formidable')
const {v4: uuidv4} = require('uuid')
let uniqueFilename = ''
require('dotenv').config()

app.use('/uploads', express.static ('uploads'))
app.use('/css', express.static ('css'))

app.use(session({

    secret: process.env.SESSION_SECRET_KEY,
   
    resave: false,

    saveUninitialized: true
}))

app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

//Function to upload files


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
    const user = await models.User.findOne({
        where: {id: userId}
    })
    
    
    
    res.render('user', {imageURL: user.profilepic, className: 'profile-picture', firstname: user.firstName, lastname: user.lastName })
   
})

app.get('/phealth', authentification, async (req,res)=>{
    const userId = req.session.userId
    const physicalGoals = await models.phealth.findAll({
        where: {phealthsid: userId}
    })

    const physicalNotes = await models.phealthnote.findAll({})
    for (let goal of physicalGoals) {
        let filteredGoals = physicalNotes.filter(note => goal.id == note.phealthnotesid)
        goal.notes = filteredGoals
    }
    // console.log(physicalGoals[0].notes[0].dataValues)
    res.render('phealth', {physicalGoals: physicalGoals})
})

app.get('/mhealth',authentification,async(req,res)=>{
    const userId = req.session.userId
    const mentalGoals = await models.mhealth.findAll({
        where: {mhealthsid: userId}
    }) 

    const mentalNotes = await models.mhealthnote.findAll({})
    for (let goal of mentalGoals) {
        let filteredGoals = mentalNotes.filter(note => goal.id == note.mhealthnotesid)
        goal.notes = filteredGoals
    }
    // console.log(mentalGoals[0].notes[0].dataValues)

    res.render('mhealth', {mentalGoals: mentalGoals})
})

app.get('/user-goals', authentification, async (req,res)=>{
    const userId = req.session.userId
    const userGoals = await models.usergoal.findAll({
        where: {usergoalid: userId}
    }) 
    const longNotes = await models.usergoalsnote.findAll({})
    for (let goal of userGoals) {
        let filteredGoals = longNotes.filter(note => goal.id == note.usergoalsnotesid)
        goal.notes = filteredGoals
    }
    // console.log(userGoals[0].notes[0].dataValues)
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

app.get('/useful-links', authentification, (req, res) => {
    res.render('useful-links')
})




//POST ROUTES
app.post ("/register", async (req, res) => {
    const {username, password, firstName, lastName} = req.body 
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    let user = await models.User.findOne({where: {username:username}})
    if(user) {
    res.render("register", { errorMessage: 'Username is already taken'})
    } else {
    const newUser = models.User.build({
        username: username,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName, 
        })
    await newUser.save()
    res.redirect('/login')
    }
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body 
    let user = await models.User.findOne({where: {username:username}})
    if(user) {
        const result = await bcrypt.compare(password, user.password)
        if(result) {
            if(req.session) {
                req.session.username = user.username 
                req.session.userId = user.id
            }
            res.redirect("/user")
        } else {
            res.render("login", { errorMessage: "Invalid username"})
        }
    } else {
        res.render("login", { errorMessage: "Enter correct username or password."})
    }
})

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

app.post('/delete-user-goal', authentification, async (req,res) =>{
    const {goalId} = req.body
    await models.usergoalsnote.destroy({
        where:{
            usergoalsnotesid:parseInt(goalId)
        }
    })
    const deletedGoal = await models.usergoal.destroy({
        where:{
            id:parseInt(goalId)
        }
    })
    res.redirect('/user-goals')
})

app.post('/delete-physical-goal', authentification, async (req,res)=>{
    const {physicalId} = req.body
    await models.phealthnote.destroy({
        where:{
            phealthnotesid:parseInt(physicalId)
        }
    })
    const deletedPGoal = await models.phealth.destroy({
        where:{
            id:parseInt(physicalId)
        }
    })
    res.redirect('/phealth')
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
    await models.mhealthnote.destroy({
        where:{
            mhealthnotesid:parseInt(goalId)
        }
    })
    const deletedGoal = await models.mhealth.destroy({
        where:{
            id:parseInt(goalId)
        }
    })
    res.redirect('/mhealth')
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


// adding note long
app.post("/add-note-long", authentification, async (req, res) => {
    const {note, id} = req.body
    // console.log(req.body)
    await models.usergoalsnote.create({
        body: note, 
        usergoalsnotesid: id
    })
    res.redirect('/user-goals')
})

// adding note physical
app.post("/add-note-physical", authentification, async (req, res) => {
    const {note, id} = req.body
    // console.log(req.body)
    let goal = await models.phealthnote.create({
        body: note, 
        phealthnotesid: id
    })
    console.log(goal)
    res.redirect('/phealth')
})

// adding note mental
app.post("/add-note-mental", authentification, async (req, res) => {
    const {note, id} = req.body
    console.log(req.body)
    let goal = await models.mhealthnote.create({
        body: note, 
        mhealthnotesid: id
    })
    console.log(goal)
    res.redirect('/mhealth')
})


// removing note long
app.post("/delete-note-long", authentification, async (req, res) => {
    const {id} = req.body
    // console.log(id)
    await models.usergoalsnote.destroy({
        where:{
            id:parseInt(id)
        }
    })
    res.redirect("/user-goals")
})

// removing note physical
app.post("/delete-note-physical", authentification, async (req, res) => {
    const {id} = req.body
    // console.log(id)
    await models.phealthnote.destroy({
        where:{
            id:parseInt(id)
        }
    })
    res.redirect("/phealth")
})

// removing note mental
app.post("/delete-note-mental", authentification, async (req, res) => {
    const {id} = req.body
    // console.log(id)
    await models.mhealthnote.destroy({
        where:{
            id:parseInt(id)
        }
    })
    res.redirect("/mhealth")
})



app.listen(8080,() => {
    console.log('Server is running healthy!')
})














// Dance Kirby! 

//  <("<)   ^( " )^   (>")>

// Wow Kirby... you're not a good dancer

// t("t)

//Fuck You Too Kirby