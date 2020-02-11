var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exerciseSchema = new Schema({
  img: String,
  muscle: String,
  equipment: String,
	link: String,
  rating: String,
  level: String,
  create_date: { type:Date, default:Date.now },
});

module.exports = mongoose.model('exercise', exerciseSchema);