const app = getApp();
Page({
  data: {
    height: 0,
    list: [
    ]
  },
  onLoad() {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          height: res.windowHeight
        })
      },
    })
  },
  golive() {
    wx.navigateTo({
      url: `/pages/live/live`,
    })
  }
})