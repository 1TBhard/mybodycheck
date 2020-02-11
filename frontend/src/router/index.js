import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/Home'
import BodyCheckPage from '@/components/NaviItems/BodyCheckPage'
import LoginPage from '@/components/NaviItems/LoginPage'
import LogOutPage from '@/components/NaviItems/LogOutPage'
import ExercisePage from '@/components/NaviItems/ExercisePage'
import ManagePage from '@/components/NaviItems/ManagePage'
import SignUpPage from '@/components/NaviItems/SignUpPage'
import SchedulePage from '@/components/NaviItems/SchedulePage'
import AddPersonPage from '@/components/NaviItems/AddPersonPage'
import HistoryPage from '@/components/NaviItems/HistoryPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home', 
      component: HomePage
    },
    {
      path: '/body-check', // id는 파라메터로 받아올 key가 된다.
      // '?'을 추가함으로써 파라미터 유무에 상관 없이 접속 가능
      name: 'BodyCheckPage',
      props: true,
      component: BodyCheckPage
    },
    
    {
      path: '/login-page',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/logout',
      name: 'LogOutPage',
      component: LogOutPage
    },
    {
      path: '/exercise-page',
      name: 'ExercisePage', 
      component: ExercisePage
    },
    {
      path: '/manage-page',
      name: 'ManagePage', 
      component: ManagePage
    },
    {
      path: '/signup-page/:search_email',
      name: 'SignUpPage',
      component: SignUpPage
    },
    {
      path: '/schedule-page',
      name: 'SchedulePage',
      component: SchedulePage
    },
    {
      path: '/add-person-page',
      name: 'AddPersonPage',
      component: AddPersonPage
    },
    {
      path: '/history-page',
      name: 'HistoryPage',
      component: HistoryPage
    }
  ]
})
