<template>
  <div id="Home">
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      background="#ababab"
      class="cccc"
      img-height="300"

      style="text-shadow: 1px 1px 2px #333;"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
        :img-src="require('../pic/main_1.jpg')"
      >
        <div>
          <h1 class="letter">어서오세요</h1>
          <p class="Nunum_Noto letter">이곳에서 체계적인 관리와 신체검사를 해보세요 <br/>
          체계적인 회원 관리와 높은 질의 서비스를 제공하세요</p>
          <b-button class="Nunum_Noto" >참여하기</b-button>
        </div>
      </b-carousel-slide>

      <b-carousel-slide 
        :img-src="require('../pic/main_2.jpg')">
        <div>
          <h1 class="letter">비대칭 체크</h1>
          <p class="Nunum_Noto letter">
            신체가 비대칭인 곳을 검사해드립니다. <br/>
            그에 알맞은 운동 방향을 맞춰가세요
          </p>
        </div>
      </b-carousel-slide>

      <b-carousel-slide 
        :img-src="require('../pic/main_3.jpg')">
        <h1 class="letter">회원 관리</h1>
          <p class="Nunum_Noto letter">
            회원 관리 기능, 히스토리 기능을 제공합니다.<br/>
            운동 정보도 있는 운동 사전도 이용해보세요.
          </p>
      </b-carousel-slide>

    </b-carousel>
    <div>
      <b-container class=" mt-3">
        <b-row>
          <b-col class="media_800_min_100 mt-3">
            <b-img fluid :src="require('../pic/weak_point.jpg')" />
          </b-col>
          <b-col class="media_800_min_100 mt-2">
            <h3 class="Nunum_Noto">운동은 어떻게 하나요?</h3>
            <p class="mt-3">
              움직임이나 혈액 순환에 방해되지 않는 옷, 운동의 종류에 맞는 편안한 신발 같은 의류부터 각자의 목표에 맞는 근육 트레이닝을 해주는 것이란 어려운 작업입니다. 또한, 당신이 회원들에게 모든 답변을 할 수 있더라도 그 회원은 어떠한 것부터 질문해야할지 모를 것입니다. 따라서, 회원들에게 자신의 몸에 관심을 가지게 하며 스스로 발전할 수 있는 주체적 운동을 하도록 하여야 할 것 입니다.
            </p>
          </b-col >
        </b-row>

        <b-row class="mt-4">
          <b-col class="media_800_min_100 min_w_360">
            <h3 class="Nunum_Noto">어떻게 조언을 줄까요?</h3>
            <p class="mt-3">
              운동 초보자들에게 어떠한 조언이 좋을까요? 그들이 단련 원하는 근육의 운동법을 먼저 가르쳐야 할까요? 이에 대한 답은 먼저 회원들이 운동하기 좋은 몸 상태로 만드는 것입니다. 비대칭 부터 뼈의 뒤틀림이 있는 사람에게 근육을 키우라는 것은 오히려 비대칭을 더욱 심화시킬 수 있는 독이 될 수 있습니다.
            </p>
          </b-col>
          <b-col class="media_800_min_100 min_w_360">
            <b-img fluid :src="require('../pic/how_teach.jpg')" />
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div class="parallax-wrapper">
      <!-- <b-img fluid :src="require('../pic/main_parallax.jpg')" /> -->
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      show: true,
      sliding: false,
      slide: 0,
    }
  },

  methods: {
     onSlideStart(slide) {
       this.sliding = true
     },
     onSlideEnd(slide) {
       this.sliding = false
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url('https://fonts.googleapis.com/css?family=Righteous');

#Home {
  /* margin-top: 60px; */
  align-items: center;
  width: 100%;
  /* background-color: #0c0524; */
  /* color: white; */
}

.carousel-caption {
  position: absolute;
  font-size: 1.5vw;
  text-align: left;
  top: 40%;
  bottom: 0;
}

.carousel-caption h1{
  font-size: 4vw;
}

#carousel-1 {
  max-height: 500px;
  overflow: hidden;
}

#carousel-1 img {
  background-size: contain;
}

#carousel-1 button {
  background-color: rgb(211, 137, 0);
  border: none;
  font-size: 1vw;
}

/* carousel footer 가리기 */
#carousel-1___BV_indicators_ {
  visibility: hidden;
}

/* ================== 애니메이션 ================== */
.letter {
  color: white;
  font-weight: bold;
  position: relative;
  /* text-shadow: 0 0 3px white; */
  animation: fadein 2s
}
  
@keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}


/* 메인 화면 carousel 의 글자 크기 제한 */
@media screen and (min-width: 1600px) {
  .carousel-caption {
     font-size: 25px;
  }

  .carousel-caption {
    top: 100px;
  }
  
}
@media screen and (max-width: 800px) {
  .media_800_min_100 {
    min-width:100%;
  }

  .carousel-caption h1{
    font-size: 6vw;
  }

  .carousel-caption {
    top: 15%;
  }

  #carousel-1 button {
    visibility: hidden;
  }

}

</style>
