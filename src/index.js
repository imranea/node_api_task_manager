const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const userRoutes = require('./router/user')
const taskRoutes = require('./router/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/',userRoutes)
app.use('/',userRoutes)


app.listen(port,()=>{
    console.log('Serveur is up in port ',port)
})