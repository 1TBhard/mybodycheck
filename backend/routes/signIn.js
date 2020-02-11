const express = require('express');
const router = express.Router();
var User = require('../models/user');

router.post('/pre_input', function(req, res) {
  User.findOne({password: req.body.password }, function(err, user) {
    if(err) return res.status(500).json({error: err});

    if(!user) return res.status(404).json({error: '이미 가입하거나 없는 id'});

    return res.json({ user })
  })
})

//checkLogin
router.post('/check', function(req, res) {

  // 찾은 값이 fucntion()의 매개변수 user에 들어감
  User.findOne({ id:req.body.user.id}, function(err, user){
  
    // 구문 error
    if(err) return res.status(500).json({error: err});
    // DB 안에 유저가 없을 시 
    if(!user) return res.status(404).json({error: 'ID가 존재하지 않습니다.'});
    // ID와 패스워드 불일치
    if(user.password != req.body.user.password)
      return res.status(404).json({error: 'ID와 패스워드가 일치하지 않습니다.'});

    console.log(user.name + ' 로그인 성공');
    // 여기까지 오면 로그인 성공, 따라서 세션에 값 설정
    // 세션 만들기

    req.session.user_id = user.id;
    req.session.user_name = user.name;
    req.session.user_level = user.level;
    
    console.log('세션 만들기 성공');

    res.json(user);
  })
});


module.exports = router;