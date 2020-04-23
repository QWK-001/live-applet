Page({
  data: {
    activeName: "正在直播中",
    list: [
    ]
  },
  golive() {
    wx.navigateTo({
      url: `/pages/live/live`,
    })
  }
})