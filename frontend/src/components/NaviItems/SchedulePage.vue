<template>
<!-- 
	일단 스케줄 기능은 추가 기능으로 시간이 충분할 시에 구현하자!!!

-->
	<div id="Schedule">
		<h1 class="Do_Hyeon">스케줄</h1>
		<vue-cal 
			style="height : 80vh;"
			class="vuecal--green-theme" 
			:time-from="6 * 60"
			:time-step="30"
			today-button
			:selected-date="selectedDate"
			:events="events"

			locale="ko">
			</vue-cal>

			<b-modal id="model-1" title="ggg">
				<p>{{selectedEvnet.contentFull}}</p>
			</b-modal>

			<button @click="selectedDate = new Date()">오늘 날짜로 돌아오기</button>

	</div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/ko.js'
import 'vue-cal/dist/vuecal.css'


export default {
  components: { VueCal },

	
  data() {
		return {
			// 현재 날짜
			selectedDate: new Date(),
			selectedEvnet: {},
			events: [
  		  {
  		    start: '2019-09-21 10:30',
  		    end: '2019-09-21 12:00',
					title: 'Need to go shopping',
					content: '<button v-b-modal.modal-1>클릭시 모달</button>',
					contentFull: '이게정말 되누??',
  		    class: 'leisure'
  		  },
  		]
		}
	}
}
</script>

<style scoped>
	#Schedule {
		width: 1200px;
	}


	#Schedule > h1 {
		text-align: center;
	}

	.vuecal__event.leisure {
		background-color: rgba(253, 156, 66, 0.9);
		border: 1px solid rgb(233, 136, 46);
		color: #fff;
	}

	.vuecal__event.sport {
		background-color: rgba(255, 102, 102, 0.9);
		border: 1px solid rgb(235, 82, 82);
		color: #fff;
	}

	.vuecal__now-line {color: #06c;}

</style>