const express = require('express');
const router = express.Router();
var User = require('../models/user');

router.post('/member_table', function(req, res, next) {
    User.find({}, {_id: 0, __v: 0, password: 0}, function(err, result){
        if(err) return res.status(404).json({error: '테이블이 존재하지 않습니다.'});
        
        // [{_id: adfads, name, addreess, 등...}, {..}]
        return res.json({result});
    });
});

router.put('/edit', function(req, res) {
    console.log(req.body.editData.id + ' 데이터 수정 시도')
    User.updateOne({email : req.body.editData.email}, req.body.editData, function(err, editData) {
        if(err) return res.status(500).json({error: err});
        
        // DB 안에 유저가 없을 시 
        if(!editData) return res.status(404).json({error: '사용자가 존재하지 않습니다.'});
        
        console.log('수정 성공');
        // 구문 error
        return res.send(true);
    });
});

router.post('/delete_item', function(req, res) {
    console.log(req.body)
    // 다중 삭제
    User.deleteMany({email: { $in: req.body.email_arr }}, function(err, delete_id) {
        if(err) return res.status(500).json({error: err});

        return res.send(true);
    });
});

router.get('/find_until_people', function(req, res) {
    User.find({ id: null }, function(err, result) {
        if(err) return res.status(500).json({error: err});

        return res.json({ result });
    });
});

module.exports = router;
