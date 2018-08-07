<template>
  <div>
    <div class="userMessage">
      <img :src="userPic" class="userImg"></img>
      <p>{{userName}}</p>
      <button open-type="getUserInfo">授权登录</button>
    </div>
    <div class="title">
      <top-bar :topBar="topBar" v-on:chanegTopBar="chanegTopBar"></top-bar>      
    </div>
    <div>
      <ul v-for="(article, index) in articles" :key="index" class="content-item" :class="{'content-item-0' :index == 0}">
        <li class="article-title" @click="detail(article.nid)" :class="{'article-title2':index%2 != 1}">
          {{article.title}}
        </li>
        <!-- <li>{{article.author_name}}</li> -->
        <li class="" v-if="article.image" :class="[{'article-img2':index%2 != 1}, 'article-img']">
          <img :src="'http://localhost:81'+article.image" :class="[{'a-picture2':index%2 != 1}, 'a-picture']" class=""/>
        </li>
        <li class="" v-if="article.video" :class="[{'article-img2':index%2 != 1}, 'article-img']">
          <video :src="'http://localhost:81'+article.video" :class="[{'a-picture2':index%2 != 1}, 'a-picture']" />
        </li>
        <li class="articleBoomAll">
          <span class="articleBoomTop" v-if="article.promote === 'true'">置顶</span>
          <span class="articleBoomHot"  v-if="article.comment_count >= 1">热</span>
          <span class="articleBoomFlag">{{article.uid_1}} {{article.comment_count}}评论 {{article.like_count}}赞 {{article.created}}</span>
          <span class="articleUpdate" v-if="Isedit">
            <img src="/static/img/edit.png" class="img-edit" @click="editArticle(article.nid)" />
            <img src="/static/img/delete.png" class="img-delete" @click="deleteArticle(article.nid)" />
          </span>
        </li>
        <!-- <rich-text :nodes="article.attch_file" class="attch_file"></rich-text>       -->
      </ul>
    </div>
  </div>
</template>

