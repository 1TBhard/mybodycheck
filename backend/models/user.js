var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var userSchema = new Schema({
  id: { type: String, default: null },
  password: { type: String, default: null },
  sex: { type: String, default: null },
  name: { type: String, default: null },
  email: { type: String},

  kneAsy: {type: Boolean, default: false},
  pelAsy: {type: Boolean, default: false},
  shoAsy: {type: Boolean, default: false},
  angDef: {type: Boolean, default: false},
  curBack: {type: Boolean, default: false},
  turNeck: {type: Boolean, default: false},

  birthday: { type: String, default: null},
  create_date: {type: String, default: moment().format('YYYY-MM-DD hh:mm:ss')},

  // 만료 날짜 기본은 이 유저 데이터 생성된 후 일주일 후
  expire_date: { type: String, default: moment().add(1, 'weeks').format('YYYY-MM-DD hh:mm:ss')},
  level: { type: String, default: 3},
});

// model을 user로 만들면 특별한 이름을 지정하지 않으면 
// mongoDB에서 알아서 Collection name을 알아서 복수형으로 해줍니다
// 그리하여 Collection name은 users로 됩니다
module.exports = mongoose.model('user', userSchema);