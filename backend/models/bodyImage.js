var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');       // 한국 시간 사용
moment.tz.setDefault("Asia/Seoul");

var bodyImageSchema = new Schema(
  {
    date: {type: String, default:moment().format('YYYY-MM-DD hh:mm:ss')},
    email: {type: String, defualt: 'unknown'},
    name: {type: String, defualt: 'unknown'},

    kneAsy: {type: Boolean, default: false},
    pelAsy: {type: Boolean, default: false},
    shoAsy: {type: Boolean, default: false},
    angDef: {type: Boolean, default: false},
    curBack: {type: Boolean, default: false},
    turNeck: {type: Boolean, default: false},

    f_data: String,
    s_data: String
  }
);

module.exports = mongoose.model('bodyImage', bodyImageSchema);``