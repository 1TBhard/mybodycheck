const express = require('express');
const router = express.Router();
const util = require('util')

var User = require('../models/user');
var BodyImage = require('../models/bodyImage')
// var multer = require('multer')
// var fs = require('fs')
var moment = require('moment')
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// //*********************** 이어서 하기
const path = require('path')


// const upload = multer({
//   // limits: {
//   //   fileSize: 1024*1000*16
//   // }, 
//   dest: 'uploads/'
  
// });


// 사진 업로드
router.post('/upload_img',  function(req, res) { 
  var new_data = new BodyImage();

  new_data.name = req.body.name;           // 사용자 이름 설정
  new_data.email = req.body.email;         // 사용자 이메일 설정
  
  // 비대칭 신체 검사 결과 설정
  new_data.kneAsy = req.body.result.kneAsy
  new_data.pelAsy = req.body.result.pelAsy
  new_data.shoAsy = req.body.result.shoAsy
  new_data.angDef = req.body.result.angDef
  new_data.curBack = req.body.result.curBack
  new_data.turNeck = req.body.result.turNeck

  new_data.f_data = req.body.f_data;     // 정면 사진 설정
  new_data.s_data = req.body.s_data;      // 측면 사진 설정

  new_data.date = moment().format('YYYY-MM-DD hh:mm:ss');               // 저장 날짜 설정

  new_data.save(function(err) {
    if(err) return res.status(404).json({error: '파일 DB 업로드 실패'});
    res.send(true);
  });
  
});

// 파일 가져올 리스트(선택한 유저 사진의 날짜 리스트) 보냄
router.post('/load_list', function(req, res) {

  if(req.body.email == null) {
    BodyImage.find({}, function(err, list) {
      if(err) return res.status(404).json({ error: '이미지 리스트 DB 오류' })
  
      return res.json({list});
    }).select('date name') // _id 빼고 email, date 가져옴
  }

  else {
    BodyImage.find({email: req.body.email}, function(err, list) {
      if(err) return res.status(404).json({ error: '이미지 리스트 DB 오류' })

      return res.json({list});
    }).select('date name') // _id 빼고 email, date 가져옴
  }
});

// DB의 사진 불러오기
router.post('/load_img', function(req, res) {
  BodyImage.findOne({_id: req.body._id}, function(err, result) {
    if(err) return res.status(404).json({ error: '이미지 가져오기 오류' });
    res.json({result})
  }).select('-_id')
});

router.delete('/delete_img/:_id', function(req, res) {
  console.log(req.params + '히스토리 삭제')
  BodyImage.deleteOne({ _id:req.params._id}, function(err) {
    if(err) return res.status(500).json({error: '삭제하려는 데이터가 존재하지 않습니다.'})
    return res.json({result: true})
  })
});

module.exports = router;