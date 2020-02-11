<template>
  <div id="add_person">

      <b-container id="add_form">
        <b-row>
          <b-col>
            <h2 class="mt-4">추가할 회원</h2>
            <b-form>
              <b-form-group
                label="이름"
                label-for="input_name"
              >
                <b-form-input
                  id="input_name"
                  v-model="pre_form.name"
                  placeholder="이름을 입력"
                >
                </b-form-input>
              </b-form-group>
              
              <b-form-group
                label="이메일"
                label-for="input_email"
              >
                <b-form-input
                  id="input_email"
                  v-model="pre_form.email"
                  placeholder="이메일@주소.com"
                >
                </b-form-input>
              </b-form-group>

              <b-form-group
                label="등급"
                label-for="input_level"
              >
                <b-form-select id="input_level" v-model="pre_form.level" :options="options" size="md"></b-form-select>
              </b-form-group>

              <b-form-group>
                <b-button block @click="save_pre_info"  class="mt-4" variant="primary">요청 및 요청 목록에 추가</b-button>
              </b-form-group>
            </b-form>
            
          </b-col>

          <b-col md="7">
            <h2 class="mt-4">요청한 목록</h2>
            <b-table
              sticky-header
              show-empty
              small
              :items="items"
              :fields="until_field"
              :busy="isBusy"
              stacked="sm"
            >
            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>

            <template v-slot:cell(create_date)="row">
              {{ SliceDate(row.item.create_date) }}
            </template>

            <template v-slot:cell(control)="row">
              <b-button @click="go_to_check(row.item.name, row.item.email)" size="sm" variant="warning">
                <font-awesome-icon icon="user-check"/>
              </b-button>
              <b-button @click="delete_element(row.item.email)" size="sm" variant="danger">
                <font-awesome-icon icon="times"/>
              </b-button>
            </template>
            </b-table>
          </b-col>
        </b-row>
      </b-container>

  </div>
</template>

<script>
export default {
  data() {
    return {
      until_field: [
        { key: 'create_date', label: '날짜'},
        { key: 'name', label: '이름'},
        { key: 'email', label: '이메일'},
        { key: 'control', label: '조작'}
      ],
      items: [],
      pre_form: {
        name: '',
        email: '',
        level: 3
      },
      isBusy: true,
      options: [
        { value: 3, text:'회원'},
        { value: 2, text:'트레이너'}
      ]
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
    this.refesh_pre_save_table()
  },

  computed: {
    SliceDate() {
      return (str) => {
        if(str == null)
          return ''
        return str.slice(0,10)
      }
    }
  },

  methods: {
    save_pre_info: function() { this.$http.post('/api/signUp/pre_save', {
        user: this.pre_form
      })
      .then((resopnse) => {
        console.log(resopnse)

        // 이메일 중복된 경우
        if(resopnse.data.result === "Overlapped") {
          return alert("해당 이메일은 이미 가입되어 있습니다.")
        }
        alert('새로운 요청 성공')
        this.refesh_pre_save_table()
      })
      .catch((err) => {
        alert(err);
      })
    },

    refesh_pre_save_table: function() { this.$http.get('/api/table_out/find_until_people', {
      id: null
      })
        .then((response) => {
          // 데이터 없는 경우
          if(response.data.result.length == 0)
            this.items = [{ name: '-', email: '-' }]
          else
            this.items = response.data.result;
          this.isBusy = false;
        })
        .catch(err => {
          alert(err)
          this.isBusy = false;
		    })
    },

    go_to_check(name, email) {
			this.$router.push({name: 'BodyCheckPage', params: { name: name, email: email }})
    },
    
    delete_element(email) {
      this.$http.delete('/api/signUp/delete_one_person/' + email)
      .then((result) => {
        alert('삭제 성공')
        this.refesh_pre_save_table()
      })
      .catch((err)=> {
        alert(err)
      })
    }
  }
}
</script>

<style scoped>
  #add_person {
    width: 100%;
		background:linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('../../pic/middle_1.jpg'), center, center, fixed;
		background-size:cover;

		background-repeat: no-repeat;
		overflow: hidden;
    min-height: calc(100vh - 50px);
  }

  #add_form {
    background-color:white;
    border-radius: 10px;
    margin-top: 10%;
  }


  
</style>