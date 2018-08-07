<template>
  <div>
    <div class="title">
      <div class="search">
        <div class="search-icon" v-on:click="search"></div>
        <input type="text" name="search" v-model="searchId" class="search-box" placeholder="搜索内容或标题">
      </div> 
      <top-bar :topBar="topBar" v-on:chanegTopBar="chanegTopBar"></top-bar>      
    </div>
    <div>
      <ul v-for="(article, index) in articles " :key="index" class="content-item">
        <li class="article-title" @click="detail(article.nid)" :class="{'article-title2':index%2 != 1}">{{article.title}}</li>
        <!-- <li>{{article.author_name}}</li> -->
        <li class="" v-if="article.image" :class="[{'article-img2':index%2 != 1}, 'article-img']">
          <img :src="'http://localhost:81'+article.image" :class="[{'a-picture2':index%2 != 1}, 'a-picture']" class=""/>
        </li>
        <li class="" v-if="article.video" :class="[{'article-img2':index%2 != 1}, 'article-img']">
          <video :src="'http://localhost:81'+article.video" :class="[{'a-picture2':index%2 != 1}, 'a-picture']" />
        </li>
        <li class="articleBoomAll"><span class="articleBoomTop" v-if="article.promote === 'true'">置顶</span><span class="articleBoomHot"  v-if="article.comment_count >= 1">热</span><span class="articleBoomFlag">{{article.uid_1}} {{article.comment_count}}评论 {{article.like_count}}赞 {{article.created}}</span></li>
        <!-- <rich-text :nodes="article.attch_file" class="attch_file"></rich-text>       -->
      </ul>
    </div>
  </div>
</template>

<script>
import topBar from '@/components/topBar.vue'
import {getList} from '@/utils/index.js'
export default {
  data () {
    return {
      articles: '',
      searchId: '',
      topBar: [
        {
          name: '推荐',
          url: 'rest/home/recommend'
        },
        {
          name: '热点',
          url: 'rest/home/hotSpot'
        },
        {
          name: '视频',
          url: '/rest/video'
        },
        {
          name: '图片',
          url: '/rest/picture'
        },
        {
          name: '全部',
          url: 'rest/home'
        }
      ],
      previousUrl: ''
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
      let data = getList(url, 'GET', this)
      this.articles = data
      this.previousUrl = url
    },
    search () {
      let mv = this
      let header = {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')// 读取cookie
      }
      let url = this.previousUrl + '?_format=json&title=' + this.searchId + '&body=' + this.searchId + ''
      this.$http.request(url, {hh: 5}, {
        method: 'GET',
        headers: header,
        timeout: 5000
      }).then(function (data) {
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
    }
  },
  onLoad () {
    let mv = this
    let header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync('sessionid')// 读取cookie
    }
    this.$http.request('rest/home', {hh: 5}, {
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
      mv.previousUrl = 'rest/home'
    }).catch(function (err) {
      console.log(err.status, err.message)
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
    top: 0;
    width:100%;
    height: 70px;
    background: #D33E42;
    text-align: center;
    z-index: 50;
  }

  .search{
    display: flex;
    margin: 0 auto;
    width: 80%;
    height: 35px;
    background: #FFF;
    border-radius: 5px;
    color: #000;
    margin-bottom: 10px;
  }

  .search-box {
    margin: 5px 0 0 0;
    line-height: 35px;
    text-align: left;
  }

  .search-icon {
    width: 30px;
    height: 30px;
    margin: 10px 0 0 10px;
    background: url(../../../static/img/search.png) no-repeat;
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

  .article-img {
    width: 30% !important;
    height: 80px;
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
</style>
