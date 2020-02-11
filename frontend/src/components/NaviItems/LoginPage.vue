<template>
<div id="login_pic">
  <div class="form">
  
  <b-form>
    <label
      class="mb-4 Do_Hyeon Big_font"
    >
      로그인
    </label>
    <label class="sr-only" for="login_id">LoginID</label>
    <b-input
      id="login_id"
      v-model="user.id"
      placeholder="아이디"
    />
    <label class="sr-only" for="login_password">LoginPassword</label>
    <b-input
      id="login_password"
      v-model="user.password"
      type="password"
      placeholder="패스워드"
      class="mt-3"
    >
    </b-input>

    <b-button block class="mt-3 Nunum_Noto" @click="login">로그인</b-button>
  </b-form>
  </div>
</div>
</template>

<script>
import EventBus from "../../EventBus"

export default {
  data () {
    return {
      user: {
      	id: '',
      	password: '',
      	name: ''
			},
      password_check: '',
      show_login: true
    }   
  },

  methods: {
  // 로그인 버튼
  login: function (event) {
    this.$http.post('/api/SignIn/check', {
      user: this.user
    })
    .then(
      (response) => {  //로그인 성공
        alert('로그인 성공')

        // 이벤트 버스로 로그인한 유저의 레벨 보내기
        EventBus.$emit('triggerEventBus', response.data.level )

        this.$router.push('/')
        this.$router.go()
      },
      (error) => { // error 를 보여줌
        alert(error.response.data.error)
      }
    )
    .catch(error => {
      alert(error)
    })
  },


  // 회원 가입 버튼
	signUp: function (event) {
    // 회원가입시 패스워드 체크
    if(this.user.password != this.password_check) {
      alert('패스워드가 일치하지 않습니다.')
      // this.$router.push('/login-page')          // 다시 로그인(회원가입) 창으로
      return;
    }
    
    // 백엔드로 회원가입한 유저의 정보 넘김
    this.$http.post('/api/SignIn/signUp', { //axios 사용
      user: this.user
    })
    .then((response) => {
      // 회원가입 실패
      if (response.data.result == false) {
        alert('에러, 다시 시도해 주세요')
      }
      // 회원가입 성공
      else if (response.data.result == true) {
        alert('회원가입 성공')
        // this.$router.push('/login-page')    // 로그인 페이지로 보내줌
      }
    },
    (error) => { // error 를 보여줌
      alert(error.response.data.error)
    })
    .catch(error => {
      alert(error)
    })
  }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR');

#login_pic {
	width: 100%;
	background:linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('../../pic/login_pic.jpg'), center, center fixed;
	background-size:cover;
	background-repeat: no-repeat;
	overflow: hidden;
  min-height: calc(100vh - 50px);
}

.form {
	position: relative;
  z-index: 1;
  background: #FFFFFF;
  border-radius: 10px;

  max-width: 400px;

  margin: auto auto;
  margin-top: 13%;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

button {
  background-color: orange;
  border: none;
  font-size: 17px;
  font-weight: bold;
}

</style>
