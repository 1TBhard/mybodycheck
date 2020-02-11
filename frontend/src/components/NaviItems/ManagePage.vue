<template>
	<div id="manage">
		<!-- <span>
    		<SubBar />
		</span> -->
		<span id="db_view">
			<!-- 토글 버튼 -->
			<!-- <div>
				<b-button @click="toggleBusy">Toggle Busy State</b-button>
			</div>
			 -->
			<b-container fluid class="mt-5">
				<b-row align-h="between">

					<b-col sm="4">
						<b-form-group
							label-cols-sm="0"
							label-align-sm="left"
							label-for="filterInput"
							>
								<b-input-group size="md">
									<b-input-group-prepend>
    								<span class="input-group-text"><font-awesome-icon icon="search"/></span>
  								</b-input-group-prepend>
									<b-form-input
										v-model="filter"
										type="search"
										id="filterInput"
										placeholder="찾을 이름 or ID"
									/>

									<b-input-group-append>
										<span class="white_space"/>
										<b-button size="md" @click="delete_item" variant="danger" :disabled="row_selected.length == 0">삭제</b-button>		
									</b-input-group-append>
								</b-input-group>
							
						</b-form-group>
					</b-col>

					<b-col sm="6" md="5">
      			<b-form-group
							id="filter_label"
      		    label="필터"
							label-cols-md="4"
      		    label-cols-sm="2"
      		    label-align-sm="right"
      		  >
      		    <b-form-checkbox-group v-model="filterOn">
      		      <b-form-checkbox v-for="(jtem, idx) in infoModal_right_fields" :key="idx" :value="jtem.key" v-model="filterOn">
										{{ jtem.label }}
								</b-form-checkbox>
      		    </b-form-checkbox-group>
      		  </b-form-group>
      		</b-col>

					<b-col sm="2" md="3">
						<b-form-group
							label="표시 수"
							label-cols-sm="4"
							label-cols-md="6"
							label-align-sm="right"
							label-size="sm"
							label-for="perPageSelect"
						>
							<b-form-select
								v-model="perPage"
								id="perPageSelect"
								size="sm"
								:options="pageOptions"
							/>
						</b-form-group>
					</b-col>
				</b-row>
			 
				<b-table 
					bordered hover small head-variant="dark"
					stacked="sm"
					
					ref="selectableTable"
					selected-variant="primary"

					responsive="sm"
					:tbody-tr-class="rowClass"

					:items="filtered_list"
					:fields="fields"
					:busy="isBusy" 
					class="mt-3" outlined

					:current-page="currentPage"
    	  	:per-page="perPage"
					:filter="filter"
					:filterIncludedFields='["name", "id"]'
					filter-debounce="200"
					@filtered="onFiltered"
					>
						<!-- 로딩 스피너 -->
						<div slot="table-busy" class="text-center text-danger my-2">
							<b-spinner class="align-middle"></b-spinner>
							<strong>Loding...</strong>
						</div>
						
						<!-- <template slot="[selected]" slot-scope="{ rowSelected }">
      			  <template v-if="rowSelected">
      			    <span aria-hidden="true">&check;</span>
      			    <span class="sr-only">Selected</span>
      			  </template>
      			  <template v-else>
      			    <span aria-hidden="true">&nbsp;</span>
      			    <span class="sr-only">Not selected</span>
      			  </template>
      			</template> -->

						<template v-slot:head(selected) >
							<b-checkbox v-model="selectAll" name="checked" @change="selectAllRows()"  />
						</template>

						<!-- 체크 박스 -->
						<template v-slot:cell(selected)="row">
							<b-checkbox name="checked" :key="row.index" :value="row.item.email" v-model="row_selected" />
						</template>

						<!-- 권한 정보를 1: 관장, 2:트레이너, 3: 회원 -->
						<template v-slot:cell(level)="row">
							{{ getLevel(row.item.level) }}
						</template>

						<!-- DB 안의 성별 M, w을 남여 로 출력-->
						<template v-slot:cell(sex)="row">
							{{ row.item.sex == "M" ? "남" : "여" }}
						</template>

						<!-- DB 안의 생일년도와 현재 년도 차를 계산해 나이 계산 -->
						<template v-slot:cell(birthday)="row">
							{{ getAge(row.item.birthday) }}
						</template>

						<!-- 만료일 -->
						<template v-slot:cell(expire_date)="row">
							{{ getYYYYMMDD(row.item.expire_date) }}
						</template>

						<!-- 디테일 표시(모달) -->
						<template v-slot:cell(showDetails)="row">
      			  <b-button pill  variant="info" size="sm" v-b-modal.data_main @click="info(row.item, row.index, $event.target)" >
      			    <font-awesome-icon class="btn-circle"  icon="info"/>
      			  </b-button>

							<b-button pill  variant="warning" size="sm" @click="go_to_check(row.item.name, row.item.email)" >
								<font-awesome-icon icon="user-check"/>
							</b-button>

							<b-button pill variant="primary" size="sm" @click="go_to_history(row.item.name, row.item.email)" >
								<font-awesome-icon icon="history"/>
							</b-button>
      			</template>
				</b-table>
				

				<!-- =================== 상세정보 모달 =================== -->
				<b-modal
					id="data_main"
					title="상세정보"
					@ok="resetInfoModal"
				>
					<b-container>
						<b-row>
							<b-col>
								<b-table-simple borderless small class="th_min_7 td_min_12">
									<b-tr>
										<b-th>이름</b-th>
										<b-td>{{infoModal.content['name']}}</b-td>
									</b-tr>

									<b-tr>
										<b-th>유형</b-th>
										<b-td>{{getLevel(infoModal.content['level']) }}</b-td>
									</b-tr>

									<b-tr>
										<b-th>성별</b-th>
										<b-td>{{infoModal.content['sex'] == 'M' ? '남' : '여' }}</b-td>
									</b-tr>

									<b-tr>
										<b-th>출생일</b-th>
										<b-td>{{infoModal.content['birthday'] }}</b-td>
									</b-tr>

									<b-tr>
										<b-th>ID</b-th>
										<b-td>{{infoModal.content['id'] }}</b-td>
									</b-tr>

									<b-tr>
										<b-th>가입일</b-th>
										<b-td>{{ infoModal.content['create_date'] }}</b-td>
									</b-tr>

									<b-tr>
										<b-th>만료일</b-th>
										<b-td>{{ infoModal.content['expire_date'] }}</b-td>
									</b-tr>		

									<b-tr>
										<b-th>이메일</b-th>
										<b-td>{{infoModal.content['email']}}</b-td>
									</b-tr>	

								</b-table-simple>
							</b-col>

							<b-col>
								<b-table-simple borderless small class="th_min_12" >
									<b-thead/>
										<b-tr v-for="(item, idx) in infoModal_right_fields" :key="idx">
											<b-th >{{item.label}}</b-th>
											<b-td>{{infoModal.content[item.key] == true ? 'O' : 'X'  }}</b-td>
										</b-tr>
								</b-table-simple>
							</b-col>

						</b-row>
					</b-container>

					<template v-slot:modal-footer="{ ok, hide}">
    			  <!-- Emulate built in modal footer ok and cancel button actions -->
    			  <b-button size="sm" v-b-modal.data-edit variant="warning" @click="hide()">수정</b-button>

    			  <!-- Button with custom close trigger value -->
    			  <b-button size="sm" variant="secondary" @click="ok()">닫기</b-button>
    			</template>
    		</b-modal>


				<!-- =================== 편집 모달 =================== -->
				<b-modal id="data-edit" title="데이터 편집" @ok="resetInfoModal">
					<b-container>
						<b-row>
							<!-- 상세정보 페이지의 사용자 정보(신체정보 제외) -->
							<b-col>
								<b-table-simple borderless small class="th_min_7 td_min_12">
									<b-thead/>
										<b-tr>
											<b-th>이름</b-th>
											<b-td>
												<b-input size="sm" v-model="infoModal.content['name']" />
											</b-td>
										</b-tr>

										<b-tr>
											<b-th>유형</b-th>
												<b-td>
													<b-form-select size="sm" v-model="infoModal.content['level']" 
														:options="level_pool">
													</b-form-select>
												</b-td>
										</b-tr>
										
										<b-tr>
											<b-th>성별</b-th>
											<b-td>
												<b-radio-group :checked="infoModal.content['sex']">
													<b-form-radio v-model="infoModal.content['sex']" value="M">남</b-form-radio>
													<b-form-radio v-model="infoModal.content['sex']" value="w">여</b-form-radio>
												</b-radio-group>
											</b-td>
										</b-tr>

										<b-tr>
											<b-th>출생일</b-th>
											<b-td>
												<b-form-input size="sm" v-model="infoModal.content['birthday']" type="date" />
											</b-td>
										</b-tr>

										<b-tr>											
											<b-th>ID</b-th>
											<b-td>
												{{ infoModal.content['id'] }}
											</b-td>
										</b-tr>

										<b-tr>
											<b-th>가입일</b-th>
											<b-td>
												<b-form-input size="sm" v-model="infoModal.content['create_date']" type="date" />
											</b-td>
										</b-tr>

										<b-tr>
											<b-th>만료일</b-th>
											<b-td>
												<b-form-input size="sm" v-model="infoModal.content['expire_date']" type="date" />
											</b-td>
										</b-tr>

										<b-tr>
											<b-th>이메일</b-th>
											<b-td>
												<b-input size="sm" v-model="infoModal.content['email']" />
											</b-td>
										</b-tr>

										
								</b-table-simple>
							</b-col>

							<b-col>
								<b-table-simple borderless small class="th_min_12" >
									<b-thead/>
										<b-tr v-for="(item, idx) in infoModal_right_fields" :key="idx">
											<b-th >{{item.label}}</b-th>

											<b-td>
												<b-radio-group :checked="infoModal.content[item.key]">
													<b-form-radio v-model="infoModal.content[item.key]" name="sex-radios" :value="true">O</b-form-radio>
													<b-form-radio v-model="infoModal.content[item.key]" name="sex-radios" :value="false">X</b-form-radio>
												</b-radio-group>
											</b-td>
										</b-tr>
								</b-table-simple>
							</b-col>
						</b-row>
					</b-container>

					<template v-slot:modal-footer="{ ff, hide, ok }">
    			  <!-- Emulate built in modal footer ok and cancel button actions -->
    			  <b-button size="sm" variant="primary" @click="edit()">수정완료</b-button>
						<b-button size="sm" v-b-modal.data_main variant="secondary" @click="hide()" >뒤로</b-button>
    			  <!-- Button with custom close trigger value -->
    			  <b-button size="sm" variant="danger" @click="ok()">닫기</b-button>
    			</template>
  			</b-modal>

				<b-modal 
					id="data-add"
					title="데이터 추가"
				>
					<div>
					</div>

					<div>
						<b-simple-table>
							
						</b-simple-table>
					</div>
    			
  			</b-modal>
			</b-container>

			<b-pagination
				v-model="currentPage"
				:total-rows="totalRows"
				:per-page="perPage"
				align="center"
			/>

		</span>
	</div>
	
