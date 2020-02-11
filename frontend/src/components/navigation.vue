<template>
	<div id="navbar_wrap">
		<div id="navbar">
			<!-- 로고이자 홈버튼-->
			<span class="logo">
				<router-link to="/">
					<img src="@/assets/logo.png"/>
					<img id="logo_name" src="@/assets/logo_name.png">
				</router-link>
			</span>

			<!-- 클릭 메뉴 아이템들 -->
			<div class="nav-tabs">

				<!-- 로그인 전 '로그인', 로그인 후 '로그아웃'으로 나오게 됨 -->
				<span v-if="this.user.name == null">
					<router-link to="/login-page">로그인</router-link>
				</span>
				<span id="welcome" v-if="this.user.name != null">
					<p class="m-0">안녕하세요 {{ this.user.name }} 님</p>
				</span>

				<span v-if="this.user.name != null">
					<!-- router-link 는 v-on 감지 못함 그래서 .native 달음 -->
					<router-link @click.native="logout_fun" to="/logout">로그아웃</router-link>
				</span>

				<!-- 로그인 전 '로그인', 로그인 후 '로그아웃'으로 나오게 됨 -->
				<span v-if="this.user.level<3">
					<router-link to="/add-person-page">회원추가</router-link>
				</span>

				<span v-if="this.user.level<4">
					<router-link to="/history-page">히스토리</router-link>
				</span>

				<span v-if="this.user.level<3">
					<router-link to="/manage-page">회원관리</router-link>
				</span>

				<!-- <span>
					<router-link to="/signup-page">t회원가입</router-link>
				</span> -->

				<!-- <span>
					<router-link to="/schedule-page">t스케줄</router-link>
				</span> -->

				<!-- <span v-for="item in must_be_login_menu" :key="item.id">
					<router-link @click.native="check_login" v-bind:to="item.link">{{ item.text }}</router-link>
				</span> -->

				<span>
					<router-link to="/body-check">체형측정</router-link>
				</span>

				<span>
					<router-link to="/exercise-page">운동정보</router-link>
				</span>
			</div>

			<div id="icon_menu" @click="toggle_menu()">
  			<div class="bar1"></div>
  			<div class="bar2"></div>
  			<div class="bar3"></div>
			</div>
		</div>
		<div>
			<b-collapse id="mobile_menu">
				<div v-if="this.user.name == null" @click="toggle_menu">
						<router-link to="/login-page" tag="button">로그인</router-link>
				</div>

				<div v-if="this.user.name != null" @click="toggle_menu">
					<p class="m-0">안녕하세요 {{ this.user.name }} </p>
					<!-- router-link 는 v-on 감지 못함 그래서 .native 달음 -->
					<router-link to="/logout" @click.native="logout_fun" tag="button">로그아웃</router-link>
				</div>

				<div v-if="this.user.level<3" @click="toggle_menu">
					<!-- 로그인 전 '로그인', 로그인 후 '로그아웃'으로 나오게 됨 -->
					<router-link to="/add-person-page" tag="button">회원추가</router-link>
				</div>

				<div v-if="this.user.level<4" @click="toggle_menu">
					<router-link to="/history-page" tag="button">히스토리</router-link>
				</div>

				<div v-if="this.user.level<3" @click="toggle_menu">
					<router-link to="/manage-page" tag="button">회원관리</router-link>
				</div>
				
				<div @click="toggle_menu">
					<router-link to="/body-check" tag="button">체형측정</router-link>
				</div>

				<div @click="toggle_menu">
					<router-link to="/exercise-page" tag="button">운동정보</router-link>
				</div>				
			</b-collapse>
		</div>
  </div>
</template>


