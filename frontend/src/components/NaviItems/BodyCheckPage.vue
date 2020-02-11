<template>
  <div id = "body-cehck-page">
    <div class="mt-4">
      <b-container>
        <b-row>
          <b-col sm="6">
            <b-form-file 
              v-model="front_imageData"
              :state="Boolean(front_imageData)"
              placeholder="정면사진 입력"
              @change="preview_img_change('front_canvas')"
              :disabled="result_process_end"
              accept="image/*" />

            <canvas id="front_canvas" />
          </b-col>

          <b-col sm="6">
            <b-form-file 
              v-model="side_imageData"
              :state="Boolean(side_imageData)"
              placeholder="측면사진 입력"
              @change="preview_img_change('side_canvas')"
              :disabled="result_process_end"
              accept="image/*" />

            <canvas id="side_canvas" />
          </b-col>
        </b-row>
      </b-container>
    </div>
    

    <div v-if="result_process_end" class="mt-5">
      <BodyTable :result="result"></BodyTable>
    </div>

    <div class="mt-4">
      <b-button class='b_orange_and_w_white check_body_button' v-if="!result_process_end" @click="excute_body_check" variant="warning">신체분석</b-button>
      <b-button @click="reset" class='check_body_button' v-if="result_process_end" variant="danger">리셋하기</b-button>
      
      <b-button class='check_body_button'
        @click="upload_img"
        variant="primary"
        :disabled="can_upload"
      >업로드</b-button>
    </div>

    <div>
      <img id="test_result" />
    </div>
    <div id="fixed-loading" v-if="result_process_end === false" class="align-content-center mt-4">
			<strong class="loading" >Loding</strong>
			<b-spinner class="loading" small type="grow"></b-spinner>
			<b-spinner class="loading" small type="grow"></b-spinner>
			<b-spinner class="loading" small type="grow"></b-spinner>
		</div>
  </div> 
</template>

<script>
import * as posenet from '@tensorflow-models/posenet';  // 포즈넷
import BodyTable from './BodyCheckSub/BodyTable.vue';
import loadImage from 'blueimp-load-image';

// 포즈넷 조절
const imageScaleFactor = 0.6;
const outputStride = 8;
const flipHorizontal = false;
var bias = 0.12;     // 보정값
var side_bias = 10;

// a, b 점의 평균 구하는 함수
function make_avg(a, b) {
  return {
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2
  };
}

// 측면 사진일 때, 선 그리기
function draw_side_lines(keypoints_array, i, j, ctx) {
  var temp_pos_1 = make_avg(keypoints_array[i].position, keypoints_array[i+1].position);
  var temp_pos_2 = make_avg(keypoints_array[j].position, keypoints_array[j+1].position)

  ctx.beginPath();
  ctx.moveTo(temp_pos_1.x, temp_pos_1.y);
  ctx.lineTo(temp_pos_2.x, temp_pos_2.y);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.arc(temp_pos_1.x, temp_pos_1.y, 2, 0, 2 * Math.PI);  
  ctx.fillStyle  = "red";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(temp_pos_2.x, temp_pos_2.y, 2, 0, 2 * Math.PI);
  ctx.fillStyle  = "red";
  ctx.fill();
  ctx.stroke();
}

