<template>
  <div id="logout">
		<div class="form">
			<b-form>
				<h1 class="Do_Hyeon">로그아웃</h1>
				<h1 class="Do_Hyeon">되었습니다.</h1>
			</b-form>
		</div>
  </div>
    
</template>
<script>

export default {
    
}
</script>

<style scoped>

#logout {
  width: 100%;
	background:linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('../../pic/login_pic.jpg'), center, center fixed;
	background-size:cover;
	background-repeat: no-repeat;
	overflow: hidden;
	min-height: calc(100vh - 50px);
}

.form {
  z-index: 1;
  background: #FFFFFF;
  border-radius: 10px;

  max-width: 500px;
  margin: auto auto;
  padding: 45px;
	margin-top: 17%;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

</style>