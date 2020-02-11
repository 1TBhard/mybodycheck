<template>
  <div id="app">
    <div id="nnavi">
      <navi />
    </div>
    <!-- <div>
      <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
        Dismissible Alert!
      </b-alert>
    </div> -->
    <div id="screen" >
      <router-view />
    </div>
  </div>
</template>

<script>
import navi from './components/navigation'
import sidebar from './components/sideBar'

var store = {
  debug: true,
  state: {
    is_login: false
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.is_login = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.is_login = ''
  }
}


export default {
  name: 'App',
  data() {
    return {
      showDismissibleAlert: true,
    }
  },

  components: {
    navi
  },
  methods: {

  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Do+Hyeon|Nanum+Gothic+Coding|Noto+Sans+KR&display=swap');
@import url('https://fonts.googleapis.com/css?family=Nanum+Gothic&display=swap" rel="stylesheet"');


body {
  margin: 0;
}

#nnavi {
  width: 100%;
  height: 50px;
}

#screen {
  background-color:white;
  position: relative;
  /* top: 50px; */
  width: 100%;
  height: auto;
  align-items: center;
  display: inline-flex;
  flex-direction: column;
  align-items: cover;
}

#app {
  background-color: orange;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Big_font {
  font-size: 3rem;
}

.Do_Hyeon {
  font-family: 'Do Hyeon', sans-serif;
}

.Nanum_Gothic {
  font-family: 'Nanum Gothic', sans-serif;
}

.Nunum_Noto {
  font-family: 'Noto Sans KR', sans-serif;
}

/* font-family에 지정한 글꼴에 따라 글꼴 크기가 다르기 때문에 문제가 될 여지가 있기 때문에 사용 */
* {
  font-size-adjust: 0.58;
}

/* b-container 의 크기 맞추기(홈 화면 그림) */

.font_bold {
  font-weight: bold;
}

html {
  font-size: 15px
}

.img_darker { 
  filter: brightness(50%); 
}

.btn.btn-primary:disabled{
    background-color: #808080;
    box-shadow: 1px 1px 1px 1px black;
    border: none;
}

#db_view > .custom-control {
  min-width: 200px;
}

@media screen and (max-width: 800px) {
  /* .media_800_min_100 {
    min-width:100%;
  } */
}

</style>
