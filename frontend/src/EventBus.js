import Vue from "vue";
export default new Vue()

// 보내는 곳
// this.user = response.data;              // 서버에서 받아온 사용자 정보 삽입
//           EventBus.$emit('triggerEventBus', false, this.user.name )    // 이벤트 버스로 데이터 보내기
//           this.$router.push('/')


// 받는 곳
// mounted() {
	// 	EventBus.$on('triggerEventBus', (login_value, user_name) => {
	// 		this.login_mode = false;
	// 		this.login_user_name = user_name;
	// 	})
	// },