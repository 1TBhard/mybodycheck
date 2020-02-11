const express = require('express');
const router = express.Router();
var Exercise = require('../models/exercise');

// 사용자가 원하는 부위를 받으면 그 부위의 운동 정보 전달
router.post('/search', function(req, res, next) {
  console.log(req.body.muscle +' 서칭 시작');
  // 찾은 값이 fucntion()의 매개변수 user에 들어감

  // 운동 사전 전체 반환
  if(req.body.muscle == "") {
    Exercise.find({}, function(err, exercise){
      // 구문 error
      if(err) return [res.status(500).json({error: err})];
      // User가 없으면 error
      if(!exercise) return res.status(404).json({error: 'exercise not found'});
      res.json(exercise)
    })
  }
  else {
    Exercise.find({ muscle: { $in: req.body.muscle }}, function(err, exercise){
      // 구문 error
      if(err) return [res.status(500).json({error: err})];
      // User가 없으면 error
      if(!exercise) return res.status(404).json({error: 'exercise not found'});
      res.json(exercise)
    })
  }
});


module.exports = router;