<script>
import topBar from '@/components/myTopBar.vue'
import {getList} from '@/utils/index.js'
export default {
  data () {
    return {
      articles: '',
      weChatName: '',
      weChatPic: '',
      userName: '',
      userPic: '',
      Isedit: false,
      topBar: [
        {
          name: '收藏',
          url: '/rest/mine/collect'
        },
        {
          name: '评论',
          url: '/rest/mine/comment'
        },
        {
          name: '赞',
          url: '/rest/mine/likeList'
        },
        {
          name: '历史',
          url: '/rest/mine/historyList'
        },
        {
          name: '发布',
          url: '/rest/mine/mypublish'
        }
      ],
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
  },
  components: {
    topBar
  },
  methods: {
    detail (id) {
      wx.setStorageSync('article_id', id)
      let url = '/pages/detail/main'
      wx.navigateTo({url})
    },
    chanegTopBar (url) {
      if (url === '/rest/mine/mypublish') {
        this.Isedit = true
      } else {
        this.Isedit = false
      }
      console.log(url)
      let data = getList(url, 'GET', this)
      this.articles = ''
      this.articles = data
    },
    getUserInfo: function () {
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
            }
          })
        }
      })
    },
    loginpost (username, password) {
      let mv = this
      this.$http.post('/user/login?_format=json', {
        name: username,
        pass: password
      })
        .then(function (response) {
          if (response.status === 200) {
            wx.getUserInfo({
              success: function (res) {
                mv.userName = res.userInfo.nickName
                mv.userPic = res.userInfo.avatarUrl
              }
            })
            wx.request({
              url: 'http://localhost:81/rest/session/token',
              method: 'GET',
              success: function (res) {
                console.info(res.data)
                wx.setStorageSync('token', res.data)
              }
            })
            mv.firstload()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    firstload () {
      let mv = this
      let header = {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')// 读取cookie
      }
      this.$http.request('/rest/mine/mypublish', {hh: 5}, {
        method: 'GET',
        headers: header,
        timeout: 5000
      }).then(function (data) {
        // mv.articles = data.data
        let dataMessage = data.data
        for (let i = 0; i < dataMessage.length; i++) {
          if (dataMessage[i].field_video !== '') {
            let text = dataMessage[i].field_video.split(',')[0]
            let videolength = text.split('.').length
            if (text.split('.')[videolength - 1] === 'mp4') {
              dataMessage[i].video = text
            } else {
              dataMessage[i].image = text
            }
          }
        }
        mv.articles = dataMessage
      }).catch(function (err) {
        console.log(err.status, err.message)
      })
    },
    deleteArticle (nid) {
      // let mv = this
      let mv = this
      let url = 'session/token'
      let header = {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')// 读取cookie
      }
      console.log(nid)
      this.$http.request(url, {}, {
        method: 'GET',
        headers: header
      }).then(function (data) {
        let csfrToken = data.data
        console.log(wx.getStorageSync('sessionid'))
        console.log(csfrToken)
        // let deleteUrl = 'node/' + nid
        wx.request({
          url: 'http://localhost:81/node/' + nid,
          method: 'DELETE',
          header: {
            'content-type': 'application/json',
            'cookie': wx.getStorageSync('sessionid'),
            'X-CSRF-Token': csfrToken
          },
          success: function (res) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success () {
                mv.firstload()
              }
            })
          }
        })
      }).catch(function (err) {
        console.log(err.status, err.message)
      })
    },
    editArticle (nid) {
      wx.setStorageSync('editnId', nid)
      let url = '/pages/edit/main'
      wx.navigateTo({url})
    }
  },
  onLoad () {
    let mv = this
    let header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync('sessionid')// 读取cookie
    }
    wx.getUserInfo({
      success: function (res) {
        mv.weChatName = res.userInfo.nickName
        mv.weChatPic = res.userInfo.avatarUrl
        console.log(mv.weChatPic)
      }
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: function (res) {
              console.log(res)
              let code = res.code
              let appId = 'wx8c346df38898711a'
              let secret = '18df9cfc290562ac892a89eac1295e84'
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
                data: {},
                headers: header,
                success: function (res) {
                  let openid = res.data.openid // 返回openid
                  console.log('openid为' + openid)
                  mv.$http.post('/user/login?_format=json', {
                    name: openid,
                    pass: '000000'
                  })
                    .then(function (response) {
                      wx.setStorageSync('sessionid', response.headers['set-cookie'])
                      if (response.status === 200) {
                        wx.getUserInfo({
                          success: function (res) {
                            mv.userName = res.userInfo.nickName
                            mv.userPic = res.userInfo.avatarUrl
                          }
                        })
                        wx.request({
                          url: 'http://localhost:81/rest/session/token',
                          method: 'GET',
                          success: function (res) {
                            console.info(res.data)
                            wx.setStorageSync('token', res.data)
                          }
                        })
                      }
                      mv.firstload()
                    })
                    .catch(function (error) {
                      console.log(error)
                      mv.$http.post('/rest/register?_format=json', {
                        'mail': '1010647413@qq.com',
                        'name': openid,
                        'pass': '000000',
                        'timezone': 'UTC',
                        'field_nickname': mv.weChatName,
                        'chatpicture': mv.weChatPic,
                        'user_picture': mv.weChatPic
                      })
                        .then(function (response) {
                          if (response.status === 200) {
                            wx.showToast({
                              title: '注册成功',
                              icon: 'succes',
                              duration: 1000,
                              mask: true
                            })
                            mv.loginpost(openid, '000000')
                          }
                        })
                        .catch(function (error) {
                          console.log(error)
                        })
                    })
                }
              })
            }
          })
        }
      }
    })
  }
}
</script>
<style>
  img {
    width: 100%;
  }

  .title {
    position: fixed;
    top: 200px;
    width: 100%;
    height: 40px;
    background: white;
    text-align: center;
    z-index: 50;
  }

  .userMessage {
    position: fixed !important; 
    top: 0px;
    width : 100%;
    height: 200px;
    background-color: #E7E7E7;
    z-index: 50;
    text-align:center;
    margin: 0 auto;
    /* display: flex; */
  }

  .content-item {
    background-color: white;
    margin-top: 80px;
    margin-left: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .article-title {
    font-size: 20px;
    width: 60% !important;
    float: left;
    margin-right: 10px !important;
    text-align: left;
  }

  .content-item-0 {
    margin-top: 250px !important;
  }

  .article-img {
    width: 30% !important;
    height: 80px;
    margin-right: 10px;
  }

  .a-picture {
    height: 80px;
    width: 100%;
  }

  .articleBoomAll {
    width: 100% !important;
    text-align: left;
  }

  .articleBoomFlag {
    margin-top: 10px;
    font-size: 10px;
    color: #AEAEAE;
    margin-bottom: 10px;
  }

  .article-title2 {
    width:100% !important;
  }

  .article-img2 {
    width: 60% !important;
    height: 120px !important;
    margin-left: 40%;
    margin-top: 10px;
  }

  .a-picture2 {
    height: 120px !important;
    float: right;
    margin-right: 90px !important;
  }

  .articleBoomTop {
    border: solid 1px red;
    font-size: 10px;
    color: red;
    margin-right: 10px;
  }

  .articleBoomHot {
    border: solid 1px red;
    font-size: 10px;
    color: red;
    margin-right: 10px;
  }

  .userImg {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    margin-top: 30px;
  }

  .articleUpdate {
    float: right;
  }
  .img-edit {
    width: 16px;
    height: 16px;
    margin-right: 20px;
  }

  .img-delete {
    width: 16px;
    height: 16px;
    margin-right: 30px;
  }
</style>
