let app = getApp();

Page({
  data: {
    height: 0,
    imgUrl: '/images/3.png'
  },
  onLoad(){
  },
  //设置
  set() {
    wx.navigateTo({
      url: '/pages/abount/abount',
    })
  },
})