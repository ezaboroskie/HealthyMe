

app.post ("/register", async (req, res) => {
    const {username, password} = req.body 
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    let user = await models.User.findOne({where: {username:username}})
    if(user) {
    res.render("register", { errorMessage: 'Username is already taken'})
    } else {
    const newUser = models.User.build({
        username: username,
        password: hashedPassword
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
            }
            res.redirect("/user")
        } else {
            res.render("login", { errorMessage: "Invalid username"})
        }
    } else {
        res.render("login", { errorMessage: "Enter correct username or password."})
    }
})



