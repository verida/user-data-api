import express from 'express'
const cors = require('cors')
import bodyParser from 'body-parser'
import router from './routes'

const path = require('path')

//const basicAuth = require('express-basic-auth')
//import RequestValidator from './request-validator'

// Set up the express app
const app = express();
//const validator = new RequestValidator()

console.log(path.join(__dirname, 'assets'))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// Parse incoming requests data
const corsConfig = {}
app.use(cors(corsConfig))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(router)


module.exports=app