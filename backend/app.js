var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fs = require('fs')
// const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const nodemailer = require('nodemailer')
var moment = require('moment');       // 한국 시간 사용

/* =================== 몽고DB 사용 ================= */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;    // mongoDB 버전 4.11 이상부터 해주어야 에러 안남

// 아틀라스, 개인정보이기 때문에 이 부분은 누락합니다.
const loginDB = '';

var promise = mongoose.connect(loginDB, {
  useNewUrlParser: true
}).then(function(posts) {
  console.log('DB 연결 완료');
})
.catch(function(error) {
  console.log('DB 연결 에러');
})


/* =============================================== */

var signIn = require('./routes/signIn');                      // 로그인 관련
var indexRouter = require('./routes/index');
var exercise_search = require('./routes/exercise_search');  // 운동 db
var process = require('./routes/process');                  // 세션 확인
var body_check = require('./routes/body_check');            // 바디 체크
var table_out = require('./routes/table_out');
var signUp =  require('./routes/signUp');
var file = require('./routes/file')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('connect-history-api-fallback')());
app.use(bodyParser.json({limit: "50mb"}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션 사용
app.use(session({
  secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐
                              //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
  resave: true,
  saveUninitialized: true,    // 이는 기본적으로 언제든지 세션 파일을 로드하려고 시도한다.
  store: new MongoStore( {    // 이를 통해 Mongo DB 안에 세션 저장
    url: loginDB,
    collection: "sessions",
    ttl: 3600                 // 1시간 후 사라짐
  })
}));

app.use('/api/exercise_search', exercise_search);
// app.use('/', indexRouter);
app.use('/api/signIn', signIn);           // 추가
app.use('/api/process', process);
app.use('/api/body_check', body_check);
app.use('/api/table_out', table_out);
app.use('/api/signUp', signUp);
app.use('/api/file', file);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
