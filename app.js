var express = require('express')
var bodyParser = require('body-parser');
var path = require('path')
var mongoose = require('mongoose')

var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)

var port = process.env.PORT || 3000
var app  = new express()
var dbUrl = 'mongodb://localhost/imooc'

mongoose.connect(dbUrl)
app.locals.moment = require('moment')
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser()); 
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'imooc',
  resave: false,
  saveUninitialized:true,
  store: new mongoStore({
    url:dbUrl,
    collection:'sessions'
  })
}))

require('./config/routes')(app)



app.listen(port)
console.log('imocc started on port:'+ port)