</template>

<script>
import EventBus from "../../EventBus"

export default {
	data() {
		return {
			isBusy: false,
			row_selected: [],
			all_level: ["관장", "트레이너", "회원"],
			fields: [
				{ key: "selected", label: "선택", class: "small_col" },
				{ key: 'name', label: '이름', sortable: true, },
				{ key: 'level', label: '유형', sortable: true},
				{ key: 'sex', label: '성별',sortable: false, class: "small_col" },
				{ key: 'id', label: 'ID', sortable: true, },
				{ key: 'birthday', label: '나이', sortable: false },
				{ key: 'expire_date', label: '만료일', sortable: true },
				{	key: 'showDetails', label: '액션' },
			],
			
			items:[],
	
			infoModal_left_fields: [
				{ key: 'name', label: '이름' },
				{ key: 'sex', label: '성별' },
				{ key: 'id', label: 'ID' },
				{	key: 'birthday', label: '나이' },
				{ key: 'create_date', label: '가입일' },
				{	key: 'expire_date',	label: '만료일' },
				{ key: 'email', label: '이메일' }
			],

			infoModal_right_fields: [
				{ key: 'kneAsy', label: '무릎 비대칭' },
				{ key: 'pelAsy', label: '골반 비대칭' },
				{ key: 'shoAsy', label: '어깨 비대칭' },
				{ key: 'angDef', label: '휜다리' },
				{ key: 'curBack', label: '굽은 등' },
				{ key: 'turNeck', label: '거북목' },
			],

			infoModal: {
  		  id: 'info-modal',
				title: '상세정보',
  		  content: {
					create_date: '',
					expire_date: ''
				}
			},

			totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
			selectAll: false,
			filter: null,
			filterOn: [],

			level_pool: [
				{ value: 1, text: '관장', disabled: true },
				{ value: 2, text: '트레이너' },
				{ value: 3, text: '회원' },
			],
			
			today_year: 0,		// 오늘 날짜로 몇년, 나이 구할때 사용

			// ============= 추가 모달에서 사용할 변수들 =============
			add_table_field: [
				{ key: 'CPnum', label: '전화번호'},
				{ key: 'name', label: '이름' },
				{ key: 'created_date', label: '가입일'},
				{ key: 'expire_date', albel: '만료일' }
			],

			yet_signUp: [],
			y_CPnum: '',
			y_name: ''
		}
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
		this.today_year = new Date().getFullYear()
		this.isBusy = true												// 스핀 활성화(테이블 리프레쉬 대기)
		

		// 초기 테이블 정보 부르기
		this.$http.post('/api/table_out/member_table', {
    })
    .then(
			(response) => {
				this.items = response.data.result
				// console.log(this.items)
				this.totalRows = this.items.length		// 총 아이템의 길이
				this.isBusy = false										// 스핀 비활성화
			}
    )
    .catch(error => {
			alert('db 호출 실패\n' + error)
			this.isBusy = false
		})
	},

	computed: {
		filtered_list() {
			var temp = []

			// 객체 복사
			for(var i in this.items) {
				temp[i] = this.items[i];
			}

			if(this.filterOn.length != 0) {
				for(var i=temp.length-1 ; i>-1 ; i--) {
					for(var j=0; j<this.filterOn.length ; j++ ) {
						// console.log()
						if(temp[i][this.filterOn[j]] === false) {
							temp.splice(i, 1)
							break
						}
					}
				}
			}

			this.totalRows = Math.ceil(temp.length)
			return temp
		},

		// 나이 계산
		getAge()  {
			return (bir) => {
				if(bir == null)
					return ''
				return (this.today_year - parseInt(bir.slice(0,5))) + 1
			}
		},

		getYYYYMMDD() {
			return(d) => {
				if(d == null)
					return ''
				return d.slice(0,10)
			}
		},

		getLevel() {
			return (num) => {
				if(num == '' || num==null)
				 	return ''
				return this.level_pool[num-1].text
			}
		}
	},

	methods: {
		toggleBusy() {
			this.isBusy = !this.isBusy
		},

		rowClass(item, type) {
			if (!item) return
			if (item.status === 'awesome') return 'table-success'
		},
		

		info(item, index, button) {
				// 얇은 복사
				for(var category in item)
					this.infoModal.content[category] = item[category]
				
				// 생성일, 만료일 2019-04-02 형태로 나오게 함
				this.infoModal.content.create_date = item.create_date.slice(0,10)
				this.infoModal.content.expire_date = item.expire_date.slice(0,10)

        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
		},
		
		// 모달 종료시 infoModal 초기화
    resetInfoModal() {
      this.infoModal.content = {
				create_date: '',
				expire_date: '',
			}
		},
		
		selectAllRows() {
			this.row_selected = [];
			if (!this.selectAll)
				for (let i in this.items)
					this.row_selected.push(this.items[i].email);
		},

		onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
		

		// 요를 사용하려면 b-table 에 
		// :busy.sync="isBusy"
		// :items="myProvider"
		// 를 추가

		table_refresh () {
			this.isBusy = true												// 스핀 활성화(테이블 리프레쉬 대기)
    	this.$http.post('/api/table_out/member_table', {
    	})
    	.then(
				(response) => {
					this.items = response.data.result
					// console.log(this.items)
					this.totalRows = this.items.length		// 총 아이템의 길이
					this.isBusy = false										// 스핀 비활성화
				}
    	)
    	.catch(error => {
				alert('db 호출 실패\n' + error)
				this.isBusy = false
			})
		},

		edit() {
			this.$bvModal.hide('data-edit')
			this.$http.put('/api/table_out/edit', { editData: this.infoModal.content })
			.then(
				(response) => {
					console.log('데이터 수정 완료')
					this.table_refresh()
				}
			)
			.catch(error => {
				alert(error)
			})
		},

		delete_item() {
			// array로 보내기 때문에 post로 요청
			this.$http.post('/api/table_out/delete_item', { email_arr: this.row_selected})
			.then(
				(response) => {
					alert('삭제완료!')
					this.table_refresh()
				}
			)
			.catch(error => {
				alert(error)
			})
		},

		go_to_check(name, email) {
			// params로 변수 전달하려면 path가 아닌 name으로 페이지 이동해야함
			this.$router.push({name:'BodyCheckPage', params: { name: name, email: email }})
		},

		go_to_history(name, email) {
			this.$router.push({name:'HistoryPage', params: { name: name, email: email }})
		}
	}
}
</script>

<style scoped>
	/* 모바일 시 고려한 css
	@media screen and (max-width : 920px) {
		#manage {
			max-width: 100vw;
		}

	} */

	/* SubBar {
		position: fixed;
		margin-left: 0;
		background-color: brown;
		width: 300px;
		height: 800px;
	} */

	#manage {
		width: 100%;
	}

	#db_view {
		
		text-align: center;
		background-color: None;

		/* overflow: scroll; */
	}

	.small_col { max-width: 3px;}

	#filterInput {
		
	  border-left: none;
	}

	.input-group-text {
		width: 40px;
		border-right: none;
	}

	.th_min_12 th {
		min-width: 100px;
	}

	.td_min_12 td {
		min-width: 120px;
	}

	.th_min_7 th {
		min-width: 70px;
	}

	.btn-circle {
    width: 12px;
    height: 15px;
	}

	.white_space {
		width: 30px;
	}

	#filter_label  {
		font-size: 20px;
		font-weight: bold;
	}

	#filter_label div {
		font-size: 13px;
		font-weight: 500;
		min-width:100px;
		margin:0;
	}

</style>
