var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    buttons: [{ text: '关闭' }],
    height: 0,
    hostShow: false, //主播详情弹窗
    isAttention: false, // 关注主播
    danmuList: [
      {
        text: '这是我的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '小程序直播哦',
        color: '#ff00ff',
        time: 3
      }],
    commentList: [{
      name: '一直玫瑰花',
      info: '这是环信的直播吧'
    },
    {
      name: '一路信服',
      info: '是的吧'
    },
    {
      name: '我是一直廊',
      info: '我也是刚听说就来看看'
    },
    {
      name: '一路信服',
      info: '是的吧'
    },
    {
      name: '一路信服',
      info: '是的吧'
    },
    ],
    src: '/images/bgImg.jpg',
    showInput: false,
    isDanmu: false
  },
  onLoad: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          commentHeight: res.windowHeight - 550,
          height: res.windowHeight
        });
      }
    });
  },
  //点击出现输入框
  showInput: function () {
    this.setData({
      showInput: true
    })
  },
  //隐藏输入框
  onHideInput: function () {
    this.setData({
      showInput: false
    })
  },

  // 显示主播详情页面
  showHostDetail() {
    this.setData({
      hostShow: true
    })
  },
  // 点击关注
  clickAttention() {
    this.setData({
      isAttention: !this.data.isAttention
    })
  },
  // 弹幕开关
  switchChange() {
    this.setData({
      isDanmu: !this.data.isDanmu
    });
  },
  tapDialogButton(e) {
    this.setData({
      hostShow: false,
    })
  },
  // 键盘输入时触发
  bindInputMsg(e) {
    console.log('e>>>', e);
  },
  //发送弹幕
  sendTextMsg() {
    this.onHideInput()
  },
  // 退出直播间
  exitLiveRoom() {
    console.log('退出');
  },
  // 点赞
  giveLike() {

  },
  // 显示礼物弹窗
  giftModa(){

  }
});