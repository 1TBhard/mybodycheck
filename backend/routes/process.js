const express = require('express');
const router = express.Router();

router.post('/session_check', function (req, res, next) {
  // 세션이 존재하면
  if(req.session.user_id) {
    return res.json({
      id: req.session.user_id,
      name: req.session.user_name,
      level: req.session.user_level
    })
  }
  else {
    return res.status(401).json({error: '로그인이 필요합니다.'});
  }

});

// 로그아웃
//설정된 쿠키정보를 본다
router.post('/logout',  function (req, res) {
  console.log('/process/logout 라우팅 함수호출 됨');
  
  if (req.session.id) {
    console.log('로그아웃 처리');

    req.session.destroy(
      function (err) {
        if (err) {
            console.log('세션 삭제시 에러');
            res.send(false);
				}
				else {
					console.log('세션 삭제 성공');
					res.send(true);
				}
      }
    );
  
  }
  else{
    console.log('로그인 안되어 있음');
    // res.redirect('/login-page');
  }
  }
);

module.exports = router;