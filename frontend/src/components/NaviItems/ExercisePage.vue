<template>
	<div id='ExerciseDict'>
		<div>
			<b-input-group class="mt-4 ml-2 mr-2" size="md">
				<b-input-group-prepend>
    			<b-button class="input-group-text" @click="lists">
						<font-awesome-icon icon="search"/>
					</b-button>
  			</b-input-group-prepend>
				<b-form-input
					v-model="filter_string"
					type="search"
					id="filterInput"
					placeholder="찾을 운동명"
				/>
			</b-input-group>
			
			<b-form-group label="근육:" class="mt-3 ml-2" >
				<b-form-checkbox-group
      	  id="checkbox-muscle"
      	  v-model="filter_muscle"
      	  :options="muscle_pool"
      	  name="muscle"
					@input="search_exercise"
      	></b-form-checkbox-group>
			</b-form-group>

			<b-form-group label="기구 & 방법:" class="mt-1 ml-2" >
      	<b-form-checkbox-group
      	  id="checkbox-equipment"
      	  v-model="filter_equipment"
      	  :options="equipment_pool"
      	  name="equipment"
      	></b-form-checkbox-group>
    	</b-form-group>

		</div>

		<div v-if="loading_exercise" class="align-content-center mt-4">
			<strong class="loading" >Loding</strong>
			<b-spinner class="loading" small type="grow"></b-spinner>
			<b-spinner class="loading" small type="grow"></b-spinner>
			<b-spinner class="loading" small type="grow"></b-spinner>
		</div>

		<span v-if="!loading_exercise">
			<!-- 이곳에 스타일 적용시켜야 한개의 아이템만 나올때도 적절한 크기로 3*3 유지 -->
			<b-container style="width: 90vw;">
				<b-row >
					<!-- 검색 결과 1개인 경우 b-container 가 작아지기 때문에 sm="조건" 삽입 -->
					<b-col class="mt-4" sm="4" v-for="(item, idx) in lists" :key="idx">
						<b-card
							:img-src="item.img"
							:title="item.name"
							class="item"
						>
							<b-card-text>
								<b>근육:</b> {{item.muscle}}<br/><b>사용기구:</b> {{item.equipment}}
							</b-card-text>

							<template v-slot:footer>
								<a :href="'https://www.bodybuilding.com'+item.link">자세한 운동법</a>
							</template>

						</b-card>
					</b-col>
					<div class="w-100"></div>
				</b-row>
			</b-container>

			<b-pagination
				align="center"
				:total-rows="totalRows"
				v-model="currentPage"
				:per-page="perPage"
				class="mt-4"
			/>

		</span>
	</div>
</template>

<script>

export default {
  data() {
		return {
			perPage: 9,
			currentPage: 1,
			filter_string: '',
			filter_muscle: [],
			filter_equipment: [],
			totalRows: 2,
			muscle_pool: [
				{ text: '가슴' , value: 'Chest'},
				{ text: '전완근', value: 'Forearms'},
				{ text: '광배근', value: 'Lats'},
				{ text: '미들백', value: 'Middle Back'},
				{ text: '허리', value: 'Lower Back'},
				{ text: '목', value: 'Neck'},
				{ text: '대퇴근', value: 'Quadriceps'},
				{ text: '햄스트링', value: 'Hamstrings'},
				{ text: '종아리', value: 'Calves'},
				{ text: '삼두근', value: 'Triceps'},
				{ text: '어깨', value: 'Shoulders'},
				{ text: '복근', value: 'Abdominals'},
				{ text: '중든군', value: 'Glutes'},
				{ text: '이두', value: 'Biceps'},
			],
			equipment_pool: [
				{ text: '밴드', value:'Bands' },
				{ text: '폼룰러', value:'Foam Roll'},
				{ text: '바벨', value: 'Barbell'},
				{ text: '케틀벨', value: 'Kettlebells'},
				{ text: '맨몸', value: 'Body Only'},
				{ text: '머신', value: 'Machine'},
				{ text: '케이블', value: 'Cable'},
				{ text: '피트니스 볼', value: 'Medicine Ball'},
				{ text: '덤벨', value: 'Dumbbell'},
				{ text: '홈트레이닝', value: 'None'},
				{ text: '이지바', value: 'E-Z Curl Bar'},
				{ text: '기타', value: 'Other'},
				{ text: '짐볼', value: 'Exercise Ball'},
			],
			items : [],
			loading_exercise: true,		// 운동 사전 로딩 플래그
		}
	},

	// 처음 체크 된 값 세팅
	mounted() {
		this.filter_muscle = ['Chest']
		this.search_exercise()
	},

	computed: {
		lists: function() {
			
			var temp = []

			// 객체 복사
			for(var i in this.items) {
				temp[i] = this.items[i];
			}


			// 이름 필터링
			if (this.filter_string != '') {
				for(var i=temp.length-1 ; i>=0 ;i--) {
					if((temp[i].name.toLowerCase()).includes(this.filter_string.toLowerCase()) == false) {
						temp.splice(i, 1);
					}
				}
			}

			// 기구 필터링
			if (this.filter_equipment.length != 0) {
				for(var i=temp.length-1 ; i>=0 ;i--) {
					if((this.filter_equipment.indexOf(temp[i].equipment)) == -1) {
						temp.splice(i, 1)
					}
				}
			}

			this.totalRows = Math.ceil(temp.length)
			return temp.slice((this.currentPage - 1) * this.perPage,
								this.currentPage * this.perPage )
		}

  },
	
  methods: {
		
		search_exercise: function (event) {

		this.loading_exercise = true;
    	this.$http.post('/api/exercise_search/search', { //axios 사용
				muscle : this.filter_muscle,
				equipment: this.filter_equipment
    	})
    	.then((response) => {
				this.items = response.data
				this.loading_exercise = false;
    	})
    	.catch(function (error) {
				alert(error) 
				this.loading_exercise = false;
			});

			
		}
	}
}

</script>

<style scoped>
	#ExerciseDict {
		align-items: center;
	  display: inline-flex;
		flex-direction: column;
		width: 100%;
	}

	.loading {
		font-weight: 10vw;
	}

</style>
