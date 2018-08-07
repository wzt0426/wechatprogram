import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()
fly.config.baseURL = 'http://localhost:81/'
Vue.prototype.$http = fly

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['pages/logs/main', 'pages/index/main', 'pages/login/main', 'pages/updatetest/main', '^pages/home/main', 'pages/mine/main', 'pages/detail/main', 'pages/comment/main', 'pages/edit/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#D33E42',
      navigationBarTitleText: 'BBS',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#a9b7b7',
      selectedColor: '#D33E42',
      borderStyle: 'white',
      position: 'bottom',
      list: [{
        selectedIconPath: './static/img/home_on.png',
        iconPath: './static/img/home_off.png',
        pagePath: 'pages/home/main',
        text: '首页'
      }, {
        selectedIconPath: './static/img/add_on.png',
        iconPath: './static/img/add_off.png',
        pagePath: 'pages/updatetest/main',
        text: '创建'
      }, {
        selectedIconPath: './static/img/my_on.png',
        iconPath: './static/img/my_off.png',
        pagePath: 'pages/mine/main',
        text: '我的'
      }]
    }
  }
}
