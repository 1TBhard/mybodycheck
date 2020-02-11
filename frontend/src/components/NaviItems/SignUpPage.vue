<template>
	<div id="signup_root">
		<div id="signup">
			<div class="center_things Do_Hyeon">
				<h1>회원가입</h1>
			</div>
			<div>
  			<b-form>
					<b-form-group 
						label="아이디:"
						label-for="id_input"
						class="m-3"
					>
						<b-input-group>
							<b-form-input
								id="id_input"
								:state="id_validation"
								v-model="form.id"
								required 
								placeholder="id입력(5-12글자)"
							/>
							<b-input-group-append>
								<b-button variant="info" @click="id_duplicate" :disabled="id_length_fun">중복확인</b-button>
							</b-input-group-append>
							<b-form-invalid-feedback :state="id_validation">
								id는 5-12 글자이며 중복되지 않아야합니다.
							</b-form-invalid-feedback>
						</b-input-group>
						<!-- 숫자 대소문자 5-12 글자 아닌 경우-->

					</b-form-group>

					<b-form-group
						label="패스워드"
						label-for="password_input"
						class="m-3"
					>

						<label class="sr-only" for="password_input">Password</label>
						<b-input 
							id="password_input" 
							type="password"
							:state="password_validation"
							v-model="form.password"
							placeholder="패스워드 입력(5-20글자)"
						/>

						<!-- 패스워드 재입력 -->
						<label class="sr-only" for="password_reinput">Password</label>
						<b-input-group-append>
						<b-input
							id="password_reinput"
							type="password"
							:state="password_pass"
							v-model="password_check"
							placeholder="패스워드 재입력"
						/>
						</b-input-group-append>

						<b-form-invalid-feedback :state="password_validation">
							패스워드는 5글자 이상이여야 합니다.
						</b-form-invalid-feedback>

					</b-form-group>

					<b-form-group
						label="이름"
						label-for="name_input"
						class="m-3"
					>
						<label class="sr-only" for="name_input">Name</label>
						<b-input
							id="name_input"
							:state="name_pass"
							v-model="form.name"
							:placeholder="form.name"
						/>
						<b-form-invalid-feedback :state="name_pass">
							이름을 입력하지 않았습니다.
						</b-form-invalid-feedback>
					</b-form-group>

					<b-form inline class="m-3">
						<b-form-group label="성별" class="mr-5 mb-3">
							<b-form-radio-group >
  	    					<b-form-radio v-model="form.sex" name="sex_pool" value="M">남</b-form-radio>
  	    					<b-form-radio v-model="form.sex" name="sex_pool" value="w">여</b-form-radio>
							</b-form-radio-group>
							<b-form-invalid-feedback :state="sex_pass">
								성별을 선택해주십시오
							</b-form-invalid-feedback>
  	  			</b-form-group>

						<b-form-group label="생년월일" class="align-items-lg-end">
							<b-form-input v-model="form.birthday" type="date" />
							<b-form-invalid-feedback :state="birthday_pass">
								생년월일을 선택해주십시오
							</b-form-invalid-feedback>
						</b-form-group>
					</b-form>

					<b-form-group label="이메일" class="m-3">
						<!-- 이메일 입력폼  -->
						<b-form inline>
							<label class="sr-only" for="email_id">Email Id</label>
							<b-input
								id="email_id"
								v-model="email_l"
								class="mb-2 mb-sm-0"
								:placeholder="email_l"
							/>

							<label class="sr-only" for="email_adress">Email Address</label>
							<b-input-group prepend="@" >
								<b-form-select
									:value="null"
									v-model="address_selected"
									:options="eamil_address_pool"
									id="email_adress"
								>
									<template v-slot:first>
										<option :value="null" selected="address_selected" disabled>선택</option>
									</template>
								</b-form-select>
							</b-input-group>

							<label class="sr-only" for="email_address_direct">Email Adress Direct</label>
  		    		<b-input id="email_address_direct"
								:placeholder="email_r"
								v-model="email_r"
								:disabled="address_selected != '직접입력'"></b-input>

						</b-form>
						<b-form-invalid-feedback :state="email_pass">
							이메일이 완벽하게 입력해야 합니다
						</b-form-invalid-feedback>
					</b-form-group>
					<!-- <b-alert :show="name_pass && password_pass" variant="success">회원가입 성공!</b-alert> -->

  			</b-form>
			</div>
			<div class="center_things">
				<b-button 
					@click="submit"
					class="center_things w-50 mt-5"
					type="signUp"
					size="lg"
					variant="primary">
					가입
				</b-button>
			</div>
		</div>
	</div>

</template>

<script>
      
