<template>
  <div class="detail-page">
    <div class="up-article">
        <div class="up-title">
            {{article.title}}
        </div>
        <div class="title-message">
            <img :src="userPicture" class="head-portrait" />
            <div class="article-message">
                <p class="title-message">{{userName}}</p>
                <p class="publish-message">{{article.created}}</p>
            </div>
            <div class="article-body">
                {{article.body}}
            </div>
            <div class="article-img">
              <div class="img-show" v-for="(img, index) in imgall" :key="index">
                <img :src="'http://localhost:81'+img"  class="imgitem"/>
              </div>
              <div class="img-show" v-for="(video, index) in videoall" :key="index">
                <video :src="'http://localhost:81'+video"  class="imgitem"/>
              </div>
            </div>
            <div class="up-tags">
                <span v-for="(tag, index) in tags " :key="index" class="tag-item">{{tag}}</span>
            </div>
            <div class="up-flag">
                <div class="flag-like">
                    <img class="like-img" :src="likeSrc" @click="clickLike()" />
                    <span>{{article.count_2}}</span>
                </div>
                <div class="flag-collect">
                    <img class="collect-img" :src="markSrc" @click="clickMark()" />
                    <span>{{article.count_3}}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="Recommends">
      <div>
        <p class="Recommend-item" v-for="(related, index) in relatedList" :key="index" v-if="index < 2">{{related.title_1}}</p>  
      </div>
    </div>
    <div class="commentList">
      <div class="comment-item">
        <div class="comment" v-for="(comment, index) in comments" :key="index">
          <div class="img-comment-portrait"><img :src="comment.pictureShow"/></div>
          <div class="comment-message">
            <div class="comment-nameshow">
              <span class="author">{{comment.nameShow}}</span>
              <span class="author" v-if="comment.parent_commentator_name"><span class="title-black">回复了</span> {{comment.parent_commentator_name}}</span>
              <span class="like-comment">
                <img  @click="gotoComment(comment.cid)" class="parent-comment-icon" src="/static/img/comment.png" />
                <span  class="parent-comment-count">{{comment.commentCount}}</span>
                <img v-if="comment.flagged === '0'" @click="clickCommentFlag(comment.flagged, comment.cid)" class="comment-flag-icon" src="/static/img/noLike.png" />
                <img v-if="comment.flagged === '1'" @click="clickCommentFlag(comment.flagged, comment.cid)" class="comment-flag-icon" src="/static/img/like.png" />
                <span  class="comment-flag-cont">{{comment.comment_flag_count}}</span>
              </span> 
            </div>
            <div class="comment-bodyshow"><rich-text :nodes="comment.comment_body"></rich-text></div>
            <div class="comment-created">{{comment.created}}</div>
          </div>  
        </div>
      </div>
    </div>
    <div class="tapBar">
      <span class="write-comment" @click="gotoComment()">
        <img class="img-edit" src="/static/img/edit.png" />
      </span>
      <span>写评论...</span>
      <span class="img-picture">
        <span class="img-botoom"><img :src="likeSrc" /></span>
        <span class="img-botoom"><img :src="markSrc" /></span>
        <span class="img-botoom"><img src="/static/img/comment.png" /></span>
      </span>
    </div>
  </div>
</template>
<script>
import {formatDate} from '../../utils/index'
import {getRelatedList} from '@/utils/index.js'