<script>
export default {
	data: function() {
		return {
			user: {
				name: '',
				level: 4
			},
		}
	},
	
	created() {
		this.$http.post('/api/process/session_check'
			).then(
				(response) => {
					this.user = response.data;
				},
				(error) => {
					console.log('로그인 에러')
					this.user.name = null
				}
			)
	},
	
	methods: {
		
		// 로그아웃 함수
    logout_fun: function (event) {
			console.log('로그아웃')
			this.user = {}			// 메뉴바에서 다시 '로그아웃'에서 '로그인' 보이게

      this.$http.post('/api/process/logout').then(
				(response) => {  			//로그 아웃 성공
					this.user.name = null
					this.$router.push('/logout')
        },
        (error) => { 					// error 를 보여줌
          alert(error.response.data.error)
					this.$router.push('/')
        }
      )
    },

		toggle_menu: function() {

			// 모바일 아이콘 토글
			document.getElementById('icon_menu').classList.toggle("change");

			// 모바일 메뉴바 open / close
			this.$root.$emit('bv::toggle::collapse', 'mobile_menu');
		}
	}
}
</script>


<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR');

#navbar_wrap {
	position: fixed;
	width: 100%;
	background-color: orange;
	text-align: center;
	z-index: 100;
}

#navbar {
	width: 100vw;
	max-width: 1200px;
	margin: 0 auto;
	background-color: orange;
	height: 50px;
}

#navbar > .logo img{
	margin-left: 20px;
	float: left;
	width: auto;
	height: 100%;
}

#navbar > .logo img:nth-child(2){
	margin-left: 0;
	float: left;
	width: auto;
	height: 100%;
}

.nav-tabs {
	float:right;		/* 메뉴바에서 오른쪽으로 */
	display: inline-flex;
  align-items: center;
  height: 100%;
	width: auto;
	font-size : 20px;
	margin-left: 20px;
	margin-right: 40px;
	font-family: 'Noto Sans KR', sans-serif;
}

.nav-tabs span a {
	text-decoration: none; /* 하이퍼링크 밑줄 없애기 */
	color : rgb(63, 63, 63);			/* 글씨  고정 */
}

/* 네비게이션 글자 아래 밑줄 없애기 */
.nav-tabs {
	border-bottom: none;
}

.nav-tabs span a:hover {
	color : rgb(24, 45, 163);
	font-weight : bold
}

.nav-tabs > span {
  margin : 8px;
	align-items: center;
}

#welcome {
	font-size: 15px;
}

/* ================ 모바일시 메뉴 ================= */
#icon_menu {
  display: inline-block;
  cursor: pointer;
	margin: -9999px;
}

.bar1, .bar2, .bar3 {
  width: 35px;
  height: 5px;
  background-color: #333;
  margin: 6px 0;
  transition: 0.4s;
}

.change .bar1 {
  -webkit-transform: rotate(-45deg) translate(-9px, 6px);
  transform: rotate(-45deg) translate(-9px, 6px);
}

.change .bar2 {opacity: 0;}

.change .bar3 {
  -webkit-transform: rotate(45deg) translate(-8px, -8px);
  transform: rotate(45deg) translate(-8px, -8px);
}

#mobile_menu {
	display: none;
}

#mobile_menu button {
	width:100%;
	background-color: rgb(230, 120, 0);
	border: none;
	border-bottom: solid #783c00;
	margin: 0;
	text-align: left;

	font-family: 'Noto Sans KR', sans-serif;
	text-decoration: none; /* 하이퍼링크 밑줄 없애기 */
	color : rgb(63, 63, 63);			/* 글씨  고정 */
}

#mobile_menu button:hover {
	background-color: rgb(250, 120, 0);
}

/* ====================== 디바이스 일때 ================ */

@media screen and (max-width : 910px) {
	.nav-tabs {
		display: none;
	}

	#navbar {
		justify-content:space-between;
	}
	
	#icon_menu {
	  /* display: inline-block;
	  cursor: pointer; */
		float:right;		/* 메뉴바에서 오른쪽으로 */

		margin-top: 4px;
		margin-right:25px;
	}

	#mobile_menu {
		display:block;
	}

	#mobile_menu:active {
		
	}
	
}

@media screen and (max-width : 500px) {
	#logo_name {
		visibility: hidden;
	}
}
	

</style>