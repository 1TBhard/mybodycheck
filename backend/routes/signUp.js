const express = require('express');
const router = express.Router();
var User = require('../models/user');
var nodemailer = require('nodemailer')

// Sign Up, 회원가입 id 중복성 확인
router.post('/checkIdDuplicate', function(req, res) {
  User.findOne({id: req.body.id}, function(err, user) {

    // db에 user 콜랙션 없는 경우 아이디 duplicate 는 없으므로
    if(err) return res.send(true)

    // 중복되는것 있을 때
    if(user) return res.send(true)
    // 중복 없으면
    else return res.send(false)
  })
})

// 회원가입 폼 제출시 회원가입 승인
router.post('/submit', function (req, res, next) {
  console.log(req.body)

  // 회원가입시 중복되는 id 있는지 또 재확인
  User.findOne({ id: req.body.user.id }, function (err, user) {
    if (err) return res.status(500).json({ error: err });

    if (user) return res.status(404).json({ error: '중복되는 아이디 입니다.' });

    // setting values
    var new_id = req.body.user.id;
    var new_password = req.body.user.password;
    var new_name = req.body.user.name;
    var new_email = req.body.user.email;
    var new_sex = req.body.user.sex;
    var new_birthday = req.body.user.birthday;
    
    User.update({email: req.body.past_email}, { $set: {
        id: new_id,
        password: new_password,
        name: new_name,
        email: new_email,
        sex: new_sex,
        birthday: new_birthday
      }}, function (err) {
        if (err) {
          return res.json({ result: false });
        }
        res.json({ result: true });
    });
  });
});

// 임시로 등록했던  사용자 정보를 회원가입폼에 셋팅
router.post('/pre_setting', function(req, res) {
  
  User.findOne({email: req.body.email, id: null}, function(err, result) {
    if (err) {
      return res.status(404).json({ error: err})
    }
    if (!result)
      return res.status(404).json({error: err})
    return res.json({result})
  });
});

// 회원가입 이메일 발송하는 함수
function pre_save_user(req, res) {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
      user: "",   // 제 개인 계정 아이디와 비밀번호가 
      pass: ""    // 들어가는 자리라 공백으로 표기했습니다.
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.verify(function(err, success) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: err})
    }
    else {
      console.log("Server is ready to take our messages");
    }
  });

  let mailOption = {
    from: 'wogkr1383@gmail.com',
    to: req.body.user.email,
    subject: '신비검 회원 가입 요청입니다.',
    text: '신비검에서 온 회원가입 요청입니다.\n\n'
      + 'https://mybodycheck.herokuapp.com/#/signup-page/' + req.body.user.email
  }

  transporter.sendMail(mailOption, function(err, info){
    if (err) {
      return res.status(500).json({error: err});
    } 
    else {
      console.log('Email sent: ' + info.response);
      console.log("새로운 사용자에게 초대장 발송");

      const user = new User();
      user.name = req.body.user.name;
      user.email = req.body.user.email;
      user.level = req.body.user.level;

      user.save(function (err) {
        if (err)
          return res.status(500).json({error: err});
      
        else
          return res.json({ result: true });
      });
    }
  });
}

// 임시로 사용자를 등록함
router.post('/pre_save', function(req, res) {

  User.findOne({ id:req.body.user.id}, function(err, user){
    if(err) {
      return res.status(500).json({error: "err"});
    }

    // 유저 있는 경우 이메일 중복이 된다고 메시지 날림
    else if(user)
      return res.json({ result: "Overlapped" });

    else
      return pre_save_user(req, res);
  });
});

router.delete('/delete_one_person/:email', function(req, res) {
  User.deleteOne({ email:req.params.email}, function(err) {
    if(err) return res.status(500).json({error: '삭제하려는 데이터가 존재하지 않습니다.'})
    return res.json({result: true})
  })
})

module.exports = router;
