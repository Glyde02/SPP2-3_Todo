const express = require('express')
var multer = require('multer');
const cookieParser = require('cookie-parser')
const path = require('path')
const {v4} = require('uuid')
const bodyParser = require('body-parser')
const fs = require('fs');
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


const app = express()

const tasksFilename = 'tasks.json'
const usersFilename = 'users.json'
const tokenKey = 'sdgsdgs'

let data = {
    tasks: []
}
let users = {

}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (fs.existsSync(tasksFilename)) {
    data = readJSONFileSync(tasksFilename, 'utf8');
    users = readJSONFileSync(usersFilename, 'utf8');
}

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(express.static(__dirname));
app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:8081",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Origin, Content-Type, Authorization, X-Auth-Token, Access-Control-Allow-Credentials, Access-Control-Allow-Origin",
    });
    next();
});

app.use(multer({storage: storageConfig}).single('task-file'));
app.use(cookieParser())

app.post('/api/login', (req, res) => {
    
    //const LOGIN = 'qwe'
    //const PASS = 'qwe'

    const {login , password} = req.body

    console.log('login', login, password)

    const user = users.filter(c => c.login === login)
    if (user[0]){
        if (login == user[0].login && password == user[0].password){
            const user = {
                // id: 1,
                // name: "name1",
                // username: "username1",
                login: login,
                password: password
            }
            const token = jwt.sign(user, tokenKey, { expiresIn: 600000 })
            //setHeaders(res)
            res.cookie('token', token, { httpOnly: true })
            res.status(202).json({
                token,
                user
            })
        }
    } else {
        res.status(403).json({message: "Not correct"})
    }
})

app.post('/api/register', (req, res) => {
    console.log('register');

    const user = req.body
    const index = data.tasks.find(c => c.login === user.login)

    if (!index ){
        users.push(user)
        writeJSONFileSync(usersFilename, users);
        res.status(201).json({message: "User created"})

    } else {
        res.status(409).json({message: "Login has alreasy used"})
    }
    
})


app.use(async (req, res, next) => {
    //console.log(req.cookies.token)
    try {
        let decoded = jwt.verify(req.cookies.token, tokenKey)
        let user = users.find(с => с.login === decoded.login)
        req.logged = user !== undefined && decoded.password === user.password //await bcrypt.compare(decoded.password, user.password)
        //userId = user.id
    } catch {
        req.logged = false
    }
    next();
})

app.post('/api/logout', (req, res) => {
    console.log('log.out');
    res.cookie('token', "", -1)
    res.status(200).json({message: "Log out"})
})



app.get("/api/tasks/:taskId/:filename", function (req, res) {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }
    let path = process.cwd() + "\\uploads\\" + req.params.filename;
    let taskId = req.params.taskId;
    let originalName = data.tasks.filter(v => v.id === taskId)[0].file.originalname;
    res.download(path, originalName);
});

app.get('/api/tasks', (req, res)=>{
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }
    setTimeout( () => {
        
    }, 1000)
    res.status(200).send(data.tasks);
})

app.post('/single-file', (req,res) => {
    console.log(req)
})

app.post('/api/tasks', (req, res) => {
    //console.log(req.body)
    console.log('adding')
    //console.log(this.user)
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }
    console.log('adding2')
    const contact = {...req.body, id: v4(), completed: false, file: req.file}
    data.tasks.push(contact)

    writeJSONFileSync(tasksFilename, data);
    //contacts.push(contact)
    res.status(201).send(contact);
})

app.delete('/api/tasks/:id', (req, res) => {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    data.tasks = data.tasks.filter(c => c.id !== req.params.id)

    writeJSONFileSync(tasksFilename, data)
    //contacts = contacts.filter(c => c.id !== req.params.id)
    res.status(200).send('Ok')
})

app.put('/api/tasks/:id', (req, res) => {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    //console.log(req.cookies)
    //console.log(this.user)

    const index = data.tasks.findIndex(c => c.id === req.params.id)
    data.tasks[index] = req.body
    
    writeJSONFileSync(tasksFilename, data)

    res.status(200).json(data.tasks[index])
})

app.use(express.static(path.resolve(__dirname, 'client')))

//app.get('*', (req, res) => {
//    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
//})
app.listen(3000, () => console.log('Server has been started on port 3000...'))


function readJSONFileSync(filename, encoding) {
    let dataJson = fs.readFileSync(filename, encoding).toString();
    return JSON.parse(dataJson);
}

function writeJSONFileSync(filename, inner) {
    let dataJson = JSON.stringify(inner);
    fs.writeFileSync(filename, dataJson);
}
