<template>
  <div class="comment">
    <button class="create-comment" hover-class="btn-hover" @click="createComment">发布评论</button>
    <textarea v-model="commentBody" class="comment-content" placeholder="评论点什么..." rows="5" cols="100" id="comment-content"></textarea>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commentBody: '',
      baseUrl: 'http://localhost:81/'
    }
  },
  methods: {
    createComment () {
      if (!this.commentBody) {
        wx.showToast({
          title: '请填写评论',
          icon: 'none',
          duration: 2000
        })
      } else {
        let nid = wx.getStorageSync('article_id')
        let pid = this.$root.$mp.query.pid
        let tags = this.$root.$mp.query.tags
        let url = this.baseUrl + 'rest/comment/reply/node/' + nid + '/comment'
        console.log(url)
        if (pid) {
          url = this.baseUrl + 'rest/comment/reply/node/' + nid + '/comment/' + pid
        }
        let mv = this
        let data = {
          commentBody: this.commentBody
        }
        console.log(this.commentBody)
        console.log(url)
        wx.request({
          url: url,
          data: data,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': wx.getStorageSync('sessionid')// 读取cookie
          },
          success: function (res) {
            console.log(res)
            mv.commentBody = ''
            let url = '/pages/detail/main?nid=' + nid + '&tags=' + tags
            wx.navigateTo({url})
          },
          fail: function (message) {
            console.log(message)
          }
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .comment {
    .create-comment {
      width: 100px;
      height: 40px;
      color: #FFF;
      background: #D33E42;
      border-radius: 5px;
      margin: 10px auto;
      line-height: 40px;
    }
    .btn-hover {
      background: #F0878A;
    }
    .comment-content {
      border: 1px solid #BBB;
      width:350px;
      height:270px;
      margin:20px auto;
    }
  }
</style>