export default {
    data() {
			return {
				form: {
					id:'',
					password: '',
					name: '',
					email: '',
					sex: '',
					birthday:''
				},
				password_check: '',
				email_r: '',
				email_l: '',

				cur_passed_id: null,		// 중복성 통과한 id 명, 
				name_pass: null,
				password_pass: null,
				sex_pass: null,
				birthday_pass: null,
				email_pass: null,

				past_email: '',
				address_selected: '직접입력',
				eamil_address_pool: [
					"naver.com",
					"daum.net",
					"gamil.com",
					'직접입력'
				]
			}
		},

		mounted() {
			var cur_url = document.location.href.split('/')
			this.past_email = cur_url[cur_url.length - 1]
			this.$http.post('/api/signUp/pre_setting', { email: this.past_email}
			)
			.then((response) => {
				this.form.name = response.data.result.name

				var temp_email = response.data.result.email.split('@', 2)
				this.email_l = temp_email[0]
				this.email_r = temp_email[1]
			},
			(err) => {
				alert('error, 잘못된 접근혹은 DB 에러입니다.')
				this.$router.push({name:'Home'})
			})
		},

		computed: {
			id_length_fun: function() {
				return this.form.id.length == 0
			},

			id_validation: function() {
				if (this.form.id.length == 0)
					return null
				else if (this.cur_passed_id==false || (this.form.id.length < 5 || this.form.id.length > 12))
					return false
				else if (this.cur_passed_id == this.form.id && (this.form.id.length > 4 && this.form.id.length < 13))
					return true
			},

			password_validation: function() {
				if(this.form.password.length == 0 || !this.form.password)
					return null
				else
					return (this.form.password.length > 4 && this.form.password.length < 21)
			},
		},
		
		methods: {
			id_duplicate() {
				// 패스 워드 체크
				if(this.password_check != this.form.password) {
					console.log('패스워드 일치하지 않음')
					password_pass = false
					return
				}

				this.$http.post('/api/signUp/checkIdDuplicate', {
					id: this.form.id
				})
					.then((response) => {
						// id 중복 있는 경우
						if (response.data == true) {
							this.cur_passed_id = false
							alert('사용할 수 없는 id 입니다.')
						}
						else {
							// 중복성 테스트 통과한 id 저장
							this.cur_passed_id = this.form.id
							alert('사용가능한 id 입니다.')
						}
					},
					(error) => { // error 를 보여줌
						console.log('User 콜랙션이 없으나 id는 중복 안됨')
						this.cur_passed_id = this.form.id
						alert('사용가능한 id 입니다.')
			  	})
			  .catch(error => {
					
					alert(error)
			  })
			},


			// 제출 버튼에 바인딩, 입력된 id, password 가 글자수에 맞는지 확인
			submit: function (event) {
				
				
				// 입력한 패스워드와 재입력한 패스워드 같은지 확인
				this.password_pass = this.form.password == this.password_check

				// 이름 길이 확인
				this.name_pass = this.form.name.length > 0

				// 
				this.sex_pass = this.form.sex.length > 0
				this.birthday_pass = this.form.birthday.length >0

				// 이메일 설정
				if(this.address_selected == '직접입력')
					this.form.email = this.email_l + '@' + this.email_r
				else
					this.form.email = this.email_l + '@' + this.address_selected

				this.email_pass = (this.form.email.indexOf('.') != -1)

				// 패스워드 불일치 혹은 이름 입력 안한 경우 회원가입 못함
				if (!this.password_pass || !this.name_pass || !this.sex_pass || !this.birthday_pass || !this.email_pass ) {
					return alert("모든 정보가 입력되지 않았습니다.")
				}

				if(this.cur_passed_id != this.form.id) {
					return alert("아이디 중복 확인을 해야합니다.")
				}

				this.form.birthday = this.form.birthday.slice(0,10)

			  // 백엔드로 회원가입한 유저의 정보 넘김
			  this.$http.post('/api/signUp/submit', { //axios 사용
					user: this.form,
					past_email: this.past_email
			  })
			  .then((response) => {
			    // 회원가입 실패
			    if (response.data.result == false) {
			      alert('에러, 다시 시도해 주세요')
			    }
			    // 회원가입 성공
			    else if (response.data.result == true) {
			      alert('회원가입 성공')
			      this.$router.push('/')    // 홈페이지로
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


<style scoped>

	#signup_root {
		width: 100%;
		min-height: calc(100vh - 50px);
		background:linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('../../pic/login_pic.jpg'), center, center fixed;
		background-size:cover;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	#signup {

		margin: 0 auto;
		margin-top: 30px;
		max-width: 570px;
		background-color:white;
    border-radius: 10px;
		align-items: center;
	}

	.center_things {
		text-align: center;
	}

	button {
		margin-bottom: 20px;
	}

	@media screen and (max-width : 800px) {
		#signup{
			max-width:100%
			
		}
	}

</style>