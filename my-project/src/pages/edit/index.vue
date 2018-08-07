<template>
  <div>
    <div class="create-content">
      <div class="form-group">
        <textarea class="textarea-content-title" id="content-title" v-model="titleMessage" placeholder="填写标题"></textarea>
        <textarea class="textarea-content" id="content-body" v-model="contentMessage" placeholder="填写内容"></textarea>
        <button class="btn-upload-video" @click="selectVideo">上传视频</button>
        <button class="btn-upload-img" @click="selectImage">上传图片</button>
      </div>
      <div class="show-select">
        <div class="show-select-img">
          <div class="show-select-img-icon" v-for="(item, index) in imageFiles" :key="index">
            <img :src="item.path" @click="previewImage(item.path)" class="select-img"/>
            <img src="/static/img/errors.png" class="delete-img" @click="deleteSelectImage(index)" />
          </div>
        </div>
        <div class="show-select-video">
          <video :src="videoFile" controls="controls" v-if="videoFile !== ''"></video>
          <img src="/static/img/errors.png" class="delete-img" @click="deleteSelectVideo()" v-if="videoFile !== ''"/>
        </div>
      </div>
      <div class="upload-create">
        <button class="btn-create" @click="uploadFileImg">发布</button>
      </div>
    </div>
  </div>
</template>
<script>
import {chooseImage, chooseVideo} from '@/utils/upload'

export default {
  data () {
    return {
      imageFiles: [],
      videoFile: '',
      titleMessage: '',
      contentMessage: '',
      hasImg: false,
      hasVideo: false,
      id: ''
    }
  },
  methods: {
    deleteSelectImage (index) {
      this.imageFiles.splice(index, 1)
    },
    deleteSelectVideo () {
      this.videoFile = ''
    },
    previewImage (path) {
      wx.previewImage({
        current: path,
        urls: [path]
      })
    },
    selectImage () {
      chooseImage(9).then((resolve) => {
        this.imageFiles = resolve.tempFiles
      })
    },
    selectVideo () {
      chooseVideo().then((resolve) => {
        this.videoFile = resolve.tempFilePath
      })
    },
    uploadFileImg (data) {
      let that = this
      let i = data.i ? data.i : 0
      let finishNum = data.finishNum ? data.finishNum : 0
      let failNum = data.failNum ? data.failNum : 0
      let fileIds = data.fileIds ? data.fileIds : []
      // let length = this.imageFiles.length
      let fileLength = this.imageFiles.length
      if (fileLength === 0) {
        console.log(data)
        that.uploadFileVideo(fileIds)
      } else {
        wx.uploadFile({
          url: 'http://localhost:81/wechart/upload/file?_format=json',
          filePath: this.imageFiles[i].path,
          name: 'file',
          formData: {
            'user': 'test'
          },
          header: {
            'content-type': 'multipart/form-data',
            'cookie': wx.getStorageSync('sessionid')
          },
          success: function (res) {
            finishNum++
            fileIds.push(res.data)
            that.hasImg = true
          },
          fail: (res) => {
            failNum++
          },
          complete: () => {
            i++
            if (i !== fileLength) {
              data.i = i
              data.finishNum = finishNum
              data.failNum = failNum
              data.fileIds = fileIds
              that.uploadFileImg(data)
            } else {
              that.uploadFileVideo(fileIds)
            }
          }
        })
      }
    },
    uploadFileVideo (fileIds) {
      let that = this
      if (this.videoFile.length === 0) {
        console.log(fileIds)
        this.createContent(fileIds)
      } else {
        wx.uploadFile({
          url: 'http://localhost:81/wechart/upload/file?_format=json',
          filePath: this.videoFile,
          name: 'file',
          formData: {
            'user': 'test'
          },
          header: {
            'content-type': 'multipart/form-data',
            'cookie': wx.getStorageSync('sessionid')
          },
          success: function (res) {
            fileIds.push(res.data)
            that.hasVideo = true
          },
          complete: () => {
            this.createContent(fileIds)
          }
        })
      }
    },
    createContent (fileIds) {
      let that = this
      let data = {
        body: this.contentMessage,
        fileIds: fileIds,
        title: this.titleMessage,
        hasImg: this.hasImg,
        hasVideo: this.hasVideo,
        nid: this.id
      }
      console.log(data)
      this.$http.post('/wechart/hello/edit?_format=json', data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': wx.getStorageSync('sessionid')
        }
      }).then((resp) => {
        console.info(resp)
        wx.showToast({
          title: '修改成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        that.imageFiles = ''
        that.videoFile = ''
        that.titleMessage = ''
        that.contentMessage = ''
        that.hasImg = false
        that.hasVideo = false
      }).catch(() => {
        console.info('error')
      })
    }
  },
  onLoad () {
    this.imageFiles = []
    this.videoFile = ''
    let nid = wx.getStorageSync('editnId')
    this.id = nid
    let mv = this
    let header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync('sessionid')// 读取cookie
    }
    this.$http.request('/rest/detail/' + nid, {hh: 5}, {
      method: 'GET',
      headers: header,
      timeout: 5000
    }).then(function (data) {
      // mv.articles = data.data
      let dataMessage = data.data[0]
      console.log(dataMessage)
      mv.titleMessage = dataMessage.title
      mv.contentMessage = dataMessage.body
      let files = dataMessage.field_video.split(',')
      for (let i in files) {
        if (files[i].indexOf('.mp4') > 0) {
          mv.videoFile = files[i]
        } else {
          mv.imageFiles.push({path: 'http://localhost:81' + files[i]})
          wx.getImageInfo({
            src: this.imageFiles[i].path,
            success: function (res) {
              mv.imageFiles[i].path = res.path
              console.log(res.path)
            }
          })
        }
      }
    }).catch(function (err) {
      console.log(err.status, err.message)
    })
  }
}
</script>
<style lang="scss" scoped>
  .create-content {
    width: 100%;
    .form-group {
      width: 100%;

      .textarea-content {
        height: 400rpx;
        width: 100%;
        border-top: solid 1px  #BBBBBB;
        border-bottom: solid 1px  #BBBBBB;
      }

      .textarea-content-title {
        height: 200rpx;
        width: 100%;
        border-top: solid 1px  #BBBBBB;
        border-bottom: solid 1px  #BBBBBB;
        margin-bottom: 20rpx;
      }

      .btn-upload-img {
        display: inline-block;
        width: 30%;
        margin-left: 50px;
        margin-top: 10px;
        color: white;
        background-color: #F0878A;
      }

      .btn-upload-video {
        display: inline-block;
        width: 30%;
        color: white;
        margin-left: 50px;
        margin-top: 10px;
        background-color: #F0878A;
      }
    }

    .upload-create {
      padding: 0;
      width: 100%;
      margin-top: 10px;
      position: fixed;
      bottom: 0;

      .btn-create {
        color: white;
        background-color: #F0878A;
      }
    }
  }

  .show-select {
    width: 100%;
    margin-top: 20px;

    .show-select-img {
      width: 100%;

      .show-select-img-icon {
        width: 100px;
        height: 100px;
        float: left;
        margin-left: 10px;

        .select-img {
          width: 100%;
          height: 100%;
        }

        .delete-img {
          position: relative;
          top: -110px;
          right: -90px;
          width: 30px;
          height: 30px;
        }
      }
    }

    .show-select-video {
      width: 95%;
      margin: 0 auto;

      video {
        width: 300px;
        height: 250px;
      }

      .delete-img {
        position: relative;
        top: -240px;
        right: 25px;
        width: 30px;
        height: 30px;
        z-index: 100;
      }
    }
  }
</style>
