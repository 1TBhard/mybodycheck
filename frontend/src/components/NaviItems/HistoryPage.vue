<template>
  <div id="history">

    <span class="my-table-half mr-4 mt-4">
      <div>
        <button class="select-history" v-b-modal.select_left_pic>
          비교1 사진 입력
        </button>
      </div>
      <div>
        <canvas id="front_canvas_1" />
        <canvas id="side_canvas_1" />
      </div>
      <div>
        <BodyTable :result="result_1" class='my-table-half' />
      </div>
    </span>

    <span class="my-table-half mt-4">
      <div>
        <button class="select-history" v-b-modal.select_right_pic>
          비교2 사진 입력
        </button>
      </div>
      <div>
        <span><canvas id="front_canvas_2" /></span>
        <span><canvas id="side_canvas_2" /></span>
      </div>
      <div>
        <BodyTable :result="result_2" class='my-table-half' />
      </div>
    </span>

     <!-- ======== 좌측 사진 넣기 ======== -->
    <b-modal 
      id="select_left_pic"
      title="비교 1 사진"
      >
      <div v-if="loaded">
        <b-spinner label="Spinning"></b-spinner>
      </div>
      <div v-else>
        <b-form-select v-model="selected_id" :options="options" :select-size="4"></b-form-select>
      </div>

      <template v-slot:modal-footer="{hide}">
        <b-button @click="get_image('front_canvas_1', 'side_canvas_1', result_1)" variant="primary">
          선택
        </b-button>

        <b-button @click="delete_image" variant="danger">
          삭제
        </b-button>

        <b-button @click="hide()">
          닫기
        </b-button>

      </template>
    </b-modal>

    <!-- ======== 우측 사진 넣기 ======== -->
    <b-modal 
      id="select_right_pic"
      title="비교 2 사진"
      >
      <div v-if="loaded">
        <b-spinner label="Spinning"></b-spinner>
      </div>
      <div v-else>
        <b-form-select v-model="selected_id" :options="options" :select-size="4"></b-form-select>
      </div>

      <template v-slot:modal-footer="{hide}">
        <b-button @click="get_image('front_canvas_2', 'side_canvas_2', result_2)" variant="primary">
          선택
        </b-button>

        <b-button @click="delete_image" variant="danger">
          삭제
        </b-button>

        <b-button @click="hide()">
          닫기
        </b-button>

      </template>
    </b-modal>
  </div>
</template>


<script>
import BodyTable from './BodyCheckSub/BodyTable.vue'

export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
      },
      selected_id: '',    // 모달에서 현재 선택한 BodyImage의 _id
      options: [],        // 모달 리스트 박스에 들어가는 아이템들
      loaded: true,
      result_1: {'kneAsy':'', 'pelAsy':'', 'shoAsy':'', 'angDef':'', 'curBack':'', 'turNeck':''},
      result_2: {'kneAsy':'', 'pelAsy':'', 'shoAsy':'', 'angDef':'', 'curBack':'', 'turNeck':''},
    }
  },

  components: {
    BodyTable
  },

  created() {
    // // 로그인 체크
		console.log('로그인 확인')
		this.$http.post('/api/process/session_check'
		).then(
			(response) => {
				
			},
			(error) => {
				alert(error.response.data.error)
        this.$router.push('/')
			}
		)
  },

  mounted() {
    this.user = this.$route.params

    this.loaded = true;    // 로딩 시작

    this.load_list()
  },

  methods: {
    // 사진은 안부르고 저장된 과거 리스트 가져옴
    load_list: function() {
      this.$http.post('/api/file/load_list', {email: this.user.email})
      .then((response) => {
        var file_list = response.data.list
        var temp = []

        for(var i=0 ; i< file_list.length ; i++)
          temp.push({
            value: file_list[i]._id,
            text: file_list[i].name +' ' + file_list[i].date.slice(0, 10)
                +' ' +file_list[i].date.slice(11, 19)
          })
        this.options = temp
      })
      .catch(function (error) {
        alert(error);
      })
      
      this.loaded = false;
    },

    get_image: function (f_canvas_id, s_canvas_id, target_table) {

      this.$http.post('/api/file/load_img', {_id: this.selected_id})
      .then((response) => {
        var f_canvas= document.getElementById(f_canvas_id);
        var s_canvas = document.getElementById(s_canvas_id);
       
        this.load_img_canvas(f_canvas, response.data.result.f_data)
        this.load_img_canvas(s_canvas, response.data.result.s_data)
        
        // 좌측 모달 창 닫기
        this.$root.$emit('bv::hide::modal', 'select_left_pic', '#btnShow')
        
        // 결과 정보 복사
        for(var key_name in target_table) {
          target_table[key_name] = response.data.result[key_name]
        }

        // 우측 모달 창 닫기
        this.$root.$emit('bv::hide::modal', 'select_right_pic', '#btnShow')
      })
    },

    load_img_canvas: function(canvas, url) {
      var img = new Image()
      img.onload = function() {
        canvas.height = canvas.width *(img.height/img.width)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)  
      }
      img.src = url
    },


    delete_image: function() {
      this.loaded = true
      this.$http.delete('/api/file/delete_img/' + this.selected_id)
      .then((response) => {
        this.load_list()
      })
      this.loaded = false
    }
  }
}
</script>


<style scoped>
#history {
  display: inline-flex;
  flex-direction: row;
  margin: auto auto;
}

.my-table-half  {
  width:45vw;
}

#front_canvas_1{
  background-color: pink;
  margin-top: 15px;
  width: 22vw;
}

 #side_canvas_1{
  background-color: pink;
  margin-top: 15px;
  width: 22vw;
  float:right;
 }

#front_canvas_2{
  background-color: burlywood;
  margin-top: 15px;
  width: 22vw;
}

#side_canvas_2  {
  background-color: burlywood;
  margin-top: 15px;
  width: 22vw;
  float: right;
}

.select-history {
  width: 100%;
  height: 40px;
  background-color: grey;
  color:white;
  border: 1px;
  border-radius: 5px;
  font-size: 17px;
  margin-top: 20px;
}

/* 버튼 선택색 */
.select-history:active {
  background-color: black;
}

/* 버튼 호버색 */
.select-history:hover {
  background-color: black;
}

.b_orange_and_w_white {
  background-color:orange;
  color: white;
}

/* =======================  미디어 ======================= */
@media screen and (max-width : 1000px) {

  #history {
    /* width: 100vw; */
    display: inline-flex;
    flex-direction: column;
  }

	#front_canvas_1, #side_canvas_1, #front_canvas_2, #side_canvas_2 {
    min-width: 42vw;
    /* margin: 1vw */
  }

  .my-table-half  {
    width:100%
  }

  /* .select-history {
    width: 90vw;
  } */
}

@media screen and (max-width : 1000px) {

	#front_canvas_1, #side_canvas_1, #front_canvas_2, #side_canvas_2 {
    width: 44vw;
  }
}

@media screen and (max-width : 600px) {

	#front_canvas_1, #side_canvas_1, #front_canvas_2, #side_canvas_2 {
    width: 100%;
    float:none;
  }
}

</style>
