<template>
  <div class="loginform">
      <input type="text" class="userName" id="userName" v-model="loginForm.username" placeholder="请输入账户" />
      <input type="password" class="password" id="password" v-model="loginForm.password" placeholder="请输入密码" />
      <input type="button" class="loginButton" id="loginButton" @click="login" value="登录" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.loginpost()
    },
    loginpost () {
      this.$http.post('/user/login?_format=json', {
        name: this.loginForm.username,
        pass: this.loginForm.password
      })
        .then(function (response) {
          console.log(response.status)
          if (response.status === 200) {
            wx.showToast({
              title: '登录成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
            wx.navigateTo({
              url: '/pages/index/main'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  onLaunch: function () {
    let user = wx.getStorageSync('user') || {}
    console.log('user')
    // let that = this
    if (!user.openid) {
      console.log('no')
      wx.login({
        ssuccess: function (res) {
          console.log(res)
        }
      })
    } else {
      console.log(user)
    }
  }
}
</script>

<style>
.loginform {
  width: 300px;
  height: 150px;
  background-color: aqua;
  margin: 0 auto;
}

.userName {
  width: 150px;
  border: solid 1px  black;
  margin: 0 auto;
  margin-top: 10px;
}

.password {
  width: 150px;
  border: solid 1px  black;
  margin: 0 auto;
  margin-top: 10px;
}

.loginButton {
  padding: 0;
  border: 1px solid;
  width: 80px;
  height: 40px;
  margin-top: 10px;
}
</style>