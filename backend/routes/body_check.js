const express = require('express');
const router = express.Router();
var User = require('../models/user');

// 신체 분석 완료 후 db에 그 사항을 업데이트 함
router.post('/save_abnormal', function (req, res, next) {
  // 세션이 존재하면
  if(req.session.user_name) {
    console.log(req.session.user_id + '의 정보 업데이트 시도')
    User.updateOne({ id: req.session.user_id}, { $set: { body_state: req.body.result }}, function(err, user) {
      if (err) return res.status(500).json({ error: err });
      else {
        console.log(req.session.user_id + '의 신체 정보 '+ req.body.result + '로 변경');
        return res.status(200).end();
      }
    });
  }
  else {
    return res.status(401).json({error: '로그인이 필요합니다.'});
  }
});

module.exports = router;