export default {
  data () {
    return {
      article: '',
      userName: '',
      userPicture: '',
      markSrc: '',
      likeSrc: '',
      likeclick: '',
      bookclick: '',
      tags: [],
      id: '',
      comments: [],
      commentpre: [],
      imgall: '',
      videoall: '',
      relatedList: ''
    }
  },
  methods: {
    gotoComment (pid) {
      let nid = this.$root.$mp.query.nid
      let tags = this.$root.$mp.query.tags
      let url = '/pages/comment/main?nid=' + nid + '&tags=' + tags
      if (pid) {
        url = '/pages/comment/main?nid=' + nid + '&pid=' + pid + '&tags=' + tags
      }
      wx.navigateTo({url})
    },
    clickLike () {
      let mv = this
      wx.request({
        url: 'http://localhost:81' + this.likeclick,
        method: 'GET',
        header: {
          'Cookie': wx.getStorageSync('sessionid')
        },
        success: function (res) {
          console.info(res)
          // let url = '/pages/detail/main'
          // wx.navigateTo({url})
        }
      })
      this.getDetail(mv.id)
    },
    clickMark () {
      let mv = this
      wx.request({
        url: 'http://localhost:81' + this.bookclick,
        method: 'GET',
        header: {
          'Cookie': wx.getStorageSync('sessionid')
        },
        success: function (res) {
          console.info(res)
          // let url = '/pages/detail/main'
          // wx.navigateTo({url})
        }
      })
      this.getDetail(mv.id)
    },
    clickCommentFlag (flagged, cid) {
      // let nid = this.$root.$mp.query.nid
      // let tags = this.$root.$mp.query.tags
      let mv = this
      console.log(flagged)
      if (flagged === '1') {
        this.commentFlag = '/flag/unflag/comment_flag_one/' + cid
      } else {
        this.commentFlag = '/flag/flag/comment_flag_one/' + cid
      }
      let url = 'http://localhost:81' + this.commentFlag
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'cookie': wx.getStorageSync('sessionid')
        },
        success: function (res) {
          console.log(url)
        }
      })
      this.getComment(mv.id)
    },
    getDetail (nid) {
      let mv = this
      let header = {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')// 读取cookie
      }
      this.$http.request('rest/detail/' + nid, {hh: 5}, {
        method: 'GET',
        headers: header,
        timeout: 5000
      }).then(function (data) {
        // mv.articles = data.data
        let dataMessage = data.data
        mv.article = dataMessage[0]
        mv.tags = dataMessage[0].field_tags.split(',')
        if (dataMessage[0].user_picture === '') {
          mv.userPicture = dataMessage[0].field_wechatpicture
        } else {
          mv.userPicture = 'http://localhost:81' + dataMessage[0].user_picture
        }
        if (dataMessage[0].field_nickname === '') {
          mv.userName = dataMessage[0].name
        } else {
          mv.userName = dataMessage[0].field_nickname
        }
        if (dataMessage[0].flagged === 'Yes') {
          mv.likeSrc = '/static/img/like.png'
          mv.likeclick = '/flag/unflag/like/' + mv.id
        } else {
          mv.likeSrc = '/static/img/noLike.png'
          mv.likeclick = '/flag/flag/like/' + mv.id
        }

        if (dataMessage[0].flagged_1 === 'Yes') {
          mv.markSrc = '/static/img/collect.png'
          mv.bookclick = '/flag/unflag/bookmark/' + mv.id
        } else {
          mv.markSrc = '/static/img/notCollect.png'
          mv.bookclick = '/flag/flag/bookmark/' + mv.id
        }
        let imglist = []
        let videolist = []
        if (dataMessage[0].field_video !== '') {
          let text = dataMessage[0].field_video.split(',')
          for (let i = 0; i < text.length; i++) {
            let videolength = text[i].split('.').length
            if (text[i].split('.')[videolength - 1] === 'mp4') {
              videolist = text
            } else {
              imglist = text
            }
          }
        }
        mv.imgall = imglist
        mv.videoall = videolist
        if (mv.tags[0]) {
          let relatedUrl = 'rest/detail/' + mv.id + '/relatedList?tag=' + mv.tags[0]
          mv.relatedList = getRelatedList(relatedUrl, 'GET', mv)
          console.log(mv.relatedList)
          console.log(relatedUrl)
        }
      }).catch(function (err) {
        console.log(err.status, err.message)
      })
    },
    getComment (nid) {
      let mv = this
      let header = {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')// 读取cookie
      }
      mv.$http.request('/rest/detail/' + this.id + '/commentsList', {hh: 5}, {
        method: 'GET',
        headers: header,
        timeout: 5000
      }).then(function (data) {
        mv.commentpre = data.data
        console.log(mv.commentpre)
        for (let i in mv.commentpre) {
          mv.commentpre[i].created = formatDate(mv.commentpre[i].created)
          if (mv.commentpre[i].field_nickname === '') {
            mv.commentpre[i].nameShow = mv.commentpre[i].name
          } else {
            mv.commentpre[i].nameShow = mv.commentpre[i].field_nickname
          }
          if (mv.commentpre[i].user_picture === '') {
            mv.commentpre[i].pictureShow = mv.commentpre[i].field_wechatpicture
          } else {
            mv.commentpre[i].pictureShow = 'http://localhost:81' + mv.commentpre[i].user_picture
          }
        }
        let thecommentListOne = mv.commentpre
        let thecommentListTwo = mv.commentpre
        let nameitem = ''
        for (let i in thecommentListOne) {
          nameitem = thecommentListOne[i].cid
          let k = 0
          for (let j in thecommentListTwo) {
            if (nameitem === thecommentListTwo[j].pid) {
              k = k + 1
            }
          }
          console.log(nameitem)
          thecommentListOne[i].commentCount = k
        }
        console.log(thecommentListOne)
        mv.comments = thecommentListOne
      }).catch(function (err) {
        console.log(err.status, err.message)
      })
    }
  },
  onLoad () {
    let nid = wx.getStorageSync('article_id')
    this.id = nid
    // let mv = this
    // let header = {
    //   'content-type': 'application/json',
    //   'cookie': wx.getStorageSync('sessionid')// 读取cookie
    // }
    wx.request({
      url: 'http://localhost:81/node/' + this.id + '',
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync('sessionid')
      },
      success: res => {
        console.log(this.url)
      }
    })
    wx.setNavigationBarTitle({
      title: '详情',
      color: '#101010'
    })
    this.getDetail(nid)
    this.getComment(nid)
  }
}
</script>
<style lang="scss" scoped>
  .detail-page {
      width: 90%;
      margin-left: 5%;

      .up-article {
        margin-bottom: 60px;
        .up-title {
            font-size: 25px;
            margin-bottom: 10px;
        }
        .title-message {
          margin-top: 10px;
          .head-portrait {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }

          .article-message {
            float: right;
            margin-right: 60%;

            .title-message {
              font-size: 10px;
            }
            .publish-message {
              font-size: 10px;
              color: #AEAEAE;
            }
          }

          .article-body {
            margin-top: 10px;
            margin-bottom: 20px;
          }

          .article-img {
            margin-top: 10px;
            margin-bottom: 20px;

            .img-show {
              margin-bottom: 20px;
              .imgitem {
                height: 200px;
                width: 300px;
                margin-left: 20px;
              }
            }

          }

          .up-tags {
            margin-bottom: 20px;

            .tag-item {
              background-color: #F4F5F7;
              padding-left: 20px;
              padding-right: 20px;
            }
          }

          .up-flag {
            margin-top: 10px;
            margin-bottom: 20px;
            .flag-like {
              float: left;
              margin-left: 20%;
              .like-img {
                width: 16px;
                height: 16px;
              }
            }

            .flag-collect {
              float: right;
              margin-right: 20%;

              .collect-img {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
  }

  .Recommends {
    margin-top: 10px;
    margin-bottom: 10px;
    
    .Recommend-item {
      margin-bottom: 10px;
      background-color:#F4F5F7;
    }
  }

  .commentList {
    margin-top: 20px;
    width: 100%;
    .comment-item {
      width: 100%;
      .comment {
        margin-top: 20px;
        width: 100%;
        overflow:auto;
        .img-comment-portrait {
          float: left;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }

        .comment-message {
          float: right;
          width: 77%;
          margin-right: 20px;

          .comment-nameshow {
            margin-top: 10px;

            .author {
              color: #72869F;
            }

            .like-comment {
              float: right;

              .comment-flag-cont {
                margin-left: 5px;
              }
            }
          }

          .comment-bodyshow {
            font-size: 15px;
            margin-top: 10px;
          }

          .comment-created {
            font-size: 10px;
            margin-top: 10px;
          }
        }
      }
    }
  }

  .tapBar {
    margin-top: 20px;
    padding: 0;
    position: fixed;
    bottom: 0;
    background-color: #F4F5F7;

    .write-comment {
      img {
        width: 20px;
        height: 20px;
      }
    }

    .img-picture {
      margin-left: 160px;

      img {
        width: 20px;
        height: 20px;
        margin-left: 10px;
      }
    }
  }
  .comment-flag-icon {
    margin-left: 5px;
    width: 20px;
    height: 20px;
  }

  .parent-comment-icon {
    width: 20px;
    height: 20px;
  }

  .title-black {
    color: black;
  }
  
</style>