// 정면 사진일 때, 선 그리기
function draw_front_lines(k_1, k_2, ctx) {
  ctx.beginPath();
  ctx.moveTo(k_1.x, k_1.y);
  ctx.lineTo(k_2.x, k_2.y);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.arc(k_1.x, k_1.y, 2, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(k_2.x, k_2.y, 2, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.stroke();
}

export default {
  data() {
    return {
      user: {
        name: null,
      	email: null
			},
      front_imageData : '',       // 정면사진
      side_imageData: '',         // 측면사진
      result_process_end: null,   // 신체 검사 결과 후 결과 창을 보여줄지 말지
      // 순서대로 무릎,    골반,     어깨 비대칭,   휜다리,    굽은 등,    거북목
      result: {'kneAsy':'', 'pelAsy':'', 'shoAsy':'', 'angDef':'', 'curBack':'', 'turNeck':''},
      is_mobile: 1,           // 현재 환경이 모바일?
    }
  },

  components: {
    BodyTable
  },

  computed: {
    can_upload() {
      return (this.result_process_end === null) || (typeof(this.user.name) === "undefined")
    }
  },

  created() {

    var filter = "win16|win32|win64|mac";

    // 모바일인지 체크
    if(navigator.platform){
      if(0 > filter.indexOf(navigator.platform.toLowerCase())){
        this.is_mobile = true
      }
    }

  },

  mounted() {
    this.user = this.$route.params
  },

  methods: {

    preview_img_change: function(canvas_name) {
      var reader = new FileReader();
      var file = event.target.files[0];
      var draw_canvas = document.getElementById(canvas_name);
      var ctx = draw_canvas.getContext('2d');
      
      loadImage(file, function(img, data) {
          if (img.type === "error") {
            console.error("Error loading image " + imageUrl);
          } else {
            draw_canvas.width = img.width
            draw_canvas.height = img.height
            ctx.drawImage(img, 0,0, draw_canvas.width, draw_canvas.height)
          }
        },
        { 
          maxWidth: 400,      // 이미지 최대 너비(캔버스에 맞춤)
          orientation: this.is_mobile       // 모바일이면 자동 회전
        }
      )
    },

    // 비대칭 신체 검사 버튼에 바인딩
    excute_body_check: function(event) 
    {
        this.result_process_end = false;      // 검사 완료 false 상태로

        var front_preview_canvas = document.getElementById("front_canvas");   // 클래스가 preview인 HTMLCollection 얻음
        var side_preview_canvas = document.getElementById("side_canvas");   // 클래스가 preview인 HTMLCollection 얻음

        // 비대칭 신체검사 시작
        this.estimatePoseOnImage(front_preview_canvas, side_preview_canvas);
    },

    save_abnormal: function (event) {
      this.$http.post('/api/body_check/save_abnormal', {  // 신체 정보 db에 업데이트
        result: this.result
      })
      .then(
        (response) => { 
          this.$router.push('/recom-process/survey');   // 조사 페이지로 이동
        },
        (error) => {
          alert(error.data.error);
          this.$router.go();
        }
      )
      .catch(error => {
        alert(error)
      })
    },

  // ========================================================================================
  // ====================================== 포즈넷 관련 ======================================
  // ========================================================================================
    estimatePoseOnImage: function(f_imageElement, s_imageElement) {
      // load the posenet model from a checkpoint
      // const net = await posenet.load();
      // const pose = await net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride);

      var result = {}

      // ================================== 정면 사진 검사 ==========================================
      posenet.load(


      ).then(function(net){
        return net.estimateSinglePose(f_imageElement, imageScaleFactor, flipHorizontal, outputStride)
      }).then(function(pose){
        
        var darw_canvas = document.getElementById('front_canvas');
        var ctx = darw_canvas.getContext('2d');
        var _key_array_ = pose.keypoints;

        // ================================= 캔버스에 그리기 ================================= 
        // draw_points(pose.keypoints, ctx)
        draw_front_lines(pose.keypoints[15].position, pose.keypoints[16].position, ctx);
        draw_front_lines(pose.keypoints[13].position, pose.keypoints[14].position, ctx);
        draw_front_lines(pose.keypoints[11].position, pose.keypoints[12].position, ctx);
        draw_front_lines(pose.keypoints[5].position, pose.keypoints[6].position, ctx);

        // ================================= 정면 검사 =================================
        var Ankle_Gradient = (_key_array_[15].position.y - _key_array_[16].position.y) / (_key_array_[15].position.x - _key_array_[16].position.x);   // 발목 기울기
        var Knee_Gradient = (_key_array_[13].position.y - _key_array_[14].position.y) / (_key_array_[13].position.x - _key_array_[14].position.x);        // 무릎 기울기
        var Pelvis_Gradient = (_key_array_[11].position.y - _key_array_[12].position.y) / (_key_array_[11].position.x - _key_array_[12].position.x);        // 골반(엉덩이) 기울기
        var Shoulder_Gradient = (_key_array_[5].position.y - _key_array_[6].position.y) / (_key_array_[5].position.x - _key_array_[6].position.x);        // 어깨 기울기

        if(Knee_Gradient < Ankle_Gradient + bias + 0.1 && Knee_Gradient > Ankle_Gradient - bias - 0.1)
        {    
            result['kneAsy']= false;
        }
        else
        {
            result['kneAsy']= true;
        }

        if(Pelvis_Gradient < Ankle_Gradient + bias + 0.1 && Pelvis_Gradient > Ankle_Gradient - bias - 0.1)
        {    
            result['pelAsy']= false;
        }
        else
        {
            result["pelAsy"]= true;
        }

        if(Shoulder_Gradient < Ankle_Gradient + bias && Shoulder_Gradient > Ankle_Gradient - bias)
        {    
            result["shoAsy"]= false;
        }
        else
        {
            result["shoAsy"]= true;
        }

        // console.log("발목선 각도: " + Ankle_Gradient);
        // console.log("무릎선 각도: " + Knee_Gradient);
        // console.log("골반선 각도: " + Pelvis_Gradient);
        // console.log("어깨선 각도: " + Shoulder_Gradient);

      })


      // ================================== 측면 사진 검사 ==========================================
      posenet.load().then(function(net){
        return net.estimateSinglePose(s_imageElement, imageScaleFactor, flipHorizontal, outputStride)
      }).then(function(pose){
        var darw_canvas = document.getElementById('side_canvas');
        var ctx = darw_canvas.getContext('2d');
        var _key_array_ = pose.keypoints;

        // ================================= 캔버스에 그리기 =================================
        draw_side_lines(_key_array_, 15, 13, ctx);
        draw_side_lines(_key_array_, 13, 11, ctx);
        draw_side_lines(_key_array_, 11, 5, ctx);
        draw_side_lines(_key_array_, 5, 3, ctx);

        // ================================= 측면 검사 =================================
        var avg_Ankle_point = make_avg(_key_array_[15].position, _key_array_[16].position);
        var avg_Knee_point = make_avg(_key_array_[13].position, _key_array_[14].position);
        var avg_Hip_point = make_avg(_key_array_[11].position, _key_array_[12].position);
        var avg_Shoulder_point = make_avg(_key_array_[5].position, _key_array_[6].position);
        var avg_Ear_point = make_avg(_key_array_[4].position, _key_array_[3].position);

        // 각도 반환 함수
        function calcAngleDegrees(x, y) {
            return Math.atan2(y, x) * 180 / Math.PI;
        } 

        var Ankle_to_Knee = calcAngleDegrees(avg_Ankle_point.x - avg_Knee_point.x, avg_Ankle_point.y - avg_Knee_point.y);
        var Knee_to_Hip = calcAngleDegrees(avg_Knee_point.x - avg_Hip_point.x, avg_Knee_point.y - avg_Hip_point.y);
        var Hip_to_Shoulder = calcAngleDegrees(avg_Hip_point.x - avg_Shoulder_point.x, avg_Hip_point.y - avg_Shoulder_point.y);
        var Shoulder_to_Ear = calcAngleDegrees(avg_Shoulder_point.x - avg_Ear_point.x, avg_Shoulder_point.y - avg_Ear_point.y);

        
        // 발목에서 무릎까지 각도 검사 && 무릎에서 골반까지 각도 검사
        if (((Ankle_to_Knee < (90 - side_bias)) || (Ankle_to_Knee > (90 + side_bias))) && (Knee_to_Hip > (90 - side_bias) && (Knee_to_Hip < (90 + side_bias))))
        {
          // angular deformity: 휜다리
          result['angDef']= true;
        }  
        else
        {
          result['angDef']= false;
        }

        // 골반에서 어깨까지 각도 검사
        if (Hip_to_Shoulder < (90 - side_bias) || Hip_to_Shoulder > (90 + side_bias))
        {
          result['curBack']= true;
        }  
        else
        {
          result['curBack']= false;
        }


        // 어깨에서 귀까지 각도 검사
        if (Shoulder_to_Ear < (90 - side_bias-10) || Shoulder_to_Ear > (90 + side_bias+10))
        {
          result['turNeck']= true;
        } 
        else
        {
          result['turNeck']= false;
        }

        // console.log("발목에서 무릎각: " + Ankle_to_Knee.toPrecision(4));
        // console.log("무릎에서 골반각: " + Knee_to_Hip.toPrecision(4));
        // console.log("골반에서 어깨각: " + Hip_to_Shoulder.toPrecision(4));
        // console.log("어깨에서 귀까지 각: " + Shoulder_to_Ear.toPrecision(4));
        
      })
      .then(() => {
        this.result = result
        this.result_process_end = true
      })
    },

    reset: function() {
      var front_canvas = document.getElementById('front_canvas');
      var f_ctx = front_canvas.getContext('2d')
      f_ctx.clearRect(0, 0, front_canvas.width, front_canvas.height)
      f_ctx.beginPath();

      var side_canvas = document.getElementById('side_canvas');
      var s_ctx = side_canvas.getContext('2d')
      s_ctx.clearRect(0, 0, side_canvas.width, side_canvas.height)
      s_ctx.beginPath();

      this.front_imageData = '';
      this.side_imageData = '';
      this.result_process_end = null;
      
      front_canvas.height = 150;
      side_canvas.height = 150;
    },

    // *********************** 이어서 하기
    upload_img: function() {
      var f_canvas = document.getElementById('front_canvas');
      var s_canvas = document.getElementById('side_canvas');

      this.$http.post('/api/file/upload_img',{
        name: this.user.name,
        email: this.user.email,
        result: this.result,
        f_data: f_canvas.toDataURL("image/jpeg"),
        s_data: s_canvas.toDataURL("image/jpeg")
      })
      .then((result) => {
        alert('업로드 성공')
      })
      .catch((err)=> {
        alert(err)
      })
    },

    popup_loading: function() {
      document.body.appendChild('')
    }

    
    // ******************************
  }
}

</script>

<style scoped>
#body-cehck-page {
  align-items: center;
}


#front_canvas, #side_canvas {
  margin-top: 20px;
  background-color: pink;
  width:100%;
}

.b_orange_and_w_white {
  background-color:orange;
  color: white;
}

.check_body_button {
  width: 39%;
  margin: 0 5% 30px 5%;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 1px 1px 1px 1px gray
}

#fixed-loading {
  height: 100vh;
  width: 100vw;
  position: fixed;
  text-align: center;
  top:-1.5rem;
  left:0;
  font-size: 30px; 
  z-index: 5;
  text-align: center;
  padding-top: 40vh;
  background: rgba(80, 78, 81, 0.6);
}

</style>
