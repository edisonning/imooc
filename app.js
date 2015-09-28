var express = require('express')
var bodyParser = require('body-parser');

var path = require('path')
var mongoose = require('mongoose')
var _= require('underscore')
var Movie = require('./models/movie')

var port = process.env.PORT || 3000
var app  = new express()

mongoose.connect('mongodb://localhost/imooc')
app.locals.moment = require('moment')
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)
console.log('imocc started on port:'+ port)

// index page
app.get('/',function(req,res){
   Movie.fetch(function(err, movies){
      if(err){
         console.log(err)
      }
      res.render('index',{
         title:'继续教育 首页',
         movies: movies
      })
   })
})


//admin post movie
app.post('/admin/movie/new', function(req,res){
   
   var id = req.body.movie._id
   var movieObj = req.body.movie
   var _movie
   
   if(id.length!=0) {
      Movie.findById(id, function(err, movie){
         if(err){
            console.log(err);
         }
         _movie = _.extend(movie,movieObj)
         _movie.save(function(err, movie){
            if(err){
               console.log(err);
            }
            res.redirect('/movie/' + movie._id)
         })
      })
   } else {
      _movie = new Movie({
         doctor: movieObj.doctor,
         title: movieObj.title,
         country: movieObj.country,
         language: movieObj.language,
         poster: movieObj.poster,
         summary: movieObj.summary,
         flash: movieObj.flash,
         year:movieObj.year
      })
      _movie.save(function(err,movie){
         if(err){
            console.log(err);
         }
      res.redirect('/movie/'+ _movie._id)
      })
   }
})

// list page
app.get('/admin/list',function(req,res){
   Movie.fetch(function(err, movies){
      if(err){
         console.log(err);
      }
      res.render('list',{
        title:'列表页面',
        movies:movies
      })
   })
})

// insert page
app.get('/admin/update/:id',function(req,res){
   var id = req.params.id
   if(id){
      Movie.findById(id, function(err, movie){
         if(err){
            console.log(err);
         }
         res.render('admin',{
           title:'录入页面',
           movie:movie
         })
      })
   }
})

//update

// insert page
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'录入页面',
        movie:{
            title: '',
            _id:'',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''   
        }
    })
})

// insert page
app.get('/movie/:id',function(req,res){
   var id =req.params.id
   Movie.findById(id, function(err,movie){
   if(err){
      console.log(err);
   }
   res.render('detail',{
        title:'详情页面',
        movie:movie
    })
   })
})

// delete data
app.delete('/admin/list', function(req,res){
  var id = req.query.id
  if(id){
    Movie.remove({_id:id}, function(err,movie){
      if(err){
        console.log(err);
      }
      else {
        res.json({success:1})
      }
    })
  }
})



