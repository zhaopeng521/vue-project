var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors  = require("cors");   // 引入 处理跨域的 模块 cors
var mongoose = require("mongoose"); // 引入 mongoose 而不是 mongodb
const mongoUri = 'mongodb://127.0.0.1:27017/cms'; // 这是连接的地址和库
mongoose.connect(mongoUri , { server: { socketOptions:{keepAlive:1 } } } );//建立持续连接
mongoose.connection.on("error",()=>{
	 throw new Error('数据库连接失败');
});


var index = require('./routes/index');
var users = require('./routes/users');   //引入 自定义的路由用户
var cate = require('./routes/cate');    //引入自定义的控制器对应的 路由 cate
var news = require('./routes/news');    //引入自定义的控制器对应的 路由news
var comment = require('./routes/comment');    //引入自定义的控制器对应的 路由news
var upload = require('./routes/upload');    //引入自定义的控制器对应的 路由news


var app = express();

app.use(cors());         // 配置cors


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.json( {limit: "50mb"} ) );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //静态文件保存路径

app.use(express.static(path.join(__dirname, 'uploads')));//配置上传文件保存路径

app.use('/', index);
app.use('/users', users);      //用户
app.use('/cate', cate);        //配置路由 路径
app.use('/news', news);        //配置路由 路径
app.use('/comment', comment);  //配置路由 路径
app.use('/upload', upload);  //配置路由 路径


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
