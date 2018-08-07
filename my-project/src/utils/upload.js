/**
 * 从本地相册选择图片或使用相机拍照。
 * @param {number} count 最多可选图片的数量
 * @param {array} sizeType original 原图，compressed 压缩图
 * @param {array} sourceType album 从相册选图，camera 使用相机
 */
export function chooseImage (count = 1, sizeType = ['compressed'], sourceType = ['album', 'camera']) {
  return new Promise((resolve, reject) => wx.chooseImage({ count, sizeType, sourceType, success: resolve, fail: reject }))
}
/**
 * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
 * @param {boolean} compressed 是否压缩
 * @param {array} sourceType album 从相册选图，camera 使用相机
 * @param {number} maxDuration 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
 */
export function chooseVideo (compressed = true, sourceType = ['album', 'camera'], maxDuration = 60) {
  return new Promise((resolve, reject) => wx.chooseVideo({ sourceType, compressed, maxDuration, success: resolve, fail: reject }))
}
