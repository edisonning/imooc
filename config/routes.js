var Movie = require('../models/movie')
var User = require('../models/user')
var _= require('underscore')

module.exports = function(app){
	// index page
	app.use(function(req,res,next){
	  //console.log('session in use');
	  //console.log(req.session.user);
	  var _user  = req.session.user
	  if (_user) {
	    app.locals.user = _user
	  }
	  return next()
	})

	// index page
	app.get('/',function(req,res){
	  
	  Movie.fetch(function(err, movies){
	    if(err){
	      console.log(err)
	    }
	    res.render('index',{
	      title:'网络传媒首页',
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

	//user signup
	app.post('/user/signup', function(req,res){
	  var userObj  = req.body.user;
	  var _user = new User({
	    username: userObj.username,
	    password: userObj.password
	  })

	  User.find({user:_user.username}, function(err,user){
	    if(err){
	      console.log(err);
	    }

	    if(!user) {
	      res.redirect('/')
	    } else {
	      _user.save(function(err, user){
	        if(err){
	          console.log(err);
	        }
	        res.redirect('/admin/userList')
	      })
	    }
	  })
	})

	//user logout
	app.get('/logout', function(req,res){
	  delete req.session.user
	  delete app.locals.user
	  res.redirect('/')
	})

	// user list page
	app.get('/admin/userList',function(req,res){
	  console.log('userlist...........');
	   User.fetch(function(err, users){
	      if(err){
	         console.log(err);
	      }
	      res.render('userList',{
	        title:'列表页面',
	        users:users
	      })
	   })
	})

	//user signin
	app.post('/user/signin', function(req,res){
	  console.log('loginning..............');
	  var userObj  = req.body.user;
	  User.findOne({username:userObj.username}, function(err,user){
	    if(err) {
	      console.log(err);
	    }
	    console.log(user);
	    if(!user) {
	      console.log('user is not exist');
	      res.redirect('/')
	    }
	    
	    if(user) {
	      user.comparePassword(userObj.password, function(err, isMatch){
	        if (isMatch) {
	          req.session.user = user
	           console.log('password is correct');
	           res.redirect('/')
	        } else {
	           console.log('password is wrong');
	           res.redirect('/')
	        }

	      }) 
	    }
	  })
	})
}
