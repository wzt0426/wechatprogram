function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function getList (url, method, mv) {
  let vue = mv
  let header = {
    'content-type': 'application/json',
    'cookie': wx.getStorageSync('sessionid')// 读取cookie
  }
  vue.$http.request(url, {hh: 5}, {
    method: method,
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
  return mv.articles
}
export function formatDate (data) {
  let date = new Date(data).getTime()
  let now = new Date().getTime()
  let res = now - date
  let created = ''
  if (res <= 60000) {
    created = '刚刚'
  } else if (res > 60000 && res <= 3600000) {
    created = Math.floor(res / 6000) + '分钟前'
  } else if (res > 3600000 && res <= 86400000) {
    created = Math.floor(res / 3600000) + '小时前'
  } else {
    created = data.split(' ')[0]
  }
  return created
}

export function getRelatedList (url, method, mv) {
  // let relatedList = ''
  let header = {
    'content-type': 'application/json',
    'cookie': wx.getStorageSync('sessionid')// 读取cookie
  }
  mv.$http.request(url, {hh: 5}, {
    method: method,
    header: header,
    timeout: 5000
  }).then(function (data) {
    mv.relatedList = data.data
    console.log(mv.relatedList)
  }).catch(function (err) {
    console.log(err.status, err.message)
  })
  return mv.relatedList
}

export default {
  formatNumber,
  formatTime,
  getList,
  formatDate,
  getRelatedList
}
